# AGENTS.md — Shared Engineering Constitution

This constitution establishes the architectural and quality rules for developers and AI agents working on **CHRONO-ZYMURGY OS**.

---

## Core Engineering Rules

### Rule 1: Externalize Large Static Data
- Large or static data structures (catalogs, ingredient profiles, parameter sets) exceeding 50 lines must be stored in dedicated `.json` or `.yaml` files rather than embedded directly in code modules.
- Code modules should load and validate external data, keeping code focused on business logic and keeping agent context windows token-efficient.
- *Examples*:
  - Master catalog data resides in [`src/data/kits.json`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/src/data/kits.json).
  - Commercial hop and yeast databases reside in [`python/data/hops.json`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/data/hops.json) and [`python/data/yeast.json`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/data/yeast.json).

### Rule 2: Justify Electron Sandbox Disablement
- Disabling the Electron sandbox (`sandbox: false`) must be explicitly documented with technical justifications and compensating controls in [`electron/main.cjs`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/electron/main.cjs).
- Compensating controls must always remain enforced:
  1. `contextIsolation: true`
  2. `nodeIntegration: false`
  3. `setWindowOpenHandler` blocking all unvetted external navigation
  4. Sanitized IPC payload verification before executing child processes

### Rule 3: Parameterize Biophysical Model Coefficients
- Core numerical coefficients, kinetic rates, and physical constants must never be hardcoded as undocumented "magic numbers" inside mathematical routines.
- Define parameters as named constants with scientific units and docstrings at the module or class level (e.g., in [`python/zymurgy_ode_solver.py`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/zymurgy_ode_solver.py)).

### Rule 4: Dual-Tier Simulation Integrity
- Maintain separation between:
  - **Client-Side Physics** ([`src/utils/physicsEngine.js`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/src/utils/physicsEngine.js)): optimized for zero-latency 60fps responsive UI previews in Recharts and SVG vessels.
  - **Scientific Python Solver** ([`python/zymurgy_ode_solver.py`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/zymurgy_ode_solver.py)): high-precision Runge-Kutta numerical integration using `scipy.integrate.solve_ivp`.
- Changes affecting underlying biophysical equations should be reflected consistently across both tiers and verified with [`python/test_zymurgy.py`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/test_zymurgy.py).

### Rule 5: Proprietary IP Protection & Security Gating
- Commercial reverse-engineered clone formulations must remain gated under the Chrono-Vault protocol.
- Only non-infringing, original formulations (e.g., Hazy Tau IPA) may have full public bills of materials.

- Private recipe keys and master databases must reside in `.env*.local` or `src/data/kits.vault.*` and never be committed to Git.
