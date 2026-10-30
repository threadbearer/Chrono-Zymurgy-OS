#!/usr/bin/env python3
"""
cli.py
======
Unified Command-Line Interface & JSON-RPC Bridge for CHRONO-ZYMURGY OS.
Enables Electron to invoke deep biophysics ODE simulations and recipe optimizations.
"""

import sys
import json
import argparse
from zymurgy_ode_solver import run_simulation
from recipe_optimizer import optimize_recipe, RecipeTargetInput

def main():
    parser = argparse.ArgumentParser(description="CHRONO-ZYMURGY OS Python Engine")
    subparsers = parser.add_subparsers(dest="command", required=True)

    # Subcommand: simulate-ode
    sim_parser = subparsers.add_parser("simulate-ode", help="Run continuous-time biophysics ODE solver")
    sim_parser.add_argument("--json", type=str, help="Input JSON string")
    sim_parser.add_argument("--stdin", action="store_true", help="Read input JSON from stdin")

    # Subcommand: optimize-recipe
    opt_parser = subparsers.add_parser("optimize-recipe", help="Run recipe formulation & optimization")
    opt_parser.add_argument("--json", type=str, help="Input JSON string")
    opt_parser.add_argument("--stdin", action="store_true", help="Read input JSON from stdin")

    args = parser.parse_args()

    try:
        input_data = {}
        if getattr(args, "stdin", False):
            raw = sys.stdin.read().strip()
            if raw:
                input_data = json.loads(raw)
        elif getattr(args, "json", None):
            input_data = json.loads(args.json)

        if args.command == "simulate-ode":
            result = run_simulation(input_data)
            output = {"success": True, "data": result}
        elif args.command == "optimize-recipe":
            target = RecipeTargetInput(**input_data)
            optimized = optimize_recipe(target)
            output = {"success": True, "data": optimized.model_dump()}
        else:
            output = {"success": False, "error": f"Unknown command: {args.command}"}

        print(json.dumps(output))
        sys.exit(0)

    except Exception as e:
        err_output = {"success": False, "error": str(e), "type": type(e).__name__}
        print(json.dumps(err_output), file=sys.stderr)
        print(json.dumps(err_output))
        sys.exit(1)

if __name__ == "__main__":
    main()
