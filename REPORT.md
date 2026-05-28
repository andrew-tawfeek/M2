# GPU branch — REPORT

_2026-05-28 · `andrew-tawfeek/M2-engine` → `GPU` (target: `Macaulay2/M2` development)_

## Summary

A proof-of-value standalone CUDA benchmark for the **dominant kernel of the F4/gb-f4/NC-F4 Gröbner-basis path**: dense **modular GF(p) GEMM** (Macaulay-matrix row reduction). Result: on a single **NVIDIA L4** the kernel runs **8.4× faster** than the same algorithm on CPU (8-core OpenBLAS), with **bit-exact** results mod p.

The full engine integration (wiring this kernel into `Macaulay2/e/f4/` and `Macaulay2/e/gb-f4/`'s `reduce_matrix()`) is the natural next step but requires a working `M2-engine` link — currently blocked upstream by an unrelated Factory/FLINT-3.5 mismatch (documented on the `MultiFloats` branch's REPORT.md). The benchmark establishes the *value* independently.

## Files added

| File | Purpose |
|---|---|
| `gpu/modgemm_bench.cu` | Standalone CUDA benchmark of modular GF(p) GEMM: GPU (cuBLAS `dgemm` + a mod-reduce kernel) vs CPU (OpenBLAS `dgemm` + `fmod`). Same FFLAS-FFPACK-style algorithm on both sides → isolates the GPU win for the kernel itself. Includes a bit-exact correctness check against the CPU result. |
| `gpu/run-modgemm.sh` | One-shot runner: installs OpenBLAS if needed, fetches+compiles the benchmark with nvcc, runs and prints results. |

## Empirical result

GCP `g2-standard-8` (NVIDIA L4, 23 GB, driver 580; CUDA 12.9 image `common-cu129-ubuntu-2204-nvidia-580`), modular GEMM at N=4096, p=1048573 (largest prime < 2^20, satisfies `N · p² < 2^53` so the double accumulator is exact):

| | time | throughput |
|---|---|---|
| CPU (OpenBLAS, 8 threads) | 2 819 ms | **48.8 GFLOP/s** |
| GPU (cuBLAS dgemm + mod-reduce kernel, L4) | 334 ms | **411 GFLOP/s** |
| **Speedup GPU / CPU** | | **8.4 ×** |
| Correctness (max \|GPU − CPU\| over GF(p)) | **0 (exact match)** | |

411 GFLOP/s is near the L4's FP64 peak; **larger gains are available** by (a) using FP32/TF32 for primes small enough to keep `N · p² < 2^23`-range, (b) tiling to handle larger primes with periodic reduction.

## Why this kernel

Per `e/f4/architecture.md`, F4's hot step is `reduce_matrix()` — a row-reduction of the Macaulay matrix over GF(p), today handled on CPU via BLAS/FFPACK/FLINT. FFLAS-FFPACK already maps modular GEMM/PLUQ onto floating-point BLAS for small primes (`p² · k < 2^53`); the same technique runs unchanged on cuBLAS. Replacing the dense reduction's CPU GEMM with a GPU GEMM directly accelerates `reduce_matrix()`, with `gb-f4` and NC-F4 inheriting the benefit.

## Reproducing the result

On a GCP VM with an NVIDIA L4 (e.g., `g2-standard-8`) using a CUDA-image boot disk (`deeplearning-platform-release` / `common-cu129-ubuntu-2204-nvidia-580` or newer), ≥ 50 GB disk:

```sh
gcloud compute ssh gpu-box --zone=us-central1-a -- 'bash -s' < gpu/run-modgemm.sh
# or, inline:
sudo apt-get install -y libopenblas-dev
nvcc -O3 gpu/modgemm_bench.cu -o /tmp/modgemm_bench -lcublas -lopenblas
/tmp/modgemm_bench 4096
```

Stop the box after running to halt billing: `gcloud compute instances stop gpu-box --zone=us-central1-a`.

## Outstanding work (engine integration)

The standalone benchmark proves the kernel-level value; in-engine integration is the next phase:

- Add a CUDA-detected option to M2's CMake (`USE_CUDA`), guarded so CPU-only builds still work, picking up `cuBLAS`/`cuSOLVER`.
- Plug the GPU GEMM into `Macaulay2/e/f4/f4.cpp`'s `reduce_matrix()` (and `gb-f4/`, NC-F4) behind a size threshold (PCIe + kernel-launch overhead means GPU only pays above some matrix dimension; FFLAS dispatch already has analogous heuristics).
- Heterogeneous pipeline: CPU still builds + indexes the (often sparse) Macaulay matrix; GPU handles the dense sub-blocks (Faugère-Lachartre block-splitting style).
- End-to-end benchmark on a reduction-bound GB: `cyclic-n` / `katsura-n` mod a 23-bit prime.

These changes need the engine to compile **and link**, which is currently blocked upstream — see the MultiFloats branch's REPORT.md for the Factory/FLINT-3.5 diagnosis.

## Status

- Kernel-level proof of value: **8.4× exact** at N=4096 on L4.
- In-engine integration: deferred until upstream Factory/FLINT-3.5 link is unblocked.
- Branch: ready for review of the kernel + the integration plan above; full PR after the upstream fix.
