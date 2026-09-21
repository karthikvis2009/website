Title: A Simple OpenFOAM Mesh with classy_blocks
Date: 2026-09-21
Slug: meshing-with-classy-blocks
Category: Blog
Tags: OpenFOAM, classy_blocks, blockMesh, CFD
Summary: Creating a simple hexahedral mesh for OpenFOAM using Python and classy_blocks.

Generating a `blockMeshDict` file by hand is manageable for a simple geometry, but it becomes more difficult when the mesh contains several connected blocks, different cell counts, or grading.

[classy_blocks](https://github.com/damogranlabs/classy_blocks) provides a Python interface for creating OpenFOAM block meshes. Instead of manually numbering vertices and blocks, we describe the geometry using Python objects and let classy_blocks generate the `blockMeshDict` file.

## Installing classy_blocks

Install classy_blocks with pip:

```bash
python -m pip install classy_blocks
```

It is also useful to install it inside a virtual environment:

```bash
python -m venv .venv
source .venv/bin/activate
python -m pip install classy_blocks
```

classy_blocks generates the OpenFOAM `blockMeshDict` file. OpenFOAM's `blockMesh` utility then reads that file and creates the actual mesh.

## Creating a simple box mesh

The following script creates a one-block cubic mesh with 20 cells in each direction.

Create a file called `create_mesh.py`:

```python
from pathlib import Path

import classy_blocks as cb


# Create an empty mesh
mesh = cb.Mesh()

# Define a box from (-0.5, -0.5, -0.5) to (0.5, 0.5, 0.5)
box = cb.Box(
    [-0.5, -0.5, -0.5],
    [0.5, 0.5, 0.5],
)

# Set the number of cells along each coordinate direction
for axis in range(3):
    box.chop(axis, count=20)

# Give all unspecified faces a wall boundary condition
mesh.set_default_patch("walls", "wall")

# Add the box to the mesh
mesh.add(box)

# Write the OpenFOAM blockMeshDict file
output_file = Path("case/system/blockMeshDict")
output_file.parent.mkdir(parents=True, exist_ok=True)

mesh.write(str(output_file))

print(f"Wrote {output_file}")
```

Run the script:

```bash
python create_mesh.py
```

The generated file will be located at:

```text
case/system/blockMeshDict
```

The directory should look like this:

```text
case/
└── system/
    └── blockMeshDict
```

## Creating the OpenFOAM mesh

If OpenFOAM is installed and configured, run:

```bash
cd case
blockMesh
```

If the mesh is valid, OpenFOAM will create the mesh files inside:

```text
case/constant/polyMesh/
```

You can inspect the mesh in ParaView by opening the case file or by running:

```bash
paraFoam
```

## Changing the mesh resolution

The cell count is controlled by the `chop` calls:

```python
for axis in range(3):
    box.chop(axis, count=20)
```

For example, to create a finer mesh:

```python
for axis in range(3):
    box.chop(axis, count=40)
```

This produces 40 cells in each direction instead of 20.

It is also possible to use different cell counts in different directions:

```python
box.chop(0, count=40)
box.chop(1, count=20)
box.chop(2, count=10)
```

Here, the mesh contains:

- 40 cells in the x-direction
- 20 cells in the y-direction
- 10 cells in the z-direction

## Using variables for the geometry

One advantage of using Python is that the geometry can be controlled with variables.

For example:

```python
length = 2.0
width = 1.0
height = 0.5

cells_x = 40
cells_y = 20
cells_z = 10

box = cb.Box(
    [0, 0, 0],
    [length, width, height],
)

box.chop(0, count=cells_x)
box.chop(1, count=cells_y)
box.chop(2, count=cells_z)
```

This makes it possible to change the dimensions and mesh resolution without manually editing many coordinates.

## Adding grading

Cell grading can be used to make cells gradually expand in one direction.

For example:

```python
box.chop(
    0,
    count=30,
    end_size=0.05,
)
```

The exact grading strategy depends on the geometry and the required mesh quality. It is important to inspect the resulting mesh rather than choosing a grading ratio blindly.

## A complete parameterized example

The following example combines parameterized geometry and mesh resolution:

```python
from pathlib import Path

import classy_blocks as cb


# Geometry dimensions
length = 2.0
width = 1.0
height = 0.5

# Number of cells
cells_x = 40
cells_y = 20
cells_z = 10


# Create the mesh
mesh = cb.Mesh()

# Create the box
box = cb.Box(
    [0, 0, 0],
    [length, width, height],
)

# Set the number of cells in each direction
box.chop(0, count=cells_x)
box.chop(1, count=cells_y)
box.chop(2, count=cells_z)

# Set the default boundary patch
mesh.set_default_patch("walls", "wall")

# Add the box to the mesh
mesh.add(box)

# Write blockMeshDict
output_file = Path("case/system/blockMeshDict")
output_file.parent.mkdir(parents=True, exist_ok=True)

mesh.write(str(output_file))

print(f"Wrote {output_file}")
```

Run it with:

```bash
python create_mesh.py
```

Then create the OpenFOAM mesh:

```bash
cd case
blockMesh
```

## Why use classy_blocks?

The main advantage of classy_blocks is that the geometry is described using Python objects instead of manually writing and maintaining long lists of vertices and blocks.

A typical workflow is:

1. Define the geometry in Python.
2. Add shapes or blocks to a `classy_blocks` mesh.
3. Set cell counts and grading.
4. Assign boundary patches.
5. Write `blockMeshDict`.
6. Run OpenFOAM's `blockMesh`.
7. Check the mesh quality.

This is especially useful when building parametric meshes. The dimensions, cell counts, and grading can be changed using variables rather than editing many coordinates manually.

## Checking mesh quality

After running `blockMesh`, check the mesh quality with:

```bash
checkMesh
```

Important quantities to inspect include:

- Number of cells
- Number of boundary faces
- Non-orthogonality
- Skewness
- Aspect ratio
- Number of failed quality checks

A mesh that is successfully generated is not necessarily a good mesh. The mesh should also be suitable for the physics and numerical scheme being used.

## Conclusion

classy_blocks is a convenient way to generate OpenFOAM block-structured meshes with Python.

It does not replace the need to understand mesh topology, boundary conditions, cell quality, or OpenFOAM. However, it can make mesh generation more readable, reusable, and easier to automate.

For simple geometries, a hand-written `blockMeshDict` may be sufficient. For multi-block or parameterized geometries, generating the file with classy_blocks can save considerable time.
