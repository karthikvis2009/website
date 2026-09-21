Title: Post-processing OpenFOAM Cases with PyVista
Date: 2026-09-21
Slug: openfoam-postprocessing-with-pyvista
Category: Blog
Tags: OpenFOAM, PyVista, Python, CFD, Post-processing
Summary: Using PyVista and Python to automate OpenFOAM post-processing, create slices and contours, visualize flow fields, and build reusable CFD visualization workflows.

# Post-processing OpenFOAM Cases with PyVista

Post-processing is often one of the most repetitive parts of a CFD workflow.

After a simulation finishes, it is common to open ParaView, load the case, create a slice, select a field, adjust the color map, generate streamlines, and repeat the process for every simulation.

ParaView is an excellent tool for interactive visualization, but when working with a large number of simulations, I often prefer to automate the post-processing with Python.

[PyVista](https://docs.pyvista.org/) provides a convenient Python interface for VTK and is particularly useful for CFD because it combines 3D visualization with mesh and data-processing operations. It can also read OpenFOAM cases directly through its OpenFOAM readers.

In this post, I'll show a basic workflow for using PyVista to post-process an OpenFOAM case.

## Why PyVista?

A typical OpenFOAM workflow might look like:

```text
OpenFOAM
   │
   ├── Run simulation
   │
   └── Write time directories
             │
             ▼
          ParaView
             │
             ├── Slice
             ├── Contour
             ├── Streamlines
             └── Screenshots
```

With PyVista, the visualization stage can instead become:

```text
OpenFOAM
   │
   ▼
Python + PyVista
   │
   ├── Read case
   ├── Select time
   ├── Extract fields
   ├── Slice / contour
   ├── Generate streamlines
   └── Save figures
```

The main advantage is reproducibility.

If I have 50 CFD cases, I don't want to manually recreate the same visualization 50 times. A Python script can apply exactly the same post-processing procedure to every case.

## Installing PyVista

The basic installation is straightforward:

```bash
pip install pyvista
```

For an OpenFOAM workflow, it is also useful to have VTK installed through PyVista's dependencies.

A quick test is:

```python
import pyvista as pv

print(pv.__version__)
```

## Reading an OpenFOAM case

PyVista's `OpenFOAMReader` reads OpenFOAM data through VTK's OpenFOAM reader. The reader works with `.foam` files and exposes information about available time points and patch arrays.

For example, suppose my OpenFOAM case is:

```text
cavity/
├── 0/
├── constant/
├── system/
└── cavity.foam
```

The `.foam` file can be empty; its presence gives the reader a file to open.

We can load it with:

```python
import pyvista as pv

reader = pv.OpenFOAMReader("cavity.foam")

print(reader)
```

For more control, particularly when dealing with decomposed cases, PyVista also provides `POpenFOAMReader`. The PyVista documentation recommends this reader when more control over OpenFOAM data is required.

## Inspecting available time steps

An OpenFOAM simulation may contain many time directories:

```text
0
0.1
0.2
0.3
...
10
```

The reader exposes the available time points.

```python
print(reader.number_time_points)

for i in range(reader.number_time_points):
    print(reader.time_point_value(i))
```

We can then select a particular time:

```python
reader.set_active_time_value(10.0)
```

or select it by index:

```python
reader.set_active_time_point(5)
```

PyVista's OpenFOAM reader provides both time-value and time-point selection methods.

Now we can read the selected dataset:

```python
mesh = reader.read()
```

## Understanding the returned dataset

OpenFOAM cases contain more than just the internal volume mesh.

There are usually boundary patches such as:

```text
inlet
outlet
walls
frontAndBack
```

PyVista represents this information using its dataset structures, so it is useful to inspect the result before doing any processing.

```python
print(mesh)
```

For the OpenFOAM reader, patch names can also be inspected directly:

```python
print(reader.patch_array_names)
```

This is useful when you want to extract or visualize a particular boundary.

## Extracting the internal mesh

For many volume-based post-processing operations, I am primarily interested in the internal mesh.

Depending on the case and reader output, the internal mesh can be accessed from the returned multiblock dataset.

For example:

```python
internal_mesh = mesh["internalMesh"]

print(internal_mesh)
```

It is worth checking the actual block structure of your case because OpenFOAM reader output can vary depending on the VTK/PyVista version and the case configuration.

## Inspecting available fields

Once the mesh is loaded, we can inspect the available arrays:

```python
print(internal_mesh.array_names)
```

A typical OpenFOAM case might contain:

```text
U
p
k
omega
nut
```

The exact list depends on the solver and the fields written by the simulation.

This is where PyVista becomes particularly useful: the OpenFOAM data is now accessible through Python and can be processed like other PyVista datasets.

## Plotting the mesh

The simplest visualization is:

```python
internal_mesh.plot()
```

For more control, create a `Plotter`:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    internal_mesh,
    show_edges=True
)

