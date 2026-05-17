const nodes = [
  {
    id: "repo",
    title: "Macaulay2 repository",
    path: ".",
    kind: "root",
    accent: "var(--ink)",
    source: "README.md",
    summary:
      "The wrapper repository for a research codebase whose buildable source, algorithms, and runtime layers live one level down in M2/.",
    details: [
      "The top-level README is the main navigation index for researchers trying to move between mathematical concepts and implementation sites.",
      "Contribution notes, citation metadata, and repository-wide agent guidance live beside M2/."
    ]
  },
  {
    id: "m2",
    parent: "repo",
    title: "M2 source root",
    path: "M2/",
    kind: "source root",
    accent: "var(--green)",
    source: "M2/README.md",
    summary:
      "The actual source root containing Macaulay2, build glue, third-party library wrappers, packaging, headers, and version metadata.",
    details: [
      "CMake and autotools are parallel build systems. Pick one build tree and keep its state separate.",
      "VERSION is the single source of truth for the project version."
    ]
  },
  {
    id: "version",
    parent: "m2",
    title: "VERSION",
    path: "M2/VERSION",
    kind: "metadata",
    accent: "var(--gold)",
    source: "M2/README.md",
    summary: "Single source of truth for the Macaulay2 project version.",
    details: [
      "Read by both CMake and autotools, then surfaced through generated runtime files."
    ]
  },
  {
    id: "macaulay2",
    parent: "m2",
    title: "Macaulay2 source code",
    path: "M2/Macaulay2/",
    kind: "source",
    accent: "var(--blue)",
    source: "M2/Macaulay2/README.md",
    summary:
      "All core source code: the translator, interpreter, C++ engine, Core language, distributed mathematical packages, tests, docs, editors, and final binary glue.",
    details: [
      "The main research path runs through the four-language stack: c/, d/, e/, and m2/.",
      "Packages, executable linkage, developer docs, editor grammar generation, and integration tests surround that stack."
    ]
  },
  {
    id: "cmake",
    parent: "m2",
    title: "CMake modules",
    path: "M2/cmake/",
    kind: "build",
    accent: "var(--red)",
    source: "M2/cmake/README.md",
    summary:
      "Modern build orchestration: configure options, library detection, library source builds, scc1 invocation, startup generation, packaging, and profiling helpers.",
    details: [
      "Find*.cmake modules locate dependencies and feed missing ones into build-libraries.cmake.",
      "scc.cmake builds and invokes the .d/.dd translator. startup.cmake bakes runtime paths into the binary."
    ]
  },
  {
    id: "libraries",
    parent: "m2",
    title: "Autotools library wrappers",
    path: "M2/libraries/",
    kind: "build",
    accent: "var(--red)",
    source: "M2/libraries/README.md",
    summary:
      "Per-library build wrappers for the autotools build when required third-party libraries are not already present.",
    details: [
      "Each library subdirectory mirrors an upstream dependency and usually contains a Makefile.in.",
      "The CMake equivalent is split between Find*.cmake and build-libraries.cmake."
    ]
  },
  {
    id: "submodules",
    parent: "m2",
    title: "Vendored upstream sources",
    path: "M2/submodules/",
    kind: "dependencies",
    accent: "var(--gold)",
    source: "M2/submodules/README.md",
    summary:
      "Git submodules for bundled dependencies such as bdwgc, flint, frobby, fflas-ffpack, givaro, googletest, mathic, mathicgb, and memtailor.",
    details: [
      "A fully self-contained checkout needs git submodule update --init --recursive.",
      "The M2-emacs submodule lives separately under Macaulay2/editors/emacs/."
    ]
  },
  {
    id: "distributions",
    parent: "m2",
    title: "Distribution packaging",
    path: "M2/distributions/",
    kind: "packaging",
    accent: "var(--violet)",
    source: "M2/distributions/README.md",
    summary:
      "Packaging machinery for tarballs, macOS disk images, FreeBSD ports, install helpers, and top-level distribution templates.",
    details: [
      "The user-facing INSTALL file is generated from distributions/top/INSTALL.in.",
      "Deb and rpm packaging is driven from BUILD/ and CPack configuration."
    ]
  },
  {
    id: "include",
    parent: "m2",
    title: "Shared headers",
    path: "M2/include/",
    kind: "headers",
    accent: "var(--green)",
    source: "M2/include/README.md",
    summary: "Generated and shared C/C++ headers used across the source tree.",
    details: [
      "include/M2/ holds public M2 C/C++ headers. include/valgrind/ bundles Valgrind client headers."
    ]
  },
  {
    id: "files",
    parent: "m2",
    title: "Auxiliary files",
    path: "M2/files/",
    kind: "runtime",
    accent: "var(--green)",
    source: "M2/files/README.md",
    summary: "Auxiliary files bundled with the Macaulay2 distribution.",
    details: ["These files are installed alongside runtime data rather than compiled sources."]
  },
  {
    id: "m4",
    parent: "m2",
    title: "Autoconf macros",
    path: "M2/m4/",
    kind: "build",
    accent: "var(--red)",
    source: "M2/m4/README.md",
    summary: "Autoconf m4 macros used by the legacy autotools configuration path.",
    details: ["These support configure.ac and the Makefile.in-based build flow."]
  },
  {
    id: "check-configure",
    parent: "m2",
    title: "Configure checks",
    path: "M2/check-configure/",
    kind: "build",
    accent: "var(--red)",
    source: "M2/check-configure/README.md",
    summary: "Configure-time sanity checks used before deeper build work begins.",
    details: ["Useful when debugging why a dependency, compiler, or platform check failed."]
  },
  {
    id: "build",
    parent: "m2",
    title: "BUILD workspace",
    path: "M2/BUILD/",
    kind: "build output",
    accent: "var(--gold)",
    source: "M2/BUILD/README.md",
    summary:
      "Conventional out-of-tree build location. CMake blocks in-source builds, and CI uses M2/BUILD/build.",
    details: [
      "Autotools expects to run from two levels deep, typically M2/BUILD/build/.",
      "Docker build helpers and packaging-specific build directories live here too."
    ]
  },
  {
    id: "c",
    parent: "macaulay2",
    title: "c/ translator",
    path: "M2/Macaulay2/c/",
    kind: "layer 1",
    accent: "var(--green)",
    source: "M2/Macaulay2/c/README.md",
    summary:
      "scc1, the compiler-compiler that translates the interpreter's .d/.dd sources into ordinary C/C++ before the normal compiler takes over.",
    details: [
      ".d is a safer C-like language with sum types, type-cased pattern matching, GC pointers, and inline C escape hatches.",
      "The plain README in this directory is the syntax specification."
    ]
  },
  {
    id: "d",
    parent: "macaulay2",
    title: "d/ interpreter",
    path: "M2/Macaulay2/d/",
    kind: "layer 2",
    accent: "var(--blue)",
    source: "M2/Macaulay2/d/README.md",
    summary:
      "Interpreter sources written mostly in .d and .dd: parsing, evaluation, runtime types, FFI, threading, and the bridge from M2-level calls into the C++ engine.",
    details: [
      "scc1 emits generated .c/.cpp and .sig files from this directory.",
      "engine.dd and interface.dd connect the interpreter to the C++ engine."
    ]
  },
  {
    id: "e",
    parent: "macaulay2",
    title: "e/ engine",
    path: "M2/Macaulay2/e/",
    kind: "layer 3",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/README.md",
    summary:
      "The C++ mathematical kernel where performance-critical algebra lives: rings, monoids, matrices, modules, Groebner bases, resolutions, Hilbert functions, LLL, numerical algebraic geometry, and more.",
    details: [
      "Start here when optimizing a computation, changing data representation, or tracing mathematical behavior below the M2 language layer.",
      "New public entry points belong in e/interface/ rather than the older x-*.cpp flat layout.",
      "Engine memory management uses Boehm GC through helpers such as our_new_delete and our_new_gc."
    ]
  },
  {
    id: "m2core",
    parent: "macaulay2",
    title: "m2/ Core language",
    path: "M2/Macaulay2/m2/",
    kind: "layer 4",
    accent: "var(--violet)",
    source: "M2/Macaulay2/m2/README.md",
    summary:
      "The .m2 files loaded at startup that define the Core package: method dispatch, mathematical objects, documentation machinery, package loading, and user-facing wrappers over engine calls.",
    details: [
      "The loadsequence file controls startup order.",
      "Editing this layer requires rebuilding M2-core so startup data is regenerated."
    ]
  },
  {
    id: "packages",
    parent: "macaulay2",
    title: "Distributed packages",
    path: "M2/Macaulay2/packages/",
    kind: "packages",
    accent: "var(--green)",
    source: "M2/Macaulay2/packages/README.md",
    summary:
      "User-contributed packages shipped with Macaulay2. Each is Foo.m2 or Foo.m2 plus a sibling Foo/ directory.",
    details: [
      "=distributed-packages controls what ships and is whitespace-sensitive.",
      "installPackage rebuilds docs, runs examples, and updates the info database. loadPackage is faster for code iteration."
    ]
  },
  {
    id: "bin",
    parent: "macaulay2",
    title: "bin/ final binary",
    path: "M2/Macaulay2/bin/",
    kind: "runtime",
    accent: "var(--blue)",
    source: "M2/Macaulay2/bin/README.md",
    summary:
      "Final M2 executable linkage: interpreter, engine, and a startup shim that locates runtime data.",
    details: [
      "startup.c.cmake is configured with install paths. M2.in handles uninstalled development builds.",
      "Use the wrapper M2/BUILD/build/M2 instead of the inner M2-binary when developing."
    ]
  },
  {
    id: "system",
    parent: "macaulay2",
    title: "system/ supervisor",
    path: "M2/Macaulay2/system/",
    kind: "runtime",
    accent: "var(--gold)",
    source: "M2/Macaulay2/system/README.md",
    summary:
      "Thread supervisor process and support code for worker threads, cancellation, thread-safe files, mutexes, and GC-friendly STL allocation.",
    details: [
      "The supervisor centralizes interrupt and thread bookkeeping.",
      "Thread APIs surface through d/threads.dd and m2/threads.m2."
    ]
  },
  {
    id: "editors",
    parent: "macaulay2",
    title: "editors/ grammar generation",
    path: "M2/Macaulay2/editors/",
    kind: "tooling",
    accent: "var(--violet)",
    source: "M2/Macaulay2/editors/README.md",
    summary:
      "Templates and generated grammar files for Emacs, Prism, Pygments, Vim, and related syntax highlighting tooling.",
    details: [
      "Do not hand-edit per-editor symbol lists when generation is available.",
      "The M2-emacs repository is a submodule under editors/emacs."
    ]
  },
  {
    id: "docs",
    parent: "macaulay2",
    title: "docs/ developer docs",
    path: "M2/Macaulay2/docs/",
    kind: "docs",
    accent: "var(--blue)",
    source: "M2/Macaulay2/docs/README.md",
    summary:
      "Sphinx and Doxygen configuration for developer-facing C++ engine documentation, aimed at people reading and improving e/.",
    details: [
      "This is separate from end-user M2 documentation, which is generated by document.m2 and installPackage."
    ]
  },
  {
    id: "tests",
    parent: "macaulay2",
    title: "tests/ integration suites",
    path: "M2/Macaulay2/tests/",
    kind: "tests",
    accent: "var(--red)",
    source: "M2/Macaulay2/tests/README.md",
    summary:
      "Top-level CTest suites for regression, examples, threading, rationality, large computations, and integration behavior.",
    details: [
      "Package-level tests live under packages/. Engine gtests live under e/unit-tests/.",
      "Language self-checks run with M2 -q --check 1, 2, and 3."
    ]
  },
  {
    id: "man",
    parent: "macaulay2",
    title: "man/ man pages",
    path: "M2/Macaulay2/man/",
    kind: "docs",
    accent: "var(--blue)",
    source: "M2/Macaulay2/man/README.md",
    summary: "Unix man page source, separate from both package docs and engine developer docs.",
    details: ["Installed as command-line reference material for users."]
  },
  {
    id: "html-check-links",
    parent: "macaulay2",
    title: "html-check-links/",
    path: "M2/Macaulay2/html-check-links/",
    kind: "tests",
    accent: "var(--red)",
    source: "M2/Macaulay2/html-check-links/README.md",
    summary: "HTML link checker used by make check.",
    details: ["This protects generated documentation from stale internal or external links."]
  },
  {
    id: "engine-interface",
    parent: "e",
    title: "interface/",
    path: "M2/Macaulay2/e/interface/",
    kind: "engine API",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/interface/README.md",
    summary:
      "Modern public C interface of the engine, where C++ internals become stable interpreter-callable operations.",
    details: [
      "Each area header/source pair should be self-contained and avoid depending on engine.h.",
      "Matching interpreter bindings belong in d/<area>.dd and M2 wrappers in m2/<area>.m2."
    ]
  },
  {
    id: "engine-areas",
    parent: "e",
    title: "top-level engine areas",
    path: "M2/Macaulay2/e/*.md",
    kind: "engine map",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/README.md",
    summary:
      "Grouped documentation for top-level engine source files: coefficient rings, polynomial rings, monoids, matrices, free modules, Groebner bases, resolutions, computations, ring elements, and utilities.",
    details: [
      "These markdown files are the best entry point before opening individual C++ files or changing mathematical algorithms.",
      "Single-file deep dives use the file-<basename>.md convention."
    ]
  },
  {
    id: "f4",
    parent: "e",
    title: "f4/",
    path: "M2/Macaulay2/e/f4/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/f4/README.md",
    summary: "Original F4 Groebner basis engine.",
    details: ["Contains F4 computation, pair sets, monomial hash tables, and the M2 interface layer."]
  },
  {
    id: "gb-f4",
    parent: "e",
    title: "gb-f4/",
    path: "M2/Macaulay2/e/gb-f4/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/gb-f4/README.md",
    summary: "Refactored F4 Groebner basis implementation.",
    details: ["See file-GBF4Computation.md, file-MacaulayMatrix.md, and file-Basis.md for focused tours."]
  },
  {
    id: "schreyer",
    parent: "e",
    title: "schreyer-resolution/",
    path: "M2/Macaulay2/e/schreyer-resolution/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/schreyer-resolution/README.md",
    summary: "F4-style free resolutions via Schreyer frames.",
    details: ["Pairs with resolution code and free-module machinery."]
  },
  {
    id: "nc-algebras",
    parent: "e",
    title: "NCAlgebras/",
    path: "M2/Macaulay2/e/NCAlgebras/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/NCAlgebras/README.md",
    summary: "Non-commutative free algebras and Groebner basis code.",
    details: ["Includes FreeMonoid, FreeAlgebra, NCGroebner, and NCF4 file deep dives."]
  },
  {
    id: "nc-resolutions",
    parent: "e",
    title: "NCResolutions/",
    path: "M2/Macaulay2/e/NCResolutions/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/NCResolutions/README.md",
    summary: "Non-commutative free resolution machinery.",
    details: ["The file-nc-res-computation.md note is the focused entry point."]
  },
  {
    id: "bibasis",
    parent: "e",
    title: "bibasis/",
    path: "M2/Macaulay2/e/bibasis/",
    kind: "engine subdir",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/bibasis/README.md",
    summary: "Involutive Janet basis code for Boolean rings.",
    details: ["Includes file-bibasis.md, file-polynom.md, file-monom.md, and file-janettree.md."]
  },
  {
    id: "unit-tests",
    parent: "e",
    title: "unit-tests/",
    path: "M2/Macaulay2/e/unit-tests/",
    kind: "tests",
    accent: "var(--red)",
    source: "M2/Macaulay2/e/unit-tests/README.md",
    summary: "GoogleTest suite for C++ engine behavior.",
    details: ["Add or update tests here when changing public engine interface routines."]
  },
  {
    id: "engine-docs",
    parent: "e",
    title: "doxygen-settings/",
    path: "M2/Macaulay2/e/doxygen-settings/",
    kind: "docs",
    accent: "var(--blue)",
    source: "M2/Macaulay2/e/doxygen-settings/README.md",
    summary: "Doxygen configuration fragments used by the Sphinx developer docs build.",
    details: ["Feeds API extraction for the developer docs site."]
  },
  {
    id: "coeff-rings",
    parent: "engine-areas",
    title: "coefficient rings",
    path: "M2/Macaulay2/e/coefficient-rings.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/coefficient-rings.md",
    summary: "aring dispatch, ZZ, QQ, finite fields, FLINT-backed rings, and coefficient arithmetic.",
    details: ["Start here for aring-* files and concrete coefficient implementations."]
  },
  {
    id: "poly-rings",
    parent: "engine-areas",
    title: "polynomial rings",
    path: "M2/Macaulay2/e/polynomial-rings.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/polynomial-rings.md",
    summary: "PolynomialRing, quotient rings, local rings, Weyl algebras, skew polynomial rings, and solvable algebras.",
    details: ["This area describes ring construction and polynomial representation internals."]
  },
  {
    id: "monoids",
    parent: "engine-areas",
    title: "monoids and monomials",
    path: "M2/Macaulay2/e/monoids-and-monomials.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/monoids-and-monomials.md",
    summary: "Monoid representation, monomial orderings, exponent vectors, and monomial tables.",
    details: ["A useful companion to polynomial ring and Groebner basis work."]
  },
  {
    id: "matrices",
    parent: "engine-areas",
    title: "matrices",
    path: "M2/Macaulay2/e/matrices.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/matrices.md",
    summary: "Dense, sparse, mutable, and specialized matrix machinery.",
    details: ["Matrix changes often touch both e/interface/matrix.* and m2/matrix*.m2."]
  },
  {
    id: "free-modules",
    parent: "engine-areas",
    title: "free modules",
    path: "M2/Macaulay2/e/free-modules.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/free-modules.md",
    summary: "FreeModule, Schreyer orders, and module structures used by resolutions and Groebner work.",
    details: ["Pairs naturally with matrices, monomial orderings, and resolution code."]
  },
  {
    id: "groebner",
    parent: "engine-areas",
    title: "Groebner bases",
    path: "M2/Macaulay2/e/groebner-bases.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/groebner-bases.md",
    summary: "GB computations, default algorithms, F4 variants, mathicgb bridge, reduced bases, pairs, and weights.",
    details: ["The largest computation area and one of the best-documented engine entry points."]
  },
  {
    id: "resolutions",
    parent: "engine-areas",
    title: "resolutions",
    path: "M2/Macaulay2/e/resolutions.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/resolutions.md",
    summary: "Free resolution computations, older res-a* implementations, Schreyer code, and Betti displays.",
    details: ["Use with free module and Groebner documentation when tracing a resolution computation."]
  },
  {
    id: "computations",
    parent: "engine-areas",
    title: "other computations",
    path: "M2/Macaulay2/e/computations.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/computations.md",
    summary: "Hilbert functions, LLL, numerical algebraic geometry, straight-line programs, associated primes, and combinatorics.",
    details: ["A catch-all for major algorithms that do not fit only one algebraic object type."]
  },
  {
    id: "ring-elements",
    parent: "engine-areas",
    title: "ring elements and maps",
    path: "M2/Macaulay2/e/ring-elements-and-maps.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/ring-elements-and-maps.md",
    summary: "RingElement, RingMap, free algebra bridge code, and element-level operations.",
    details: ["Important boundary area between abstract rings, maps, matrices, and the interpreter."]
  },
  {
    id: "utilities",
    parent: "engine-areas",
    title: "utilities",
    path: "M2/Macaulay2/e/utilities.md",
    kind: "engine area",
    accent: "var(--gold)",
    source: "M2/Macaulay2/e/utilities.md",
    summary: "Buffers, text I/O, errors, debug helpers, overflow checks, memory blocks, and generic support code.",
    details: ["These files provide shared infrastructure used across the engine."]
  }
];

