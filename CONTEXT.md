# CONTEXT.md — CHRONO-ZYMURGY OS Architecture Index

## System Overview
**CHRONO-ZYMURGY OS** is a standalone native desktop application for Pop!_OS Linux. It merges modern frontend software engineering with rigorous non-equilibrium biophysics to model fermentation dynamics, replicative yeast generations, Henry's law headspace transfer, and Stokes' hydrodynamic separation.

## Tech Stack
- **Frontend / Shell**: Electron 28+, Vite 8+, React 18, Tailwind CSS, Recharts, Lucide-React.
- **Biophysics & Scientific Computing**: Python 3.10+, `scipy` (numerical ODE solvers), `numpy`, `pydantic` v2.
- **Package & Runtime Management**: `npm` (Node.js dependencies), `uv` (fast Python virtualenv and execution).
- **Target OS**: Pop!_OS / Ubuntu Linux (Wayland / X11 desktop integration with `.desktop` launcher and DBus notifications).

## Directory Blueprint
```text
CHRONO-ZYMURGY_OS/
├── electron/                  # Electron main process & preload bridges
│   ├── main.cjs               # App lifecycle, Wayland/X11 acceleration, Python child process IPC
│   └── preload.cjs            # contextBridge secure API exposure
├── public/                    # Static assets & icons (icon.svg)
├── python/                    # Scientific Python biophysics package
│   ├── data/                  # Externalized data stores (hops.json, yeast.json)
│   ├── cli.py                 # CLI interface & JSON-RPC entrypoint for Electron
│   ├── recipe_optimizer.py    # Tinseth IBU, Morey SRM, and PPG recipe math with Pydantic
│   ├── test_zymurgy.py        # Pytest suite verifying ODE convergence & mass conservation
│   └── zymurgy_ode_solver.py  # Continuous-time Runge-Kutta ODE solver (RK45)
├── src/                       # React 18 Client Application
│   ├── components/            # UI Panels (Simulator, Catalog, Batch Tracker, Radar, Vessel)
│   ├── context/               # TerminologyContext (Biophysics SKL vs Human-Feel Mode)
│   ├── data/                  # Master kit catalog (kits.json, kits.js data module)
│   └── utils/                 # Audio synthesis (Web Audio API) & real-time client physics
├── index.html                 # HTML shell
├── install-popos-desktop.sh   # Pop!_OS Super-key desktop application installer
├── launch-chrono-zymurgy.sh   # Native Wayland-accelerated launch wrapper
└── vite.config.js             # Vite bundler configuration
```

## Architectural Paradigms
1. **Dual-Tier Simulation Engine**:
   - *Tier 1 (Instantaneous UI Preview)*: Client-side mathematical models in [`src/utils/physicsEngine.js`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/src/utils/physicsEngine.js) allow 60fps real-time re-renders as sliders are manipulated in Recharts without IPC latency.
   - *Tier 2 (Continuous-Time Numerical ODE)*: Python engine in [`python/zymurgy_ode_solver.py`](file:///home/jacob/Repository/[BEHOLD]%20My%20Stuff/CHRONO-ZYMURGY_OS/python/zymurgy_ode_solver.py) provides full Runge-Kutta 4th/5th order differential equation integration for high-precision scientific verification.
2. **Dual-Mode Terminology Toggle**:
   - Dynamic real-time switching between *Biophysics Lab Mode* (Soma-Kinetic Lexicon / $\tau$-metrics) and *Human-Experience Mode* (Living-Rhythm / Visceral feel) without page reloads.
3. **Chrono-Vault Security Gating**:
   - Master commercial clone formulas are safely gated behind local protocol secrets. The public showcase exposes original formulations and public metadata while shielding proprietary reverse-engineered ratios.
