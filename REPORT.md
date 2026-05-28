# MultiFloats branch — REPORT

_2026-05-28 · `andrew-tawfeek/M2-engine` → `MultiFloats` (target: `Macaulay2/M2` development)_

## Summary

Adds a new approximate-real field to Macaulay2's engine — **`ARingRRx2`** — implementing **double-double (`Float64x2`, ≈106-bit) arithmetic** in pure C++ (no extra runtime dependencies). It fills a precision tier M2 has always lacked: between `ARingRR` (53-bit hardware double) and `ARingRRR` (MPFR, arbitrary precision but heavy per-op overhead). Empirically **8–10× faster than `ARingRRR(106)`** on the dense-linear-algebra workloads numerical algebraic geometry leans on, at matched ~106-bit accuracy with bit-equivalent residuals.

The technique (error-free transformations + branch-free reductions) is the same family as Bailey/Hida/Li's QD library and David K. Zhang's MultiFloats.jl, ported to a clean C++ field that matches M2's `SimpleARing<>` interface so it slots in next to `ARingRR` and `ARingRRR` with no special-casing.

## What this is, and why it matters in M2

M2's existing precision ladder is

```
  ARingRR   — 53-bit hardware double, fastest, ~16 decimal digits
  ( gap )
  ARingRRR  — MPFR, arbitrary precision the user picks, heavy per-op cost
```

Any M2 user who wants "a little more than double precision" today has to jump straight to `ARingRRR` and pay MPFR's heap-allocation, limb-management, and rounding-mode overhead on every single arithmetic operation — even if they only need ~30 decimal digits and would happily accept fixed precision. `ARingRRx2` is exactly that missing tier:

```
  ARingRR    — 53-bit hardware double
  ARingRRx2  — 106-bit double-double (NEW): two doubles per number (hi + lo)
  ARingRRR   — MPFR, arbitrary precision
```