const pipeline = [
  "engine-areas",
  "e",
  "engine-interface",
  "d",
  "m2core",
  "packages",
  "unit-tests",
  "cmake"
];

const mathAtlas = [
  "coeff-rings",
  "poly-rings",
  "monoids",
  "matrices",
  "free-modules",
  "groebner",
  "resolutions",
  "computations",
  "ring-elements",
  "utilities"
];

const workflows = [
  {
    title: "Trace a mathematical operation",
    summary: "Follow a user-visible M2 call down to the engine routine that performs the computation.",
    steps: [
      ["m2core", "Start with the Core wrapper that exposes the operation to users."],
      ["d", "Find the interpreter binding and marshaling in .d or .dd."],
      ["engine-interface", "Cross the public C interface boundary."],
      ["e", "Read the C++ engine implementation and data representation."],
      ["engine-areas", "Use the area docs to understand neighboring algorithms and invariants."]
    ]
  },
  {
    title: "Add an engine-backed operation",
    summary: "The common path for turning a new internal algorithm into a usable Macaulay2 operation.",
    steps: [
      ["engine-areas", "Locate the right mathematical neighborhood first."],
      ["e", "Implement the internal C++ routine in e/."],
      ["engine-interface", "Expose a C-callable entry point in e/interface/<area>."],
      ["d", "Bind it in the interpreter, usually d/<area>.dd or engine.dd."],
      ["m2core", "Wrap it for users in the matching m2/<area>.m2 file."],
      ["unit-tests", "Add or update an engine gtest in e/unit-tests/."]
    ]
  },
  {
    title: "Optimize an algorithm",
    summary: "A performance-oriented path through math code, memory conventions, tests, and build loops.",
    steps: [
      ["engine-areas", "Identify the relevant object model or computation family."],
      ["e", "Inspect data structures, allocation helpers, and algorithm hot paths."],
      ["submodules", "Check linked libraries such as FLINT, mathicgb, fflas-ffpack, or bdwgc when the bottleneck crosses into dependencies."],
      ["cmake", "Use profiling and targeted rebuilds to keep iteration tight."],
      ["tests", "Run focused CTest suites and language self-checks before broad validation."]
    ]
  },
  {
    title: "Document an engine subsystem",
    summary: "Turn internal knowledge into navigable docs for the next researcher entering the code.",
    steps: [
      ["engine-areas", "Start with the grouped area docs or add a file-<basename>.md deep dive."],
      ["docs", "Use Sphinx and Doxygen for developer-facing C++ API material."],
      ["m2core", "Use document.m2 and related formatters for user-facing language documentation."],
      ["packages", "Package docs are rebuilt through installPackage."],
      ["html-check-links", "Validate generated HTML links after documentation changes."]
    ]
  },
  {
    title: "Work on a package",
    summary: "For mathematical packages, keep code iteration fast and reserve full doc/example rebuilds for checkpoints.",
    steps: [
      ["packages", "Edit Foo.m2 and optional package support files under Foo/."],
      ["packages", "Use loadPackage(\"Foo\", Reload => true) while iterating."],
      ["packages", "Run check \"Foo\" for package tests."],
      ["packages", "Run installPackage \"Foo\" when docs, examples, or info DB need rebuilding."],
      ["cmake", "Add package dependency rules in packages/CMakeLists.txt if external libraries are needed."]
    ]
  },
  {
    title: "CMake build path",
    summary: "Preferred build flow for local engine work and macOS CI.",
    steps: [
      ["cmake", "Configure with cmake -GNinja -S M2 -B M2/BUILD/build."],
      ["cmake", "Build missing third-party pieces with build-libraries and build-programs."],
      ["macaulay2", "Build M2-core and M2-emacs."],
      ["packages", "Install and check packages when package output matters."],
      ["tests", "Use CTest for unit, package, and integration suites."]
    ]
  },
  {
    title: "Autotools build path",
    summary: "Legacy but still supported, and still used by Linux CI.",
    steps: [
      ["build", "Work from M2/BUILD/build/, two levels below M2/."],
      ["libraries", "Run autogen.sh and configure, then build missing libraries."],
      ["d", "Build the interpreter and generated .d/.dd output."],
      ["e", "Link the engine into the final binary."],
      ["tests", "Run make check and the HTML link checker."]
    ]
  },
  {
    title: "Find a computation in the engine",
    summary: "Use the mathematical area files before opening individual C++ files.",
    steps: [
      ["engine-areas", "Start with the grouped engine area docs."],
      ["groebner", "For GB work, follow comp-gb*, gb-*, reducedgb*, gbring, and mathicgb notes."],
      ["matrices", "For matrix behavior, check matrix*, dmat*, smat, and mutablemat groups."],
      ["engine-interface", "Trace public calls through e/interface/."],
      ["d", "Follow interpreter calls back through d/engine.dd."]
    ]
  }
];

