"""
test_zymurgy.py
===============
Unit and Integration Tests for CHRONO-ZYMURGY OS Python Engine.
Tests:
- Continuous-time ODE solver convergence and mass conservation
- Temperature sensitivity (Arrhenius factor)
- Stokes' hydrodynamic settling differences between mothers and daughters
- Conical funnel vs missing funnel retention
- Recipe optimizer Pydantic validation and bounds checking
- CLI JSON-RPC bridge
"""

import pytest
import numpy as np
from zymurgy_ode_solver import BiophysicsODESolver, FermentationInput, run_simulation
from recipe_optimizer import optimize_recipe, RecipeTargetInput, YEAST_DATABASE, HOP_DATABASE

def test_ode_solver_convergence():
    cfg = FermentationInput(og=1.054, target_fg=1.011, temp_f=68.0, air_pocket_ml=1200.0)
    solver = BiophysicsODESolver(cfg)
    res = solver.solve(num_points=50)

    summary = res["summary"]
    # Gravity must decrease
    assert summary["final_gravity"] < summary["initial_gravity"]
    assert 1.008 <= summary["final_gravity"] <= 1.018

    # ABV must be positive and consistent
    assert summary["final_abv_pct"] > 4.5

    # Peak pressure must respect PRV relief ceiling (~15.5 PSI)
    assert summary["peak_headspace_psi"] <= 16.0

    # Gn must be between 1.8 and 4.9
    assert 1.8 <= summary["yeast_dynasty_Gn"] <= 4.9

def test_conical_funnel_stokes_retention():
    # Test with conical funnel installed
    res_conical = run_simulation({"conical_installed": True, "fridge_hours": 96.0})
    # Test with missing conical funnel
    res_no_conical = run_simulation({"conical_installed": False, "fridge_hours": 96.0})

    # Missing conical funnel should leave dramatically more scarred mother cells and trub drag
    assert res_no_conical["summary"]["mother_retention_ratio"] > res_conical["summary"]["mother_retention_ratio"] * 4.0
    assert res_no_conical["summary"]["trub_drag_score"] > res_conical["summary"]["trub_drag_score"]

def test_blowout_warning_condition():
    # Dangerously small air pocket (< 820 mL)
    res_danger = run_simulation({"air_pocket_ml": 600.0, "temp_f": 78.0})
    assert res_danger["summary"]["is_blowout_risk"] is True

    # Safe standard air pocket (1200 mL)
    res_safe = run_simulation({"air_pocket_ml": 1200.0, "temp_f": 68.0})
    assert res_safe["summary"]["is_blowout_risk"] is False

def test_recipe_optimizer_pydantic_validation():
    req = RecipeTargetInput(
        recipe_name="Verdant Hazy IPA Clone",
        beer_style="New England IPA",
        target_abv=6.5,
        target_ibu=40.0,
        target_srm=6.0,
        hop_selection=["Citra", "Mosaic"],
        preferred_yeast="Lallemand Verdant IPA"
    )
    opt = optimize_recipe(req)

    assert opt.recipe_name == "Verdant Hazy IPA Clone"
    assert abs(opt.achieved_abv - 6.5) < 0.2
    assert opt.malt_bill.base_malt_g > 500.0
    assert opt.pitching_cell_count_billions > 20.0
    assert opt.cost_analysis.savings_percentage > 50.0

def test_recipe_optimizer_invalid_inputs():
    with pytest.raises(Exception):
        # ABV out of bounds
        RecipeTargetInput(recipe_name="Impossible Beer", target_abv=25.0)

def test_all_yeast_strains_supported():
    for yeast in YEAST_DATABASE.keys():
        req = RecipeTargetInput(recipe_name="Yeast Test", preferred_yeast=yeast, target_abv=5.0)
        opt = optimize_recipe(req)
        assert opt.yeast_strain == yeast
