# Mike Stillman's Requests: Garbage Collector Changes in Macaulay2

Extracted from the Zoom recording of the Macaulay2 engine meeting (`zoom_recording.vtt`).
Speakers: Michael (Mike) Stillman, Michael Burr, Andrew Tawfeek, Dima Pasechnik.
Timestamps below reference the recording.

---

## 1. The Overall Goal — A Roadmap, Not Total Removal

**(~00:31:15 – 00:31:33, ~00:35:58 – 00:36:22)**

Mike's headline request, prompted by the availability of Claude Fable for a large chunk of work:

> "If you could give us a roadmap on how to get rid of the garbage collector."

However, he immediately clarified the scope when Andrew proposed drafting a proposal:

> "So, it's **not** to get rid of the garbage collector. The garbage collector … should be set up **only for things in the interface directory**."

**Key points:**

- The deliverable Andrew agreed to produce (with Fable's help) is a **detailed proposal/roadmap document**, not a giant pull request of sweeping changes. It should have:
  - An overview detailed enough for the humans to follow, and
  - Enough detail for "Opus or one of the lesser agents later to follow," so the proposal can be edited before any implementation.
- The garbage collector (GC) should **remain** for objects that talk to the front end (user-facing objects), but should be **removed from the computational core of the engine**.

---

## 2. Background: How the Current GC Works and Why It's a Problem

**(~00:31:42 – 00:33:18)**

Mike's explanation of the current state, which the roadmap must account for:

- Macaulay2 uses the **Boehm–Demers (Boehm-Demers-Weiser) incremental garbage collector**.
- It is a **conservative** collector: "it does not know anything about the data at all." It scans for things that *look like pointers* to data it knows about, then frees/reclaims what is unreachable.
- Because it follows anything pointer-shaped, "if there's an integer in there that looks like a pointer and it follows it, it could get garbage" — i.e., it may accidentally retain more memory than necessary. Overall it "does a pretty good job," but:
- **It is slow.** Mike used to estimate roughly a **20% performance hit**, but now says "sometimes it's a **multiple-times hit** … it spends too much time in garbage collection."
- **At top level (front end), GC is fine — even good** — because the user doesn't have to worry about memory management. The problem is inside engine computations.

**(~00:40:20 – 00:41:25)** Reiterated when Andrew asked him to restate the goal:

- "The garbage collector is great for **user objects** … they just go away when you don't need them anymore … that tends to work quite well."
- "But if you're using them in the middle of actual computation, it can really slow things down a lot."
- He originally assumed the GC was such a good memory manager it might even speed things up — "that was a little naive on my part."
- Empirical observation: "**whenever we can get rid of the garbage collector inside of any computation type, then it speeds things way up.**"

---

## 3. Specific Request: A-Ring and DMAT Computations Should Not Be Garbage Collected

**(~00:33:19 – 00:33:44)**

> "In the engine, it would be really nice if **all A-ring computations were not garbage collected**, if **all matrix — DMAT-type — computations were not** [garbage collected]."

---

## 4. Specific Request: Split the `Matrix` Type into GC and Non-GC Variants

**(~00:33:35 – 00:34:03, ~00:35:58 – 00:36:54)**

The most concrete structural change requested:

- The type `Matrix` (he says "mat, matrix, rather") should be **split into two types**:
  1. One that **is garbage collected** — this is the one that "is going to talk to the front end."
  2. One that **is not garbage collected** — "engine only; you have to free it yourself."
- There must be **ways of going back and forth** between the two:
  - "You can take things that map into garbage-collected memory or back."
  - "If you want to send something to the front end, you can just copy it into garbage-collected memory and ignore it."
- Alternative design he floated: an object holding non-GC memory internally (which would leak if lost), managed via **finalization** (see §5).
- Mike admits: "**I don't know exactly how to do that, so that would be the thing**" — i.e., working out this split is exactly what he wants the proposal/roadmap to figure out.

### Ownership discipline for the non-GC engine type

**(~00:36:22 – 00:37:07)**

The engine-only (non-GC) objects should be managed "kind of like you would manage **Rust objects**":

- Use **references** when you don't have (and don't want) ownership.
- Use the **object itself, or a pointer to the object** — specifically **`std::unique_ptr`** ("a unique pointer") — when you own it.

---

## 5. Finalization Mechanism (Existing Practice to Build On)

**(~00:34:12 – 00:35:10)**

Mike described the existing escape hatch for non-GC memory inside GC-visible objects:

- You can **finalize** objects: "you tell the garbage collector, hey, when this one goes out of scope, I want you to call this other function."
- Registration is per-object, "but typically it's on a per-class basis, for real."
- Example: **monomial ideals** (and a few other things) are finalized today and get removed when out of scope.
- He notes this global-ownership information is "**hard to get cracked**" — another thing Fable/the proposal could help untangle.

---

## 6. Known Wart: `coefficientRing` / ARingRR Is the One GC'd A-Ring

**(~00:06:26 – 00:07:00, ~00:43:54 – 00:44:31)**

Raised twice; the roadmap needs to deal with it:

- When you use the **coefficient ring R** as a simple/A-ring, the data is **already garbage-collected memory**. "Eventually I would like to **remove that and not make it garbage-collected memory**, but at the moment there might be some issue. It seems to work mostly okay … but I don't know exactly why that would be the case."
- Later: all A-ring types are "really basic rings," not built-up polynomial rings, **except the coefficient ring R**, which is used to create basic rings like a fraction field. "Those **are** garbage collected, so all of a sudden there's **one A-ring type that is garbage collected and none of the other ones are**. So you have to deal with that issue. That's kind of annoying."