const byId = new Map(nodes.map((node) => [node.id, node]));
const children = new Map();
for (const node of nodes) {
  if (!node.parent) continue;
  if (!children.has(node.parent)) children.set(node.parent, []);
  children.get(node.parent).push(node.id);
}

const state = {
  selected: "repo",
  view: "architecture",
  query: "",
  expanded: new Set([
    "repo",
    "m2",
    "macaulay2",
    "e",
    "engine-areas",
    "cmake",
    "packages"
  ])
};

const treeEl = document.querySelector("#tree");
const detailsEl = document.querySelector("#details");
const mapCanvas = document.querySelector("#mapCanvas");
const searchInput = document.querySelector("#searchInput");
const matchCount = document.querySelector("#matchCount");
const selectedKind = document.querySelector("#selectedKind");
const mapTitle = document.querySelector("#mapTitle");
const mapSubtitle = document.querySelector("#mapSubtitle");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function sourceHref(source) {
  if (!source) return "#";
  return `../${source}`;
}

function searchableText(node) {
  return [
    node.title,
    node.path,
    node.kind,
    node.summary,
    ...(node.details || [])
  ]
    .join(" ")
    .toLowerCase();
}

function nodeMatches(node) {
  if (!state.query) return true;
  return searchableText(node).includes(state.query);
}

