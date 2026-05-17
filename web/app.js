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

const compactTreeSummaries = new Map(
  Object.entries({
    repo: "Repository overview",
    m2: "Source root",
    version: "Version metadata",
    macaulay2: "Core codebase",
    cmake: "Build modules",
    libraries: "Autotools deps",
    submodules: "Bundled deps",
    distributions: "Packaging",
    include: "Shared headers",
    files: "Runtime files",
    m4: "Autoconf macros",
    "check-configure": "Configure checks",
    build: "Build workspace",
    c: "scc1 translator",
    d: "Interpreter runtime",
    e: "C++ math kernel",
    m2core: "Core language",
    packages: "Distributed packages",
    bin: "Binary linkage",
    system: "Thread supervisor",
    editors: "Editor grammars",
    docs: "Developer docs",
    tests: "Integration tests",
    man: "Man pages",
    "html-check-links": "HTML link checks",
    "engine-interface": "Engine API",
    "engine-areas": "Engine area docs",
    f4: "Original F4",
    "gb-f4": "Refactored F4",
    schreyer: "Schreyer resolutions",
    "nc-algebras": "NC algebras",
    "nc-resolutions": "NC resolutions",
    bibasis: "Janet bases",
    "unit-tests": "Engine gtests",
    "engine-docs": "Doxygen settings",
    "coeff-rings": "Coefficient rings",
    "poly-rings": "Polynomial rings",
    monoids: "Monoids",
    matrices: "Matrices",
    "free-modules": "Free modules",
    groebner: "Groebner bases",
    resolutions: "Resolutions",
    computations: "Misc algorithms",
    "ring-elements": "Elements and maps",
    utilities: "Engine utilities"
  })
);

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
const pinnedExpandedIds = new Set(["repo", "m2", "macaulay2"]);
const sourceToNode = new Map();
for (const node of nodes) {
  if (node.source && !sourceToNode.has(node.source)) {
    sourceToNode.set(node.source, node.id);
  }
}

const children = new Map();
for (const node of nodes) {
  if (!node.parent) continue;
  if (!children.has(node.parent)) children.set(node.parent, []);
  children.get(node.parent).push(node.id);
}

const state = {
  view: "tree",
  selected: "repo",
  activeSource: null,
  activeDefinition: null,
  activeAnchor: null,
  treeContext: null,
  query: "",
  searchFilter: "both",
  expanded: new Set(pinnedExpandedIds)
};

const treeEl = document.querySelector("#tree");
const detailsEl = document.querySelector("#details");
const workspaceEl = document.querySelector(".workspace--tree");
const treeWorkspace = document.querySelector("#treeWorkspace");
const mapView = document.querySelector("#mapView");
const workspaceMap = document.querySelector("#workspaceMap");
const paneResizer = document.querySelector("#paneResizer");
const searchInput = document.querySelector("#searchInput");
const searchFilterEl = document.querySelector("#searchFilter");
const mapToggle = document.querySelector("#mapToggle");
const matchCount = document.querySelector("#matchCount");
const mapCount = document.querySelector("#mapCount");
const selectedKind = document.querySelector("#selectedKind");
const readmeCache = new Map();
let searchIndexPromise = null;
let readmeRequestId = 0;
let treeScrollRequestId = 0;
let isResizingPane = false;
let activeResizePointer = null;

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

function sourceDirectoryHref(source) {
  const href = sourceHref(source);
  const slash = href.lastIndexOf("/");
  return slash === -1 ? "./" : href.slice(0, slash + 1);
}

