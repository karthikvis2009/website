Title: Laminar Flow Simulation of a Kenics Helical Static Mixer
Date: 2026-09-18 10:00
Category: CFD Cases
Tags: OpenFOAM, laminar flow, static mixer, mixing, snappyHexMesh
Slug: kenics-helical-static-mixer
Summary: Laminar flow and mixing analysis of a Kenics helical static mixer containing six mixing elements.
Image: images/kenics/kenicsSM.gif

## Description

This case investigates the flow and mixing behavior of a Kenics helical static mixer containing six mixing elements.

The simulation was performed using OpenFOAM for an incompressible, laminar flow case at a Reynolds number of approximately \(Re = 10\).

**Reference paper:**  
[Laminar Flow in Static Mixer with Helical Elements](https://www.researchgate.net/publication/237224585_Laminar_Flow_in_Static_Mixer_with_Helical_Elements)

![Kenics helical static mixer]({static}/images/kenics/kenics6.png)

## Geometry

The model consists of six helical mixing elements installed inside a cylindrical pipe.

The main geometric dimensions are:

| Parameter | Value |
|---|---:|
| Number of mixing elements | 6 |
| Mixing element length | 0.03 m |
| Pipe diameter | 0.02 m |
| Pipe height | 0.24 m |
| Twist angle per element | $180^\circ$ |

The pipe contains a clearance of one element length at both the inlet and outlet.

Each mixing element contains one $180 ^\circ$ twist.

The geometry was created using FreeCAD. The resulting surface patches were exported as STL files and stored in the OpenFOAM case directory : constant/triSurface/.

## Meshing

The mesh was generated using `snappyHexMesh` in OpenFOAM. This meshing technique produces mostly hexahedral elements, with optional refinement around specified surfaces.

The geometry was exported in STL format. Separate STL files were created for the inlet, outlet, walls, and the entire volume.

The resulting mesh contained:

- 5,789,599 points
- 4,453,943 cells

The following boundary patches were created:

- `inlet`
- `outlet`
- `walls`

## Physics

The incompressible Navier–Stokes equations were solved in OpenFOAM for a laminar flow case with a Reynolds number of \(Re=10\).

The mass conservation equation is

$$
\frac{\partial u}{\partial x}
+
\frac{\partial v}{\partial y}
+
\frac{\partial w}{\partial z}
=0
$$

The steady-state momentum conservation equation in the \(x\)-direction is

$$
u\frac{\partial u}{\partial x}
+
v\frac{\partial u}{\partial y}
+
w\frac{\partial u}{\partial z}
=
-\frac{1}{\rho}\frac{\partial P}{\partial x}
+
\nu
\left(
\frac{\partial^2 u}{\partial x^2}
+
\frac{\partial^2 u}{\partial y^2}
+
\frac{\partial^2 u}{\partial z^2}
\right)
$$

The steady-state momentum conservation equation in the \(y\)-direction is

$$
u\frac{\partial v}{\partial x}
+
v\frac{\partial v}{\partial y}
+
w\frac{\partial v}{\partial z}
=
-\frac{1}{\rho}\frac{\partial P}{\partial y}
+
\nu
\left(
\frac{\partial^2 v}{\partial x^2}
+
\frac{\partial^2 v}{\partial y^2}
+
\frac{\partial^2 v}{\partial z^2}
\right)
$$

The steady-state momentum conservation equation in the \(z\)-direction is

$$
u\frac{\partial w}{\partial x}
+
v\frac{\partial w}{\partial y}
+
w\frac{\partial w}{\partial z}
=
-\frac{1}{\rho}\frac{\partial P}{\partial z}
+
\nu
\left(
\frac{\partial^2 w}{\partial x^2}
+
\frac{\partial^2 w}{\partial y^2}
+
\frac{\partial^2 w}{\partial z^2}
\right)
$$

## Simulation

The case was simulated using OpenFOAM.

The inlet flow velocity was set to $0.01\,\mathrm{m/s}$ in the axial z-direction. The internal flow field was initialized with the same velocity.

### Boundary Conditions

| Parameter | Inlet | Outlet | Walls |
|---|---|---|---|
| **Velocity** | `uniform (0 0 0.01)` | `zeroGradient` | `noSlip` |
| **Pressure** | `zeroGradient` | `uniform 0` | `zeroGradient` |

The steady-state simulation was run for 1,000 iterations using the SIMPLE algorithm.

The residual plot is shown below. The final residuals were of the order of $10^{-8}$.

<!-- ![Normalized residual plot]({static}/content/images/kenics/residuals.png) -->

Although the pressure residuals decreased rapidly and stabilized quickly, the velocity residuals oscillated between approximately $1.0$ and $0.1$ of their maximum values.

After approximately 600 iterations, the velocity residuals oscillated around a lower mean value, and the solution was considered to be converged.

## Validation

The results were validated against the reference paper mentioned above.

The pressure drop across the static mixer was $14.5\,\mathrm{Pa}$, which is very close to the reference pressure drop of $14.4 \mathrm{Pa}$.

This provides sufficient quantitative validation. Additional qualitative flow characteristics were also compared with those reported in the reference paper.