function hasMatchingDescendant(id) {
  return (children.get(id) || []).some((childId) => {
    const child = byId.get(childId);
    return nodeMatches(child) || hasMatchingDescendant(childId);
  });
}

function visibleInTree(id) {
  if (!state.query) return true;
  const node = byId.get(id);
  return nodeMatches(node) || hasMatchingDescendant(id);
}

function highlight(value) {
  const escaped = escapeHtml(value);
  if (!state.query) return escaped;
  const query = state.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(`(${query})`, "ig"), "<mark>$1</mark>");
}

function setSelected(id) {
  if (!byId.has(id)) return;
  state.selected = id;
  let cursor = byId.get(id);
  while (cursor && cursor.parent) {
    state.expanded.add(cursor.parent);
    cursor = byId.get(cursor.parent);
  }
  render();
}

function toggleExpanded(id) {
  if (state.expanded.has(id)) {
    state.expanded.delete(id);
  } else {
    state.expanded.add(id);
  }
  renderTree();
}

function renderTreeBranch(id) {
  if (!visibleInTree(id)) return "";
  const node = byId.get(id);
  const childIds = (children.get(id) || []).filter(visibleInTree);
  const hasChildren = childIds.length > 0;
  const isExpanded = state.query || state.expanded.has(id);
  const toggle = hasChildren ? (isExpanded ? "-" : "+") : "";
  const childMarkup =
    hasChildren && isExpanded
      ? `<ul>${childIds.map((childId) => renderTreeBranch(childId)).join("")}</ul>`
      : "";

  return `
    <li>
      <div class="tree-node">
        <button class="tree-toggle" type="button" data-toggle="${id}" ${
    hasChildren ? `aria-expanded="${isExpanded}"` : "disabled"
  }>${toggle}</button>
        <button class="tree-label ${state.selected === id ? "is-selected" : ""}" type="button" data-select="${id}">
          <span class="tree-title">${highlight(node.title)}</span>
          <span class="tree-tag">${escapeHtml(node.kind)}</span>
        </button>
      </div>
      ${childMarkup}
    </li>`;
}