plotter.show()
```

This is useful when checking mesh topology or investigating whether a particular region has sufficient resolution.

PyVista's plotting system can be used interactively from scripts, notebooks, and applications.

## Creating a slice

One of the most common CFD post-processing operations is extracting a planar slice.

For example, to create a slice normal to the `z` direction:

```python
slice_mesh = internal_mesh.slice(
    normal="z",
    origin=(0, 0, 0)
)
```

We can then visualize pressure:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    slice_mesh,
    scalars="p"
)

plotter.show()
```

This is equivalent to creating a slice filter in ParaView, but now the operation can be embedded directly into a Python script.

For a 2D case, the same idea can be used to extract the computational plane.

## Plotting velocity magnitude

OpenFOAM's velocity field `U` is a vector field.

We can calculate its magnitude with NumPy:

```python
import numpy as np

U = internal_mesh["U"]

velocity_magnitude = np.linalg.norm(U, axis=1)

internal_mesh["Umag"] = velocity_magnitude
```

Now `Umag` can be used as a scalar field:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    internal_mesh,
    scalars="Umag"
)

plotter.show()
```

This is a simple example of where using Python for post-processing becomes powerful. We can create quantities that were not explicitly written by OpenFOAM.

For example:

```python
internal_mesh["U2"] = np.sum(U**2, axis=1)
```

or:

```python
internal_mesh["speed"] = np.linalg.norm(
    internal_mesh["U"],
    axis=1
)
```

## Contours

PyVista can also generate isosurfaces from scalar fields.

For example:

```python
contours = internal_mesh.contour(
    isosurfaces=10,
    scalars="p"
)
```

We can visualize the resulting surfaces:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    contours,
    scalars="p"
)

plotter.show()
```

This becomes particularly useful for quantities such as:

* pressure
* temperature
* volume fraction
* turbulence quantities
* species concentration

## Streamlines

For flow visualization, streamlines are particularly useful.

If `U` is available as a vector field:

```python
streamlines = internal_mesh.streamlines(
    vectors="U",
    n_points=100
)
```

We can display them as tubes:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    internal_mesh,
    opacity=0.2
)

plotter.add_mesh(
    streamlines.tube(radius=0.01)
)

plotter.show()
```

PyVista's streamline filters support different seed configurations, integration directions, and other controls for generating flow trajectories.

For example, we can seed streamlines from a plane rather than using randomly distributed seed points:

```python
seed = internal_mesh.slice(
    normal="x",
    origin=(0, 0, 0)
)

streamlines = internal_mesh.streamlines_from_source(
    seed,
    integration_direction="forward"
)
```

This is useful when visualizing flow entering a domain from a known inlet.

## Combining multiple visualizations

One of the advantages of scripting the visualization is that several datasets can be combined into the same scene.

For example:

```python
plotter = pv.Plotter()

plotter.add_mesh(
    slice_mesh,
    scalars="p"
)

plotter.add_mesh(
    streamlines.tube(radius=0.01),
    color="white"
)