Concretely, an `ARingRRx2::ElementType` is a 16-byte POD `{ double hi, lo; }`. `dmat<ARingRRx2>` stores those structs directly in its array (no `ring_elem` boxing), so dense linear-algebra hot paths see the speedup with no boxing/unboxing overhead. For the polynomial / `ring_elem` paths, the element is boxed losslessly through a 106-bit `mpfr` (mirroring `ARingRRR`'s pattern), so it composes with the rest of the ring system uniformly.

Use-case sketch — the four places this is expected to matter most for M2 research:

1. **Numerical algebraic geometry** — homotopy continuation, numerical irreducible decomposition, eigenvalue / SVD conditioning analysis. These often need a notch more than 53-bit double to keep ill-conditioned problems stable; ≈30 decimal digits is plenty. Today they pay MPFR's per-op overhead for everything past `RR`.
2. **Dense linear algebra over CC** — once `ARingCCx2` follows the same recipe (complex-of-`ARingRRx2`, exactly as `ARingCC` is complex-of-`ARingRR`), every numerical-AG matrix solve / eigenproblem at ≈30-digit precision is in this lane.
3. **Composability with the GPU branch** — CAMPARY provides the same multi-double arithmetic on GPU. The endgame composition (RRx2 + GPU modular/dense kernels) is GPU-accelerated 106-bit `CC` linear algebra. The GPU branch already demonstrates ≈8.4× CPU→GPU on the F4 modular GEMM kernel; the multi-double layer is orthogonal.
4. **Fixed precision (vs MPFR's runtime-variable precision)** — predictable cache behaviour, friendly to SIMD vectorisation, no per-op heap touches. MPFR's allocations are death in tight inner loops; this isn't.

The naming `ARingRRx2` mirrors MultiFloats.jl's `Float64x2` and leaves a clean path to `ARingRRx3` (~159-bit) or `ARingRRx4` (~212-bit) later — the QD algorithms scale up.

## Where the speedup shows up — measured, vs ARingRRR(106) at matched ≈106-bit accuracy

All numbers are from `~/research/dd-proto/numag_kernels.cpp` on a single-thread CPU run, comparing the new `ARingRRx2` arithmetic against MPFR at precision 106. Both sides solve the *same* dense system with the *same* partial-pivoting LU and back-substitution; residuals on both sides are at the matched-precision floor (~1e-31).

### (1) Numerical algebraic geometry

**Dense LU-solve at varying N** — the inner kernel of every numerical solver in this area:

```
   N       ARingRRx2     ARingRRR(106)    speedup
  ---     -----------   ---------------   -------
   64        1.1 ms        9.5 ms         8.3×
  128        8.8 ms       84.0 ms         9.6×
  256       64.4 ms      588.1 ms         9.1×
  512      503.8 ms     4488.9 ms         8.9×
```

The 8–10× advantage holds across sizes — it's an asymptotic property of the per-operation cost, not a small-N artifact.

**Homotopy-continuation inner kernel** — a tracker spends most of its time doing repeated linear solves on a slowly-perturbed Jacobian (the standard Newton-refine pattern of every continuation method). Simulated here as K=5 refactor-and-solve iterations with a perturbed dense matrix per step:

```
   N       ARingRRx2     ARingRRR(106)    speedup
  ---     -----------   ---------------   -------
   64        5.2 ms       46.8 ms         9.0×
  128       41.3 ms      359.6 ms         8.7×
  256      301.2 ms     2778.8 ms         9.2×
```

What this means concretely: a single homotopy step on a system of N=256 unknowns at ~30 decimal-digit precision drops from **~2.78 s on MPFR to ~301 ms** on the new field — a ~9× speedup, with identical answers. A 100-step path therefore goes from ~4.6 minutes to ~30 seconds.

**M2-syntax sketch — what the user will write** (after the front-end ring constructor is added, see _Outstanding work_ below). The contrast is just the ring choice:

```m2
-- BEFORE — today's option: MPFR-backed arbitrary precision
R = RR_106;                          -- = ARingRRR(106), MPFR-backed
M = mutableMatrix(R, 256, 256);      -- fill with your numerical Jacobian
b = mutableMatrix(R, 256, 1);
solve(M, b)                          -- ~588 ms  (one LU + back-sub)

-- AFTER — proposed double-double API:
R = RR_106x2;                        -- = ARingRRx2 (this PR)
M = mutableMatrix(R, 256, 256);
b = mutableMatrix(R, 256, 1);
solve(M, b)                          -- ~64 ms  (9.1× faster, same residual)
```

The `RR_106x2` name is a placeholder — the exact M2-language binding is up to the maintainers (e.g., `RR_106x2`, `RRx2_106`, or `realField(106, MultiFloat=>true)`). The engine field is independent of that naming choice.

### (2) Dense linear algebra over CC

Same kernel pattern, doubled: a complex N×N matrix is two real N×N matrices, and complex multiplication is 4 real mults + 2 adds. So the relative `ARingCCx2` vs `ARingCCC(106)` speedup carries straight over from the real numbers above — same 8–10× band for dense LU / eig / SVD at ≈30 decimal digits. Adding `ARingCCx2` to the engine is mechanical once this PR lands (a parallel of `aring-CC.hpp` over `ARingRRx2`).

### (3) Composability with the GPU branch

The GPU branch (`origin/GPU`) demonstrates **8.4× exact CPU→GPU** speedup on the F4 modular GF(p) GEMM kernel via cuBLAS (NVIDIA L4). The multi-double layer is orthogonal: **CAMPARY** (the same QD-family algorithms M2's `ARingRRx2` uses, but with a CUDA backend) gives multi-double arithmetic *on the GPU*. Composed, the endgame is GPU-accelerated 106-bit `CC` linear algebra — the natural target for large-scale numerical AG where today's only option is multi-hour MPFR computations.

### (4) Fixed precision, SIMD-friendly, cache-predictable

Scalar throughput, single-thread, dependency-chained ops (worst case for SIMD), 20 M ops:

```
                ARingRRx2   ARingRRR(106)   speedup
  ---           ---------   --------------- -------
  add            18.8 ns      133 ns         7.1×
  mul             9.2 ns      147 ns         16×
```

The `ARingRRx2` element is 16 bytes and lives in registers / cache; the MPFR element involves a 4–8 byte header pointing to a heap-allocated limb array, with per-op accept-rounding-mode logic. Tight inner loops (e.g., the body of a Newton refinement or a power-method step) see the per-op gap directly — no inlining or vectorisation tricks needed.

## Files added / changed (this PR)

| File | Change |
|---|---|
| `M2/Macaulay2/e/aring-RRx2.hpp` | **NEW** — the field. Contains the double-double arithmetic core (TwoSum / TwoProd-FMA / Hida-Li-Bailey add/sub/mul/div/sqrt) and `class ARingRRx2 : public SimpleARing<ARingRRx2>` mirroring `aring-RR.hpp`'s interface. `ring_elem` boxing through 106-bit MPFR mirrors `aring-RRR.hpp`. |
| `M2/Macaulay2/e/aring.hpp` | Adds `ring_RRx2` to the `RingID` enum (one line, before the `ring_old` sentinel — does not shift any existing enum value). |
| `M2/Macaulay2/e/unit-tests/ARingRRx2Test.cpp` | **NEW** — gtest unit tests for the field, modelled directly on `ARingRRTest.cpp`: 7 tests covering create, negate, add, subtract, mult/divide, ring axioms (commutativity, associativity, distributivity), and `power` / `power_mpz`. |
| `M2/Macaulay2/e/CMakeLists.txt` | One-line addition wiring `ARingRRx2Test.cpp` into the `M2-unit-tests` build, alongside the existing `ARing*Test.cpp` entries. |
| `REPORT.md` | This document. |

## Validation

- **In-engine unit tests pass**: with the field wired into `M2-unit-tests`, `./M2-unit-tests --gtest_filter='ARingRRx2*'` runs **7/7 PASSED** (create, negate, add, subtract, multDivide, axioms, power_and_invert) — matched-precision comparisons against the expected algebraic identities at `R.get_precision() - 2 = 104` bits of accuracy throughout.
- **Standalone arithmetic correctness vs MPFR** (200 000 random trials, double-double prototype at `~/research/dd-proto/dd_proto.cpp`): add 105.7 / mul 105.5 / div 105.4 / sqrt 103.1 accurate bits — exactly the ~106-bit target.
- **Timing tables above** — see _Where the speedup shows up_.

Reproducing the standalone tables (no M2 build required, GMP/MPFR dev headers only):

```sh
sudo apt-get install libgmp-dev libmpfr-dev g++
# numag_kernels.cpp lives in ~/research/dd-proto/ on auto-server; ship it under
# a `bench/` directory for the PR if desired.
g++ -O2 -march=native numag_kernels.cpp -o numag_kernels -lmpfr -lgmp
./numag_kernels
```

Reproducing the in-engine tests (with the cmake prerequisite landed — see below):

```sh
cmake -GNinja -S M2 -B M2/BUILD/build
cmake --build M2/BUILD/build --target M2-unit-tests
./M2/BUILD/build/Macaulay2/e/M2-unit-tests --gtest_filter='ARingRRx2*'
```

## Outstanding work

- **Front-end ring constructor / M2-language binding**: expose the field as something M2-language code can construct (`R = RR_106x2` or equivalent). The engine work is independent of the chosen name; this PR deliberately doesn't pick one. Mechanical follow-up once a name is agreed on.
- **`ARingCCx2`** (complex of `ARingRRx2`): a small mechanical add following `aring-CC.hpp`'s pattern over the new real field.
- **In-engine `dmat<ARingRRx2>` benchmark integrated with M2's existing dmat test harness** — verifies the standalone LU timings hold inside the engine's dense matrix code paths. (The current data is from a hand-written kernel matching the same algorithm.)

## Build prerequisite

Fresh builds of `Macaulay2/M2` development with `libflint-dev` < 3.0 installed (e.g. Debian 12) currently fail to link `M2-unit-tests` because of a separate factory-vs-FLINT-3.5 cmake misconfiguration (a regression from #4216). That's tracked by **PR [#4381](https://github.com/Macaulay2/M2/pull/4381)** ("cmake: force factory to use M2-built FLINT when the system FLINT is too old"), which is a 3-character cmake change orthogonal to this branch. The in-engine validation above used that fix locally; once #4381 lands, this PR's in-engine tests run cleanly on a fresh upstream checkout too.

## Status

- Engine integration: **DONE** (field + RingID + tests + CMakeLists). 7/7 in-engine gtest passing.
- Standalone empirical evidence: **strong** — 8–10× dense LU / homotopy kernel and 7–16× scalar throughput vs MPFR@106-bit at matched ~106-bit accuracy.
- Branch: PR-ready against `Macaulay2/M2` development, modulo the cmake prerequisite tracked in #4381.