function renderTree() {
  treeEl.innerHTML = `<ul>${renderTreeBranch("repo")}</ul>`;
  const matches = state.query
    ? nodes.filter((node) => nodeMatches(node)).length
    : nodes.length;
  matchCount.textContent = `${matches} ${matches === 1 ? "node" : "nodes"}`;
}

function renderDetails() {
  const node = byId.get(state.selected);
  selectedKind.textContent = node.kind;
  const parent = node.parent ? byId.get(node.parent) : null;
  const childNodes = (children.get(node.id) || []).map((id) => byId.get(id));
  const relatives = [
    parent ? `<button type="button" data-select="${parent.id}">Parent: ${escapeHtml(parent.title)}</button>` : "",
    ...childNodes
      .slice(0, 6)
      .map((child) => `<button type="button" data-select="${child.id}">${escapeHtml(child.title)}</button>`)
  ]
    .filter(Boolean)
    .join("");

  detailsEl.innerHTML = `
    <h2>${escapeHtml(node.title)}</h2>
    <a class="details__path" href="${sourceHref(node.source)}">${escapeHtml(node.path)}</a>
    <p>${escapeHtml(node.summary)}</p>
    <h3>Research notes</h3>
    <ul>${(node.details || []).map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>
    <h3>Source note</h3>
    <p>Summarized from <a href="${sourceHref(node.source)}">${escapeHtml(node.source || "README.md")}</a>.</p>
    <div class="detail-links">
      ${relatives}
    </div>`;
}

