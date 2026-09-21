Title: Simulation of a Rising Bubble in 2D
Date: 2026-09-20 10:00
Category: CFD Cases
Tags: OpenFOAM, CFD, multiphase flow, rising bubble, VOF
Slug: rising-bubble-2d
Summary: 2D Multiphase simulation of a rising bubble using VoF method in OpenFOAM 
Image: images/rising_bub2d/risingBub.gif

<!-- ![Rising bubble simulation]({static}/assets/risingBub/risingBub.gif) -->

## Description

This case presents a two-dimensional multiphase simulation of a rising bubble.

**Reference paper:** [Quantitative Benchmark Computations of Two-Dimensional Bubble Dynamics](https://onlinelibrary.wiley.com/doi/abs/10.1002/fld.1934)

## Model

The model geometry was created using `blockMesh` in OpenFOAM. The geometry is a cuboid with the front and back faces defined as `empty` patches for the two-dimensional simulation.

The domain has the following dimensions:

- Width: $1 \mathrm{m}$
- Height: $2 \mathrm{m}$
- Depth: $0.2 \mathrm{m}$

The bubble was initialized at the position

$$
(x,y,z)=(0.5,0.5,0)
$$

with a radius of

$$
r=0.25\,\mathrm{m}
$$

## Meshing

The mesh was generated using the `blockMesh` utility in OpenFOAM.

The resulting mesh contained:

- 320,000 hexahedral cells
- 642,402 points

The front and back faces of the domain were assigned the `empty` boundary condition to represent a two-dimensional simulation.

## Physics

The incompressible volume-of-fluid method was used to model the free surface between the bubble and the surrounding liquid. This method is useful when tracking the interface between two phases.

The continuity equation is

$$
\frac{\partial u}{\partial x}
+
\frac{\partial v}{\partial y}
+
\frac{\partial w}{\partial z}
=0
$$

The momentum conservation equations are

$$
\frac{\partial u}{\partial t}
+
u\frac{\partial u}{\partial x}
+
v\frac{\partial u}{\partial y}
=
-\frac{1}{\rho_{\mathrm{mix}}}
\frac{\partial P}{\partial x}
+
\frac{\mu_{\mathrm{mix}}}{\rho_{\mathrm{mix}}}
\left(
\frac{\partial^2 u}{\partial x^2}
+
\frac{\partial^2 u}{\partial y^2}
\right)
+
g_x
+
F_{s,x}
$$

$$
\frac{\partial v}{\partial t}
+
u\frac{\partial v}{\partial x}
+
v\frac{\partial v}{\partial y}
=
-\frac{1}{\rho_{\mathrm{mix}}}
\frac{\partial P}{\partial y}
+
\frac{\mu_{\mathrm{mix}}}{\rho_{\mathrm{mix}}}
\left(
\frac{\partial^2 v}{\partial x^2}
+
\frac{\partial^2 v}{\partial y^2}
\right)
+
g_y
+
F_{s,y}
$$

The mixture density is calculated as

$$
\rho_{\mathrm{mix}}
=
\alpha\rho_{\mathrm{liq}}
+
(1-\alpha)\rho_{\mathrm{gas}}
$$

The mixture viscosity is calculated as

$$
\mu_{\mathrm{mix}}
=
\alpha\mu_{\mathrm{liq}}
+
(1-\alpha)\mu_{\mathrm{gas}}
$$

Here, $\alpha$ is the volume fraction. The surface tension force is given by

$$
\mathbf{F}_s
=
\sigma\kappa\nabla\alpha
$$

where the interface curvature is

$$
\kappa
=
\nabla\cdot
\left(
\frac{\nabla\alpha}{|\nabla\alpha|}
\right)
$$

## Simulation

The case was simulated using the `incompressibleVoF` solver in OpenFOAM.

The volume fraction of the liquid phase, $\alpha$, was initialized to zero inside the bubble and to one elsewhere.

The default value of `alpha.water` was set to one throughout the domain. The `setFields` utility was then used to set the value of `alpha.water` to zero inside a cylindrical region defined by:
- p1     = (0.5 0.5 -0.2)
- p2     = (0.5 0.5  0.2)
- radius = 0.25


### Fluid Properties

| Property | Value |
|---|---:|
| $\nu_{\mathrm{liq}}$ | 0.01 |
| $\nu_{\mathrm{gas}}$ | 0.01 |
| $\rho_{\mathrm{liq}}$ | 1000 |
| $\rho_{\mathrm{gas}}$ | 100 |
| Surface tension coefficient, $\sigma$ | 24.5 |
| Gravitational acceleration, $g_y$ | 0.98 |

These properties result in a Reynolds number of

$$
Re=35
$$

and an Eötvös number of

$$
Eo=10
$$

### Boundary Conditions

| Parameter | `internalField` | `leftRight` | `bottomTop` | `frontBack` |
|---|---|---|---|---|
| **`alpha.water`** | Initialized using `setFields` | `zeroGradient` | `zeroGradient` | `empty` |
| **Velocity** | `uniform (0 0 0)` | `slip` | `noSlip` | `empty` |
| **Pressure (`p_rgh`)** | `uniform 0` | `fixedFluxPressure` | `fixedFluxPressure` | `empty` |

The transient laminar flow simulation was run for a total time of $3\,\mathrm{s}$, using a time step of

$$
\Delta t=10^{-5}\,\mathrm{s}
$$

The solution was obtained using the Pressure-Implicit with Splitting of Operators (PISO) algorithm with:

- 3 correctors
- 1 outer corrector
- A relaxation factor of 0.3 for `p_rgh`

## Validation

The results were validated using the available [bubble validation dataset](https://wwwold.mathematik.tu-dortmund.de/~featflow/en/benchmarks/cfdbenchmarking/bubble/bubble_reference.html).

The dataset `c1g1l7` was used for the validation.

![Validation data]({static}/images/rising_bub2d/valData.png)

The following quantities were compared with the validation data:

- Bubble centroid
- Bubble rise velocity
- Bubble circularity

The simulation results are in close agreement with the validation results.