plotter.show()
```

The resulting image can show a pressure field together with the flow direction.

This is often much more informative than looking at either field independently.

## Automating screenshots

Once the visualization is scripted, saving figures becomes straightforward:

```python
plotter = pv.Plotter(
    off_screen=True
)

plotter.add_mesh(
    slice_mesh,
    scalars="p"
)

plotter.show(
    screenshot="pressure.png"
)
```

Now the same script can be executed for every simulation.

For example:

```python
cases = [
    "case_001",
    "case_002",
    "case_003",
]
```

We can loop over them:

```python
for case in cases:

    reader = pv.OpenFOAMReader(
        f"{case}/case.foam"
    )

    reader.set_active_time_value(10.0)

    mesh = reader.read()

    # Post-processing
    # ...

    plotter.show(
        screenshot=f"{case}_pressure.png"
    )
```

This is where PyVista starts becoming more than a visualization tool.

It becomes part of the **CFD automation pipeline**.

## Building a reusable post-processing script

For larger projects, I prefer separating the post-processing operations into functions.

For example:

```python
import numpy as np
import pyvista as pv


def load_case(case_path, time):

    reader = pv.OpenFOAMReader(
        f"{case_path}/case.foam"
    )

    reader.set_active_time_value(time)

    return reader.read()


def add_velocity_magnitude(mesh):

    U = mesh["U"]

    mesh["Umag"] = np.linalg.norm(
        U,
        axis=1
    )

    return mesh


def create_slice(mesh, origin, normal):

    return mesh.slice(
        origin=origin,
        normal=normal
    )
```

The main script can then become:

```python
mesh = load_case(
    "cavity",
    time=10.0
)

mesh = add_velocity_magnitude(mesh)

slice_mesh = create_slice(
    mesh,
    origin=(0, 0, 0),
    normal="z"
)

slice_mesh.plot(
    scalars="Umag"
)
```

This structure makes it much easier to reuse the same post-processing pipeline across different OpenFOAM cases.

## PyVista vs ParaView

I don't see PyVista as a replacement for ParaView in every situation.

They are useful for different purposes.

| Task                          | ParaView  | PyVista   |
| ----------------------------- | --------- | --------- |
| Interactive exploration       | Excellent | Excellent |
| Quick visualization           | Excellent | Excellent |
| Complex GUI workflows         | Excellent | Limited   |
| Automated post-processing     | Possible  | Excellent |
| Batch processing              | Good      | Excellent |
| Custom Python calculations    | Good      | Excellent |
| Reproducible plots            | Good      | Excellent |
| Integration with optimization | Limited   | Excellent |
| Integration with NumPy/SciPy  | Moderate  | Excellent |

For a single simulation, ParaView is often faster.

For 100 simulations, an automated Python workflow can save a considerable amount of repetitive work.

This becomes particularly interesting when post-processing is part of an optimization loop. For example:

```text
Geometry
   │
   ▼
Mesh
   │
   ▼
OpenFOAM
   │
   ▼
Simulation
   │
   ▼
PyVista
   │
   ├── Extract forces
   ├── Calculate derived quantities
   ├── Generate plots
   └── Save results
   │
   ▼
Optimization algorithm
```

At that point, visualization and data extraction can become part of the same automated CFD pipeline.

## Final thoughts

For me, the main advantage of PyVista is not simply that it can produce attractive 3D plots.

The real advantage is that it allows the **post-processing procedure itself to become code**.

Instead of manually repeating:

```text
Open case
→ Select time
→ Create slice
→ Select field
→ Adjust visualization
→ Save image
```

we can define the workflow once:

```python
mesh = load_case(case)
mesh = calculate_fields(mesh)
slice_mesh = create_slice(mesh)
save_results(slice_mesh)
```

That makes post-processing reproducible, scriptable, and much easier to integrate with larger CFD workflows.

For small projects, this may simply save a few clicks.

For parametric studies, optimization, and automated CFD pipelines, it can become a much more significant advantage.