function renderArchitecture() {
  mapTitle.textContent = "Internals";
  mapSubtitle.textContent = "From mathematical idea to shipped code";
  mapCanvas.innerHTML = `
    <div class="architecture">
      <section class="architecture-intro">
        <p>Primary route</p>
        <h2>Start from the mathematical subsystem, then follow the boundary crossings.</h2>
      </section>
      ${pipeline
        .map((id, index) => {
          const node = byId.get(id);
          return `
            <button class="flow-card ${state.selected === id ? "is-selected" : ""}" type="button" data-select="${id}" style="--accent:${node.accent}">
              <span class="flow-index">${String(index + 1).padStart(2, "0")}</span>
              <span class="flow-copy">
                <h2>${escapeHtml(node.title)}</h2>
                <p>${escapeHtml(node.summary)}</p>
              </span>
              <span class="flow-path">${escapeHtml(node.path)}</span>
            </button>`;
        })
        .join("")}
      <section class="atlas">
        <div class="atlas-head">
          <p>Mathematical engine atlas</p>
          <span>Jump to the subsystem before touching files</span>
        </div>
        <div class="atlas-grid">
          ${mathAtlas
            .map((id) => {
              const node = byId.get(id);
              return `
                <button class="atlas-card ${state.selected === id ? "is-selected" : ""}" type="button" data-select="${id}" style="--accent:${node.accent}">
                  <span>${escapeHtml(node.kind)}</span>
                  <strong>${escapeHtml(node.title)}</strong>
                  <small>${escapeHtml(node.summary)}</small>
                </button>`;
            })
            .join("")}
        </div>
      </section>
    </div>`;
}

