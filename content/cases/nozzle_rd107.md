Title: Compressible Supersonic simulation of RD107 engine nozzle
Date: 2026-10-20 17:00
Category: CFD Cases
Tags: OpenFOAM, compressible flow, supersonic flow, rhoCentral
Slug: nozzle-rd107
Summary: 2D-axisymmetric simulation of a RD107 engine nozzle
Image: images/nozzle_rd107/velocity.gif

<!-- ![rd107 nozzle gif](../images/nozzle_rd107/velocity.gif) -->

---

**Description:** 2D Axisymmetric transient compressible supersonic simulation of a rd107 nozzle exhaust 

<!-- **Reference Paper:** [Experimental and computational study of gas-solid fluidized bed hydrodynamics](https://www.sciencedirect.com/science/article/abs/pii/S0009250905004653) -->

---

# Model

The model consists of the actual provided dimensions of rd107 nozzle in literature. 

# Meshing

Meshing was performed using `blockMesh`.

A blockMeshDict generator framework called `classy_blocks` was used for the parametric structured mesh generation. The parametric design can easily be varied and extended for surrogate modelling.

The resulting mesh had 47200 structured cells. Out of these, 46040 were hexahedral cells and 1160 were prisms

# Physics

The model solves 2D-axisymmetric compressible Navier-Stokes equations. This is a higher order solver that is capable of accurately capturing shocks and simulating high-speed physics. The solver has the capability of higher order central differencing schemes that are more stable than the conventional upwind schemes. 


RAS models were used to compute the turbulence in both phases.

The $k-\epsilon$ model was used for closure of the turbulence stress. 


# Simulation

The case was simulated using the **rhoCentralFoam** solver in OpenFOAM.
Kurganov flux scheme was used along with valAlbada interpolations. These are higher order methods that tend to be more suitable for high-speed physics since they are capable of resolving shock physics with a higher accuracy compared to the conventional schemes.

# Boundary Conditions

| Parameter | Internal Field | Inlet | Outlet | Walls |
|---|---|---|---|---|
| **U** | `uniform (140 0 0)` | `zeroGradient` | `zeroGradient` | `noSlip` |
| **p** | `uniform 5.85e6` | `5.85e6` | `waveTransmissive; p_inf=1e5` | `zeroGradient` |

Appropriate conditions for $k$, $\epsilon$ are provided.

# Other Settings

A custom mixture thermophysical properties were provided. The properties were calculated for the combustion products. JANAF tables were provided for the mixture.

The **transient** simulation was run for 0.02 s with an adaptive time step of $\Delta T = 1e-5$.

# Results
The results accurately capture the shock diamonds as well as the exhaust plume length and temperatures.