function sourceFromRenderedHref(href) {
  const url = new URL(href, window.location.href);
  const rootUrl = new URL("../", window.location.href);
  if (!url.href.startsWith(rootUrl.href)) return "";
  return decodeURIComponent(url.href.slice(rootUrl.href.length)).split(/[?#]/)[0];
}

function currentMarkdownSource() {
  if (state.activeSource) return state.activeSource;
  if (state.activeDefinition) return state.activeDefinition.path;
  return byId.get(state.selected)?.source || "";
}

function markdownTargetFromLink(link) {
  const rawHref = link.getAttribute("href") || "";
  const hash = decodeURIComponent(new URL(link.href, window.location.href).hash.replace(/^#/, ""));
  if (rawHref.startsWith("#")) {
    return {
      source: currentMarkdownSource(),
      hash
    };
  }
  return {
    source: sourceFromRenderedHref(link.href),
    hash
  };
}

function isMarkdownSource(source) {
  const fileName = (source.split("/").pop() || "").toLowerCase();
  return fileName === "readme" || fileName.startsWith("readme.") || fileName.endsWith(".md");
}

function sourceDirectory(source) {
  const normalized = String(source || "").split(/[?#]/)[0];
  const slash = normalized.lastIndexOf("/");
  return slash === -1 ? "" : normalized.slice(0, slash + 1);
}

function nodeDirectoryScope(node) {
  if (node.path && node.path.endsWith("/")) return node.path;
  return sourceDirectory(node.source || node.path || "");
}

function treeNodeForSource(source) {
  const exactNode = sourceToNode.get(source);
  if (exactNode) return exactNode;

  const directory = sourceDirectory(source);
  let bestNode = "repo";
  let bestLength = -1;

  for (const node of nodes) {
    const scope = nodeDirectoryScope(node);
    if (directory.startsWith(scope) && scope.length > bestLength) {
      bestNode = node.id;
      bestLength = scope.length;
    }
  }

  return bestNode;
}

function markdownHref(target, source) {
  const trimmed = String(target || "").trim();
  if (!trimmed) return "#";
  if (/^(?:[a-z][a-z0-9+.-]*:|#|\/)/i.test(trimmed)) return trimmed;
  return `${sourceDirectoryHref(source)}${trimmed}`;
}

function linkLeavesMarkdownReader(href) {
  if (!href || href === "#" || href.startsWith("#")) return false;
  const linkedSource = sourceFromRenderedHref(href);
  return !(linkedSource && isMarkdownSource(linkedSource));
}

function renderMarkdownLink(label, target, source) {
  const href = markdownHref(target, source);
  const classes = ["readme-link"];
  if (linkLeavesMarkdownReader(href)) classes.push("readme-link--external");
  const displayLabel = isMarkdownSource(target) ? String(label).replace(/^file-/, "") : label;
  return `<a class="${classes.join(" ")}" href="${escapeHtml(href)}">${escapeHtml(displayLabel)}</a>`;
}

function markdownHeadingText(value) {
  return String(value || "")
    .replace(/!\[([^\]]*)\]\([^)]+\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/[*_~#]/g, "")
    .trim();
}

function markdownHeadingId(value, counts) {
  const base =
    markdownHeadingText(value)
      .toLowerCase()
      .replace(/&amp;/g, "and")
      .replace(/[^a-z0-9 -]/g, "")
      .trim()
      .replace(/\s+/g, "-") || "section";
  const count = counts.get(base) || 0;
  counts.set(base, count + 1);
  return count ? `${base}-${count}` : base;
}

function stashHtml(stash, html) {
  const token = `\uE000${stash.length}\uE001`;
  stash.push(html);
  return token;
}

function restoreStashedHtml(value, stash) {
  let restored = value;
  for (let index = 0; index <= stash.length; index += 1) {
    const next = restored.replace(/\uE000(\d+)\uE001/g, (_, stashIndex) => stash[Number(stashIndex)]);
    if (next === restored) return restored;
    restored = next;
  }
  return restored;
}

function renderInlineMarkdown(value, source) {
  const stash = [];
  let text = String(value || "")
    .replace(/`([^`]+)`/g, (_, code) =>
      stashHtml(stash, `<code>${escapeHtml(code)}</code>`)
    )
    .replace(/!\[([^\]]*)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, alt, href) =>
      stashHtml(
        stash,
        renderMarkdownLink(alt || href, href, source)
      )
    )
    .replace(/\[([^\]]+)\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, (_, label, href) => {
      if (isMarkdownSource(href)) {
        const codeMatch = String(label).match(/^(\d+)$/);
        if (codeMatch) {
          const idx = Number(codeMatch[1]);
          if (stash[idx] && stash[idx].startsWith("<code>file-")) {
            stash[idx] = `<code>${stash[idx].slice("<code>file-".length)}`;
          }
        }
      }
      return stashHtml(stash, renderMarkdownLink(label, href, source));
    });

  text = escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/__([^_]+)__/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>");

  return restoreStashedHtml(text, stash);
}

function splitTableRow(line) {
  return line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split("|")
    .map((cell) => cell.trim());
}

function isTableSeparator(line) {
  return /^(\s*\|)?\s*:?-{3,}:?\s*(\|\s*:?-{3,}:?\s*)+\|?\s*$/.test(line);
}

function renderMarkdownTable(lines, start, source) {
  const header = splitTableRow(lines[start]);
  let cursor = start + 2;
  const rows = [];
  while (cursor < lines.length && lines[cursor].includes("|") && lines[cursor].trim()) {
    rows.push(splitTableRow(lines[cursor]));
    cursor += 1;
  }

  return {
    cursor,
    html: `
      <div class="markdown-table-wrap">
        <table>
          <thead><tr>${header.map((cell) => `<th>${renderInlineMarkdown(cell, source)}</th>`).join("")}</tr></thead>
          <tbody>
            ${rows
              .map((row) => `<tr>${row.map((cell) => `<td>${renderInlineMarkdown(cell, source)}</td>`).join("")}</tr>`)
              .join("")}
          </tbody>
        </table>
      </div>`
  };
}

function renderMarkdown(markdown, source) {
  const lines = String(markdown || "").replace(/\r\n?/g, "\n").split("\n");
  const html = [];
  const headingCounts = new Map();
  let paragraph = [];
  let listType = "";
  let codeLines = null;
  let codeLanguage = "";

  let currentListItem = null;

  const closeParagraph = () => {
    if (!paragraph.length) return;
    html.push(`<p>${renderInlineMarkdown(paragraph.join(" "), source)}</p>`);
    paragraph = [];
  };

  const closeListItem = () => {
    if (!currentListItem) return;
    html.push(`<li>${renderInlineMarkdown(currentListItem.lines.join(" "), source)}</li>`);
    currentListItem = null;
  };

  const closeList = () => {
    closeListItem();
    if (!listType) return;
    html.push(`</${listType}>`);
    listType = "";
  };

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const trimmed = line.trim();

    if (codeLines) {
      if (/^```/.test(trimmed)) {
        html.push(
          `<pre><code${codeLanguage ? ` class="language-${escapeHtml(codeLanguage)}"` : ""}>${escapeHtml(
            codeLines.join("\n")
          )}</code></pre>`
        );
        codeLines = null;
        codeLanguage = "";
      } else {
        codeLines.push(line);
      }
      continue;
    }

    if (/^```/.test(trimmed)) {
      closeParagraph();
      closeList();
      codeLines = [];
      codeLanguage = trimmed.replace(/^```/, "").trim().split(/\s+/)[0] || "";
      continue;
    }

    if (!trimmed) {
      closeParagraph();
      closeList();
      continue;
    }

    const setextHeading = (lines[index + 1] || "").trim().match(/^(=+|-{3,})$/);
    if (setextHeading) {
      closeParagraph();
      closeList();
      const level = setextHeading[1].startsWith("=") ? 2 : 3;
      const id = markdownHeadingId(trimmed, headingCounts);
      html.push(`<h${level} id="${escapeHtml(id)}">${renderInlineMarkdown(trimmed, source)}</h${level}>`);
      index += 1;
      continue;
    }

    if (line.includes("|") && isTableSeparator(lines[index + 1] || "")) {
      closeParagraph();
      closeList();
      const table = renderMarkdownTable(lines, index, source);
      html.push(table.html);
      index = table.cursor - 1;
      continue;
    }

    const heading = trimmed.match(/^(#{1,6})\s+(.+)$/);
    if (heading) {
      closeParagraph();
      closeList();
      const level = Math.min(heading[1].length + 1, 6);
      const headingText = heading[2].replace(/\s+#*$/, "");
      const id = markdownHeadingId(headingText, headingCounts);
      html.push(`<h${level} id="${escapeHtml(id)}">${renderInlineMarkdown(headingText, source)}</h${level}>`);
      continue;
    }

    if (/^(-{3,}|\*{3,}|_{3,})$/.test(trimmed)) {
      closeParagraph();
      closeList();
      html.push("<hr />");
      continue;
    }

    const quote = trimmed.match(/^>\s?(.*)$/);
    if (quote) {
      closeParagraph();
      closeList();
      html.push(`<blockquote>${renderInlineMarkdown(quote[1], source)}</blockquote>`);
      continue;
    }

    const unordered = line.match(/^\s*[-*+]\s+(.+)$/);
    const ordered = line.match(/^\s*\d+\.\s+(.+)$/);
    if (unordered || ordered) {
      closeParagraph();
      closeListItem();
      const nextType = unordered ? "ul" : "ol";
      if (listType && listType !== nextType) closeList();
      if (!listType) {
        listType = nextType;
        html.push(`<${listType}>`);
      }
      currentListItem = { lines: [(unordered || ordered)[1]] };
      continue;
    }

    if (currentListItem && /^\s/.test(line)) {
      currentListItem.lines.push(trimmed);
      continue;
    }

    closeList();
    paragraph.push(trimmed);
  }

  closeParagraph();
  closeList();
  if (codeLines) {
    html.push(`<pre><code>${escapeHtml(codeLines.join("\n"))}</code></pre>`);
  }

  return html.join("");
}

function renderSourceSnippet(text, targetLine, context = 10) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const lineNumber = Math.max(1, Number(targetLine) || 1);
  const start = Math.max(1, lineNumber - context);
  const end = Math.min(lines.length, lineNumber + context);
  const rows = [];

  for (let line = start; line <= end; line += 1) {
    rows.push(`
      <span class="source-line ${line === lineNumber ? "is-target" : ""}">
        <span class="source-line__number">${line}</span>
        <span class="source-line__text">${escapeHtml(lines[line - 1] || "")}</span>
      </span>`);
  }

  return `<pre class="source-snippet"><code>${rows.join("")}</code></pre>`;
}

function scrollReadmeAnchorIntoView(contentEl, anchor) {
  if (!contentEl || !anchor) return;
  window.requestAnimationFrame(() => {
    const target = Array.from(contentEl.querySelectorAll("[id]")).find((element) => element.id === anchor);
    if (!target) return;

    contentEl.querySelectorAll(".is-anchor-target").forEach((element) => {
      element.classList.remove("is-anchor-target");
    });
    target.classList.add("is-anchor-target");
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    target.scrollIntoView({ block: "start", behavior });
  });
}

async function loadMarkdown(source) {
  if (!source) return "";
  if (readmeCache.has(source)) return readmeCache.get(source);
  const response = await fetch(sourceHref(source));
  if (!response.ok) {
    throw new Error(`${response.status} ${response.statusText}`);
  }
  const markdown = await response.text();
  readmeCache.set(source, markdown);
  return markdown;
}

async function loadSearchIndex() {
  if (!searchIndexPromise) {
    searchIndexPromise = fetch("./search-index.json")
      .then((response) => {
        if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
        return response.json();
      })
      .then((index) => ({
        documents: index.documents || [],
        definitions: index.definitions || []
      }));
  }
  return searchIndexPromise;
}

function searchTerms(query) {
  return query
    .toLowerCase()
    .split(/\s+/)
    .map((term) => term.trim())
    .filter(Boolean);
}

function countOccurrences(text, term) {
  let count = 0;
  let cursor = text.indexOf(term);
  while (cursor !== -1) {
    count += 1;
    cursor = text.indexOf(term, cursor + term.length);
  }
  return count;
}

function markdownSearchSnippets(text, terms, cap = 50) {
  const lines = String(text || "").replace(/\r\n?/g, "\n").split("\n");
  const snippets = [];
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const lowerLine = line.toLowerCase();
    if (terms.some((term) => lowerLine.includes(term))) {
      snippets.push({
        line: index + 1,
        text: line.trim() || "(blank line)"
      });
    }
    if (snippets.length >= cap) break;
  }
  return snippets;
}

function groupDefinitionResults(definitions) {
  const byPath = new Map();
  for (const def of definitions) {
    if (!byPath.has(def.path)) {
      byPath.set(def.path, {
        resultKind: "definition-group",
        path: def.path,
        score: def.score,
        snippets: []
      });
    }
    const group = byPath.get(def.path);
    if (def.score > group.score) group.score = def.score;
    group.snippets.push({
      line: def.line,
      text: `${def.kind}: ${def.signature}`,
      symbol: def.symbol,
      kind: def.kind,
      signature: def.signature
    });
  }
  return [...byPath.values()].sort(
    (a, b) => b.score - a.score || a.path.localeCompare(b.path)
  );
}

function markdownSearchResults(documents, query) {
  const terms = searchTerms(query);
  if (!terms.length) return [];

  return documents
    .map((document) => {
      const title = document.title || document.path;
      const lowerTitle = title.toLowerCase();
      const lowerPath = document.path.toLowerCase();
      const lowerText = document.text.toLowerCase();
      const matchesAllTerms = terms.every(
        (term) => lowerTitle.includes(term) || lowerPath.includes(term) || lowerText.includes(term)
      );
      if (!matchesAllTerms) return null;

      const textHits = terms.reduce((total, term) => total + countOccurrences(lowerText, term), 0);
      const titleHits = terms.filter((term) => lowerTitle.includes(term)).length;
      const pathHits = terms.filter((term) => lowerPath.includes(term)).length;
      return {
        ...document,
        score: textHits + titleHits * 12 + pathHits * 6,
        snippets: markdownSearchSnippets(document.text, terms)
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));
}

function definitionSearchResults(definitions, query) {
  const terms = searchTerms(query);
  if (!terms.length) return [];
  const exactQuery = terms.length === 1 ? terms[0] : "";

  return definitions
    .map((definition) => {
      const symbol = definition.symbol || "";
      const signature = definition.signature || "";
      const kind = definition.kind || "source definition";
      const lowerSymbol = symbol.toLowerCase();
      const lowerPath = definition.path.toLowerCase();
      const lowerSignature = signature.toLowerCase();
      const lowerKind = kind.toLowerCase();
      const matchesAllTerms = terms.every(
        (term) =>
          lowerSymbol.includes(term) ||
          lowerPath.includes(term) ||
          lowerKind.includes(term)
      );
      if (!matchesAllTerms) return null;

      const exactSymbol = exactQuery && lowerSymbol === exactQuery;
      const prefixSymbol = exactQuery && lowerSymbol.startsWith(exactQuery);
      const symbolHits = terms.filter((term) => lowerSymbol.includes(term)).length;
      const pathHits = terms.filter((term) => lowerPath.includes(term)).length;
      const signatureHits = terms.reduce((total, term) => total + countOccurrences(lowerSignature, term), 0);
      const kindHits = terms.filter((term) => lowerKind.includes(term)).length;
      return {
        ...definition,
        resultKind: "definition",
        title: `Definition: ${symbol}`,
        pathLabel: `${definition.path}:${definition.line}`,
        score:
          (exactSymbol ? 100000 : 0) +
          (prefixSymbol ? 15000 : 0) +
          symbolHits * 1800 +
          kindHits * 250 +
          pathHits * 90 +
          signatureHits * 20 -
          definition.line / 10000,
        snippets: [
          {
            line: definition.line,
            text: `${kind}: ${signature}`
          }
        ]
      };
    })
    .filter(Boolean)
    .sort((a, b) => b.score - a.score || a.path.localeCompare(b.path) || a.line - b.line);
}

function highlightTerms(value, terms) {
  let escaped = escapeHtml(value);
  for (const term of terms) {
    const pattern = term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    escaped = escaped.replace(new RegExp(`(${pattern})`, "ig"), "<mark>$1</mark>");
  }
  return escaped;
}

function renderSearchResult(result, terms) {
  const snippets = result.snippets || [];
  const count = snippets.length;
  const headPreview = count
    ? `<span class="search-result__preview"><b>Line ${snippets[0].line}</b> ${highlightTerms(
        snippets[0].text,
        terms
      )}</span>`
    : "";

  if (result.resultKind === "definition-group") {
    const fileName = result.path.split("/").pop();
    const snippetButtons = snippets
      .map(
        (snippet) => `
          <button
            type="button"
            class="search-result__snippet"
            data-definition-path="${escapeHtml(result.path)}"
            data-definition-line="${escapeHtml(snippet.line)}"
            data-definition-symbol="${escapeHtml(snippet.symbol || "")}"
            data-definition-kind="${escapeHtml(snippet.kind || "")}"
            data-definition-signature="${escapeHtml(snippet.signature || "")}"
          >
            <b>Line ${snippet.line}</b>
            <span>${highlightTerms(snippet.text, terms)}</span>
          </button>`
      )
      .join("");

    return `
      <article class="search-result search-result--definition search-result--group">
        <button class="search-result__head" type="button" data-search-group-toggle aria-expanded="false">
          <span class="search-result__title">
            ${highlightTerms(fileName, terms)}
            <span class="search-result__badge">${count} source ${count === 1 ? "match" : "matches"}</span>
          </span>
          <span class="search-result__path">${highlightTerms(result.path, terms)}</span>
          ${headPreview}
        </button>
        <div class="search-result__group-snippets" hidden>${snippetButtons}</div>
      </article>`;
  }

  const fileName = result.path.split("/").pop();
  const docTitle = result.title && result.title !== result.path ? result.title : fileName;
  const snippetButtons = snippets
    .map(
      (snippet) => `
        <button
          type="button"
          class="search-result__snippet"
          data-search-source="${escapeHtml(result.path)}"
        >
          <b>Line ${snippet.line}</b>
          <span>${highlightTerms(snippet.text, terms)}</span>
        </button>`
    )
    .join("");

  return `
    <article class="search-result search-result--markdown search-result--group">
      <button class="search-result__head" type="button" data-search-group-toggle aria-expanded="false">
        <span class="search-result__title">
          ${highlightTerms(docTitle, terms)}
          <span class="search-result__badge search-result__badge--markdown">${count} doc ${
    count === 1 ? "match" : "matches"
  }</span>
        </span>
        <span class="search-result__path">${highlightTerms(result.path, terms)}</span>
        ${headPreview}
      </button>
      <div class="search-result__group-snippets" hidden>${snippetButtons}</div>
    </article>`;
}

function openMarkdownSource(source, options = {}) {
  const { anchor = "" } = options;
  const linkedNode = sourceToNode.get(source);
  const treeTarget = treeNodeForSource(source);
  state.view = "tree";
  state.query = "";
  searchInput.value = "";
  state.activeDefinition = null;
  state.activeAnchor = anchor;

  if (linkedNode) {
    if ((children.get(linkedNode) || []).length) {
      state.expanded.add(linkedNode);
    }
    setSelected(linkedNode, { scroll: true, anchor });
    return;
  }

  state.treeContext = treeTarget;
  state.activeSource = source;
  expandAncestors(treeTarget);
  render();
  scrollTreeTargetIntoView(treeTarget);
}

function openDefinitionHint(definition) {
  const treeTarget = treeNodeForSource(definition.path);
  state.view = "tree";
  state.query = "";
  searchInput.value = "";
  state.activeSource = null;
  state.activeDefinition = definition;
  state.activeAnchor = null;
  state.treeContext = treeTarget;
  expandAncestors(treeTarget);
  render();
  scrollTreeTargetIntoView(treeTarget);
}

function paneSizeBounds() {
  const rect = workspaceEl.getBoundingClientRect();
  const resizerWidth = paneResizer.getBoundingClientRect().width || 18;
  const compact = window.matchMedia("(max-width: 1180px)").matches;
  const min = compact ? 260 : 280;
  const minReadmeWidth = compact ? 380 : 460;
  const max = Math.max(min, Math.min(680, rect.width - resizerWidth - minReadmeWidth));
  return { min, max };
}

function currentTreePaneWidth() {
  const value = parseFloat(getComputedStyle(workspaceEl).getPropertyValue("--tree-pane-width"));
  return Number.isFinite(value) ? value : 380;
}

function setTreePaneWidth(width, options = {}) {
  const { persist = true } = options;
  const { min, max } = paneSizeBounds();
  const clamped = Math.round(Math.min(max, Math.max(min, width)));
  workspaceEl.style.setProperty("--tree-pane-width", `${clamped}px`);
  paneResizer.setAttribute("aria-valuemin", String(min));
  paneResizer.setAttribute("aria-valuemax", String(max));
  paneResizer.setAttribute("aria-valuenow", String(clamped));
  if (persist) {
    try {
      localStorage.setItem("m2InternalsTreePaneWidth", String(clamped));
    } catch {
      // Workspace sizing is still usable without persisted preferences.
    }
  }
}

function setTreePaneWidthFromPointer(clientX, options = {}) {
  const rect = workspaceEl.getBoundingClientRect();
  setTreePaneWidth(clientX - rect.left, options);
}

function finishPaneResize(event) {
  if (!isResizingPane) return;
  isResizingPane = false;
  document.body.classList.remove("is-resizing");
  if (event?.pointerId === activeResizePointer && paneResizer.hasPointerCapture(event.pointerId)) {
    paneResizer.releasePointerCapture(event.pointerId);
  }
  activeResizePointer = null;
  setTreePaneWidth(currentTreePaneWidth());
}

function initTreePaneWidth() {
  let width = 380;
  try {
    width = parseFloat(localStorage.getItem("m2InternalsTreePaneWidth")) || width;
  } catch {
    // Preference loading is optional.
  }
  setTreePaneWidth(width, { persist: false });
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

function nodeDepth(id) {
  let depth = 0;
  let cursor = byId.get(id);
  while (cursor?.parent) {
    depth += 1;
    cursor = byId.get(cursor.parent);
  }
  return depth;
}

function mapLevelLabel(depth) {
  return ["root", "source root", "primary areas", "subsystems", "focused files"][Math.min(depth, 4)];
}

function visibleInMap(id) {
  if (!state.query) return true;
  return visibleInTree(id);
}

function renderMapCard(id) {
  const node = byId.get(id);
  const childCount = (children.get(id) || []).length;
  const classes = [
    "workspace-map-card",
    state.selected === id && !state.activeSource && !state.activeDefinition ? "is-selected" : "",
    state.treeContext === id ? "is-context" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return `
    <button class="${classes}" type="button" data-map-select="${escapeHtml(id)}" style="--accent: ${escapeHtml(
    node.accent || "var(--blue)"
  )}">
      <span class="workspace-map-card__kind">${escapeHtml(node.kind)}</span>
      <strong>${highlight(node.title)}</strong>
      <code>${highlight(node.path)}</code>
      <small>${highlight(node.summary)}</small>
      <span class="workspace-map-card__meta">${childCount} ${childCount === 1 ? "child" : "children"}</span>
    </button>`;
}

function renderWorkspaceMap() {
  if (!workspaceMap) return;
  const visibleIds = nodes.map((node) => node.id).filter(visibleInMap);
  const levels = new Map();

  for (const id of visibleIds) {
    const depth = nodeDepth(id);
    if (!levels.has(depth)) levels.set(depth, []);
    levels.get(depth).push(id);
  }

  if (mapCount) {
    mapCount.textContent = `${visibleIds.length} ${visibleIds.length === 1 ? "node" : "nodes"}`;
  }

  if (!visibleIds.length) {
    workspaceMap.innerHTML = `<div class="empty">No map nodes match this search.</div>`;
    return;
  }

  workspaceMap.innerHTML = `
    <div class="workspace-map-board">
      ${Array.from(levels.entries())
        .sort((a, b) => a[0] - b[0])
        .map(
          ([depth, ids]) => `
            <section class="workspace-map-level">
              <div class="workspace-map-level__label">
                <span>${escapeHtml(mapLevelLabel(depth))}</span>
                <strong>${ids.length}</strong>
              </div>
              <div class="workspace-map-level__grid">
                ${ids.map((id) => renderMapCard(id)).join("")}
              </div>
            </section>`
        )
        .join("")}
    </div>`;
}

function highlight(value) {
  const escaped = escapeHtml(value);
  if (!state.query) return escaped;
  const query = state.query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return escaped.replace(new RegExp(`(${query})`, "ig"), "<mark>$1</mark>");
}

function compactTreeSummary(node) {
  if (compactTreeSummaries.has(node.id)) return compactTreeSummaries.get(node.id);
  return String(node.summary || "")
    .split(/\s+/)
    .slice(0, 4)
    .join(" ");
}

function expandAncestors(id) {
  let cursor = byId.get(id);
  while (cursor && cursor.parent) {
    state.expanded.add(cursor.parent);
    cursor = byId.get(cursor.parent);
  }
}

function treeSelectorValue(value) {
  return String(value).replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

function scrollTreeTargetIntoView(id) {
  if (!id) return;
  const requestId = ++treeScrollRequestId;

  window.requestAnimationFrame(() => {
    if (requestId !== treeScrollRequestId) return;
    const target = treeEl.querySelector(`[data-select="${treeSelectorValue(id)}"]`);
    if (!target) return;

    const treeRect = treeEl.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const margin = 18;
    const isVisible = targetRect.top >= treeRect.top + margin && targetRect.bottom <= treeRect.bottom - margin;
    if (isVisible) return;

    const top = treeEl.scrollTop + targetRect.top - treeRect.top - (treeRect.height - targetRect.height) / 2;
    const behavior = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";
    treeEl.scrollTo({ top: Math.max(0, top), behavior });
  });
}

function setSelected(id, options = {}) {
  if (!byId.has(id)) return;
  state.view = "tree";
  state.selected = id;
  state.activeSource = null;
  state.activeDefinition = null;
  state.activeAnchor = options.anchor || null;
  state.treeContext = null;
  expandAncestors(id);
  render();
  if (options.scroll) scrollTreeTargetIntoView(id);
}

function toggleExpanded(id) {
  if (pinnedExpandedIds.has(id)) {
    state.expanded.add(id);
    return;
  }

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
  const isPinned = pinnedExpandedIds.has(id);
  const isTreeContext = state.treeContext === id && state.selected !== id;
  const isExpanded = Boolean(state.query) || isPinned || state.expanded.has(id);
  const toggle = hasChildren ? (isExpanded ? "-" : "+") : "";
  const nodeClasses = [
    "tree-node",
    hasChildren ? "tree-node--branch" : "tree-node--leaf",
    hasChildren && isExpanded ? "is-expanded" : "",
    hasChildren && !isExpanded ? "is-collapsed" : "",
    hasChildren && isPinned ? "is-pinned" : ""
  ]
    .filter(Boolean)
    .join(" ");
  const labelClasses = ["tree-label", state.selected === id ? "is-selected" : "", isTreeContext ? "is-context" : ""]
    .filter(Boolean)
    .join(" ");
  const toggleAttributes = hasChildren
    ? isPinned
      ? `disabled aria-expanded="true" aria-label="${escapeHtml(
          node.title
        )} is pinned open" title="Pinned open"`
      : `aria-expanded="${isExpanded}" aria-label="${isExpanded ? "Collapse" : "Expand"} ${escapeHtml(
          node.title
        )}" title="${isExpanded ? "Collapse" : "Expand"}"`
    : "disabled aria-hidden=\"true\"";
  const childMarkup =
    hasChildren && isExpanded
      ? `<ul>${childIds.map((childId) => renderTreeBranch(childId)).join("")}</ul>`
      : "";

  return `
    <li>
      <div class="${nodeClasses}">
        <button class="tree-toggle ${hasChildren ? "tree-toggle--branch" : "tree-toggle--leaf"}" type="button" data-toggle="${id}" ${toggleAttributes}>${toggle}</button>
        <button class="${labelClasses}" type="button" data-select="${id}">
          <span class="tree-title-row">
            <span class="tree-title">${highlight(node.title)}</span>
            <span class="tree-tag">${escapeHtml(node.kind)}</span>
          </span>
          <span class="tree-path">${highlight(node.path)}</span>
          <span class="tree-summary">${highlight(compactTreeSummary(node))}</span>
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

function renderViewShell() {
  const showingMap = state.view === "map";
  if (treeWorkspace) treeWorkspace.hidden = showingMap;
  if (mapView) mapView.hidden = !showingMap;
  if (mapToggle) {
    mapToggle.textContent = showingMap ? "Close Map" : "Open Map";
    mapToggle.setAttribute("aria-pressed", String(showingMap));
  }
  if (searchFilterEl) {
    searchFilterEl.hidden = !state.query;
    for (const button of searchFilterEl.querySelectorAll("[data-search-filter]")) {
      button.setAttribute("aria-pressed", String(button.dataset.searchFilter === state.searchFilter));
    }
  }
}

async function renderDetails() {
  const requestId = ++readmeRequestId;

  if (state.query) {
    selectedKind.textContent = "search";
    detailsEl.innerHTML = `
      <header class="details__intro">
        <div>
          <h2>Search results</h2>
          <p>Searching source definitions and indexed markdown files for ${escapeHtml(state.query)}.</p>
        </div>
      </header>
      <div class="search-results">
        <div class="readme-loading">Searching markdown index...</div>
      </div>`;

    try {
      const index = await loadSearchIndex();
      if (requestId !== readmeRequestId) return;
      const definitionResults = definitionSearchResults(index.definitions, state.query);
      const markdownResults = markdownSearchResults(index.documents, state.query);
      const definitionGroups = groupDefinitionResults(definitionResults);
      const filter = state.searchFilter || "both";
      const groups = [];
      if (filter !== "markdown") groups.push(...definitionGroups);
      if (filter !== "source") groups.push(...markdownResults);
      groups.sort((a, b) => b.score - a.score || a.path.localeCompare(b.path));

      const terms = searchTerms(state.query);
      const treeMatches = nodes.filter((node) => nodeMatches(node)).length;
      matchCount.textContent = `${treeMatches} ${treeMatches === 1 ? "node" : "nodes"} / ${
        definitionResults.length
      } ${definitionResults.length === 1 ? "def" : "defs"} / ${markdownResults.length} ${
        markdownResults.length === 1 ? "doc" : "docs"
      }`;

      detailsEl.innerHTML = `
        <header class="details__intro">
          <div>
            <h2>Search results</h2>
            <p>Matches for ${escapeHtml(state.query)}: ${definitionResults.length} source ${
        definitionResults.length === 1 ? "definition" : "definitions"
      } across ${definitionGroups.length} ${definitionGroups.length === 1 ? "file" : "files"}, ${
        markdownResults.length
      } markdown ${markdownResults.length === 1 ? "file" : "files"}.</p>
          </div>
        </header>
        <div class="search-results">
          ${
            groups.length
              ? groups.map((result) => renderSearchResult(result, terms)).join("")
              : `<div class="empty">No matches for the current filter.</div>`
          }
        </div>`;
    } catch (error) {
      if (requestId !== readmeRequestId) return;
      detailsEl.innerHTML = `
        <header class="details__intro">
          <div>
            <h2>Search unavailable</h2>
            <p>The markdown search index could not be loaded.</p>
          </div>
        </header>
        <div class="readme-error">
          <strong>${escapeHtml(error.message)}</strong>
        </div>`;
    }
    return;
  }

  if (state.activeDefinition) {
    const definition = state.activeDefinition;
    selectedKind.textContent = "definition";
    detailsEl.innerHTML = `
      <header class="details__intro">
        <div>
          <h2>Definition: ${escapeHtml(definition.symbol)}</h2>
          <p>${escapeHtml(definition.kind || "Source definition")} in ${escapeHtml(definition.path)} at line ${escapeHtml(
      definition.line
    )}.</p>
        </div>
        <a class="details__path" href="${sourceHref(definition.path)}">${escapeHtml(
      `${definition.path}:${definition.line}`
    )}</a>
      </header>
      <div class="readme-content" aria-live="polite">
        <div class="readme-loading">Loading ${escapeHtml(definition.path)}...</div>
      </div>`;

    const contentEl = detailsEl.querySelector(".readme-content");
    try {
      const sourceText = await loadMarkdown(definition.path);
      if (requestId !== readmeRequestId) return;
      contentEl.innerHTML = renderSourceSnippet(sourceText, definition.line);
    } catch (error) {
      if (requestId !== readmeRequestId) return;
      contentEl.innerHTML = `
        <div class="readme-error">
          <strong>Source unavailable</strong>
          <p>${escapeHtml(error.message)}</p>
          <p>${escapeHtml(definition.signature || "")}</p>
        </div>`;
    }
    return;
  }

  const node = state.activeSource
    ? {
        title: state.activeSource,
        path: state.activeSource,
        kind: "markdown",
        source: state.activeSource,
        summary: "Markdown file from the Macaulay2 workspace."
      }
    : byId.get(state.selected);

  selectedKind.textContent = node.kind;
  const parent = node.parent ? byId.get(node.parent) : null;
  const childNodes = node.id ? (children.get(node.id) || []).map((id) => byId.get(id)) : [];
  const relatives = [
    parent ? `<button type="button" data-select="${parent.id}">Parent: ${escapeHtml(parent.title)}</button>` : "",
    ...childNodes
      .slice(0, 6)
      .map((child) => `<button type="button" data-select="${child.id}">${escapeHtml(child.title)}</button>`)
  ]
    .filter(Boolean)
    .join("");

  detailsEl.innerHTML = `
    <header class="details__intro">
      <div>
        <h2>${escapeHtml(node.title)}</h2>
        <p>${escapeHtml(node.summary)}</p>
      </div>
      <a class="details__path" href="${sourceHref(node.source)}">${escapeHtml(node.source || node.path)}</a>
    </header>
    <div class="readme-content" aria-live="polite">
      <div class="readme-loading">Loading ${escapeHtml(node.source || "README")}...</div>
    </div>
    <div class="detail-links">
      ${relatives}
    </div>`;

  const contentEl = detailsEl.querySelector(".readme-content");
  try {
    const markdown = await loadMarkdown(node.source);
    if (requestId !== readmeRequestId) return;
    contentEl.innerHTML = renderMarkdown(markdown, node.source);
    scrollReadmeAnchorIntoView(contentEl, state.activeAnchor);
  } catch (error) {
    if (requestId !== readmeRequestId) return;
    contentEl.innerHTML = `
      <div class="readme-error">
        <strong>README unavailable</strong>
        <p>${escapeHtml(error.message)}</p>
        <p>${escapeHtml(node.summary)}</p>
      </div>`;
  }
}

function render() {
  renderViewShell();
  renderTree();
  renderWorkspaceMap();
  if (state.view === "tree") {
    renderDetails();
  } else {
    readmeRequestId += 1;
  }
}

function openMapView() {
  state.view = "map";
  render();
  window.requestAnimationFrame(() => {
    mapView?.scrollIntoView({ block: "start" });
  });
}

function closeMapView() {
  state.view = "tree";
  render();
  scrollTreeTargetIntoView(state.treeContext || state.selected);
}

document.addEventListener("click", (event) => {
  const mapSelectButton = event.target.closest("[data-map-select]");
  if (mapSelectButton) {
    const selectedId = mapSelectButton.dataset.mapSelect;
    state.query = "";
    searchInput.value = "";
    if ((children.get(selectedId) || []).length) {
      state.expanded.add(selectedId);
    }
    setSelected(selectedId, { scroll: true });
    return;
  }

  if (event.target.closest("[data-close-map]")) {
    closeMapView();
    return;
  }

  const definitionButton = event.target.closest("[data-definition-path]");
  if (definitionButton) {
    openDefinitionHint({
      path: definitionButton.dataset.definitionPath,
      line: Number(definitionButton.dataset.definitionLine || 1),
      symbol: definitionButton.dataset.definitionSymbol || "",
      kind: definitionButton.dataset.definitionKind || "source definition",
      signature: definitionButton.dataset.definitionSignature || ""
    });
    return;
  }

  const searchResultButton = event.target.closest("[data-search-source]");
  if (searchResultButton) {
    openMarkdownSource(searchResultButton.dataset.searchSource);
    return;
  }

  const filterButton = event.target.closest("[data-search-filter]");
  if (filterButton) {
    state.searchFilter = filterButton.dataset.searchFilter || "both";
    render();
    return;
  }

  const groupToggle = event.target.closest("[data-search-group-toggle]");
  if (groupToggle) {
    const expanded = groupToggle.getAttribute("aria-expanded") === "true";
    groupToggle.setAttribute("aria-expanded", String(!expanded));
    const snippets = groupToggle.parentElement?.querySelector(".search-result__group-snippets");
    if (snippets) snippets.hidden = expanded;
    return;
  }

  const readmeLink = event.target.closest(".readme-content a[href]");
  if (readmeLink) {
    const target = markdownTargetFromLink(readmeLink);
    if (target.source && isMarkdownSource(target.source)) {
      event.preventDefault();
      openMarkdownSource(target.source, { anchor: target.hash });
      return;
    }
  }

  const selectButton = event.target.closest("[data-select]");
  if (selectButton) {
    const selectedId = selectButton.dataset.select;
    if ((children.get(selectedId) || []).length) {
      state.expanded.add(selectedId);
    }
    setSelected(selectedId, { scroll: !selectButton.closest("#tree") });
    return;
  }

  const toggleButton = event.target.closest("[data-toggle]");
  if (toggleButton && !toggleButton.disabled) {
    toggleExpanded(toggleButton.dataset.toggle);
  }
});

paneResizer.addEventListener("pointerdown", (event) => {
  if (event.button !== 0) return;
  isResizingPane = true;
  activeResizePointer = event.pointerId;
  document.body.classList.add("is-resizing");
  paneResizer.setPointerCapture(event.pointerId);
  setTreePaneWidthFromPointer(event.clientX, { persist: false });
  event.preventDefault();
});

paneResizer.addEventListener("pointermove", (event) => {
  if (!isResizingPane || event.pointerId !== activeResizePointer) return;
  setTreePaneWidthFromPointer(event.clientX, { persist: false });
});

paneResizer.addEventListener("pointerup", finishPaneResize);
paneResizer.addEventListener("pointercancel", finishPaneResize);
document.addEventListener("pointerup", finishPaneResize);
document.addEventListener("pointercancel", finishPaneResize);
window.addEventListener("blur", finishPaneResize);

paneResizer.addEventListener("dblclick", () => {
  setTreePaneWidth(380);
});

paneResizer.addEventListener("keydown", (event) => {
  const { min, max } = paneSizeBounds();
  const step = event.shiftKey ? 48 : 24;
  let nextWidth = currentTreePaneWidth();

  if (event.key === "ArrowLeft") {
    nextWidth -= step;
  } else if (event.key === "ArrowRight") {
    nextWidth += step;
  } else if (event.key === "Home") {
    nextWidth = min;
  } else if (event.key === "End") {
    nextWidth = max;
  } else {
    return;
  }

  event.preventDefault();
  setTreePaneWidth(nextWidth);
});

window.addEventListener("resize", () => {
  if (state.view !== "tree") return;
  setTreePaneWidth(currentTreePaneWidth(), { persist: false });
});

mapToggle?.addEventListener("click", () => {
  if (state.view === "map") {
    closeMapView();
  } else {
    openMapView();
  }
});

searchInput.addEventListener("input", (event) => {
  state.query = event.target.value.trim().toLowerCase();
  render();
});

initTreePaneWidth();
render();