function depthOf(id) {
  let depth = 0;
  let cursor = byId.get(id);
  while (cursor && cursor.parent) {
    depth += 1;
    cursor = byId.get(cursor.parent);
  }
  return depth;
}

function renderDirectories() {
  mapTitle.textContent = "Directories";
  mapSubtitle.textContent = "Top-down repository structure";
  const visibleNodes = nodes.filter((node) => {
    if (!state.query) return depthOf(node.id) <= 3 || node.parent === "engine-areas";
    return nodeMatches(node) || hasMatchingDescendant(node.id);
  });
  const levels = new Map();
  for (const node of visibleNodes) {
    const depth = depthOf(node.id);
    if (!levels.has(depth)) levels.set(depth, []);
    levels.get(depth).push(node);
  }

  mapCanvas.innerHTML = `
    <div class="directory-board">
      ${[...levels.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([depth, levelNodes]) => {
          return `
            <section class="level-row">
              <div class="level-label">Level ${depth}</div>
              <div class="level-grid">
                ${levelNodes
                  .map((node) => {
                    return `
                      <button class="node-card ${state.selected === node.id ? "is-selected" : ""}" type="button" data-select="${node.id}" style="--accent:${node.accent}">
                        <span class="node-path">${escapeHtml(node.path)}</span>
                        <h2>${highlight(node.title)}</h2>
                        <p>${highlight(node.summary)}</p>
                      </button>`;
                  })
                  .join("")}
              </div>
            </section>`;
        })
        .join("")}
    </div>`;
}