---

## 7. Related Request: Cache-Friendly (Non-Linked-List) Polynomial Representation

**(~00:41:07 – 00:43:53)**

Separate from, but adjacent to, the GC work:

- Several engine types are **linked lists** — notably **polynomials** — and "that just does not play well with cache."
- Mike has existing versions (with **Frank Moore**) of flattened representations he "would like to make more central":
  - Polynomials as "really just a couple arrays," with **all the monomials flattened out**.
  - Two options he sketched: (a) one whole array of integers holding all monomials; (b) an array of variable-length objects — but (b) has a problematic two-layer structure with variable lengths.
  - Justification for a single flat array: "with polynomials it's extremely rare that you're doing random access into the middle … if you're going into that, you're doing the whole thing," so read-from-the-front is fine.
- His hesitations, stated openly: flattening "simplifies the code, but … it locks you in a little bit"; old C-style hacks (e.g., GMP's array-of-length-1 type trick) give great cache coherence but "whenever you're hacking things, it confuses people later on."
- He can "imagine having a **polynomial type that is not linked lists**" as an A-ring type; a couple already exist in the system but not as A-ring types.

---

## 8. Flint Integration and the GC Conflict

**(~00:48:50 – 00:50:07, ~00:57:53 – 00:58:18)**

Why Flint's fast types can't currently be defaults — a GC-rooted problem the roadmap could address:

- Flint's **ZZ (integers) and QQ (rationals) should be the default** A-ring implementations "but they're not" — solely **because of the garbage collector**:
  - The GC "cannot deal with encoded Flint integers." Flint encodes small integers inline (shifted with a tag bit), so the value "certainly won't look like a pointer, and it won't be the exact pointer value" — the conservative GC can't trace it.
  - Consequently, "things that go to the front end have to be **GMP integers**," forcing translation.
- On Dima's question of whether the Boehm GC could be *taught* to handle Flint's encoding: "It **might be teachable** at this point … maybe Claude or something could help us figure out how to do that. But the garbage collection code is … not completely trivial code. **I'm not sure I personally want to go in and muck around with it.**"
- Historical warning for anyone touching this: Flint's old `FLINT_USES_GC` mode kept a side array of in-use GMP numbers as a GC root; combined with finalization it caused re-entrant modification of that list during collection — "a hellhole … one of the worst bugs," which took Mike forever to find. It worked without finalization, "but as soon as you put finalization into it," it broke. (~00:52:00 – 00:56:52)
- Desired direction: "**I would like to get more of the Flint rings inside of Macaulay2**" — e.g., a Flint multivariate-polynomial A-ring, or number fields (started with Frank Moore, abandoned partly because Flint's per-ring APIs are "not very orthogonal"). A Flint-backed A-ring "would be a fun A-ring to try."
- Related design stance on Flint multivariate polynomials (~00:45:09): probably right to have a top-level Macaulay2 type that uses them for fast arithmetic/matrices, and **translate/flatten the data** when doing Gröbner basis computations, even though he originally avoided switching representations back and forth.

---

## 9. Process Requests: How to Use Claude Fable for This

**(~00:35:13 – 00:35:58, ~00:37:09 – 00:37:54, ~01:10:12 – 01:10:52)**

- Andrew proposed, and Mike agreed, that between this meeting and the next week Andrew would work with Fable to **draft a proposal for replacing/scoping the garbage collector** — explicitly *not* a giant PR — guided by Mike's notes; the group then edits the proposal.
- Mike explicitly authorized feeding the **meeting transcript itself into Fable** as instructions: "What I'm saying is maybe a little too vague, but maybe you could get something useful out of it. … You're certainly allowed to do that, as far as I'm concerned." (Michael Burr agreed to post the recording assets promptly for this purpose.)
- Broader Fable ideas Mike raised for the engine:
  - Have it "really try to understand the structure, and maybe even suggest **how we could modernize the C++ code**." (~00:30:46)
  - **"To put it on the transcript: reorganizing the linear algebra code … would be very nice."** He was never 100% happy with the ~15-year-old organization and would like "Claude/Fable involved in trying to find a better way of doing that organization." (~01:10:12 – 01:10:52)

---

## Summary Checklist of Actionable GC Requests

1. **Draft a roadmap/proposal document** (not a PR) for scoping down the garbage collector, detailed enough for both humans and later AI agents to execute.
2. **Restrict GC to the `interface` directory** / front-end-facing objects only.
3. **Make all A-ring computations non-GC.**
4. **Make all DMAT (dense matrix) computations non-GC.**
5. **Split `Matrix` into two types** — GC'd (front-end-facing) and non-GC (engine-only, manually freed) — with copy/translation functions between them.
6. Adopt **Rust-style ownership** conventions (references for borrowing, `std::unique_ptr` for ownership) for engine-only objects.
7. Leverage/clean up the existing **finalization** mechanism for objects wrapping non-GC memory.
8. **Remove GC memory from `coefficientRing` R** (the one GC'd A-ring type) — resolve why it currently "mostly works."
9. (Adjacent) Replace **linked-list polynomial representations** with flattened, cache-coherent array-based ones.
10. (Adjacent) Investigate whether the **Boehm GC can be taught to handle Flint's encoded integers**, enabling **Flint ZZ/QQ as defaults** and more Flint rings as A-rings — while heeding the historical `FLINT_USES_GC` finalization bug.