function renderWorkflows() {
  mapTitle.textContent = "Workflows";
  mapSubtitle.textContent = "Common cross-directory paths";
  mapCanvas.innerHTML = `
    <div class="workflow-grid">
      ${workflows
        .map((workflow) => {
          return `
            <article class="workflow-card">
              <h2>${escapeHtml(workflow.title)}</h2>
              <p>${escapeHtml(workflow.summary)}</p>
              <ol>
                ${workflow.steps
                  .map(([id, label]) => {
                    const node = byId.get(id);
                    return `<li><button type="button" data-select="${id}">${escapeHtml(node.title)}</button> ${escapeHtml(label)}</li>`;
                  })
                  .join("")}
              </ol>
            </article>`;
        })
        .join("")}
    </div>`;
}

function renderMap() {
  if (state.view === "architecture") renderArchitecture();
  if (state.view === "directories") renderDirectories();
  if (state.view === "workflows") renderWorkflows();
}

function render() {
  renderTree();
  renderDetails();
  renderMap();
}

document.addEventListener("click", (event) => {
  const selectButton = event.target.closest("[data-select]");
  if (selectButton) {
    setSelected(selectButton.dataset.select);
    return;
  }

  const toggleButton = event.target.closest("[data-toggle]");
  if (toggleButton && !toggleButton.disabled) {
    toggleExpanded(toggleButton.dataset.toggle);
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render();
});

document.querySelectorAll("[data-view]").forEach((button) => {
  button.addEventListener("click", () => {
    state.view = button.dataset.view;
    document.querySelectorAll("[data-view]").forEach((other) => {
      const active = other === button;
      other.classList.toggle("is-active", active);
      other.setAttribute("aria-selected", String(active));
    });
    renderMap();
  });
});

document.querySelector("#expandAll").addEventListener("click", () => {
  nodes.forEach((node) => state.expanded.add(node.id));
  renderTree();
});

document.querySelector("#collapseAll").addEventListener("click", () => {
  state.expanded = new Set(["repo", "m2", "macaulay2"]);
  renderTree();
});

render();
