---
layout: post
title: "Detecting hidden cube faces"
excerpt: "Given the sizes, positions and orientations of cubes in 3D space, find cube faces which are hidden from view."
date: 2022-10-19 9:00:00 +1100
updated: 2022-11-25 22:45:00 +1100
tags: 3d-geometry c
categories: Scripting
latex: true
---

**Problem**: Given the sizes, positions and orientations of cubes in 3D space, find cube faces which are hidden from view. A "face" here refers to one of the six faces of a cube and is "hidden" if it is covered by one or more other cubes.

**Motive**: Disabling rendering for hidden faces nets a significant performance boost with no change in appearance when viewed from outside.

![Cuboids in various orientations, some of which have their faces hidden inside another]({{ "assets/images/face-remove/face-remove_1.png" | relative_url }})
*The blue cube has one of its faces hidden, so does the yellow cube*

![Multiple cubes together cover the face of another]({{ "assets/images/face-remove/face-remove_2.png" | relative_url }})
*The orange cube has a face hidden due to multiple other cubes*

"Cube" and "cuboid" are used interchangeably but mean the same thing - a cuboid with a length, breadth and a height. They have three properties that we care about,
  
- **Position** $$\textbf{p} = [p_x, p_y, p_z]$$, the $$X$$, $$Y$$ and $$Z$$ coordinates of the center of the cube

- **Size** $$\textbf{s} = [s_x, s_y, s_z]$$, the length, height and breadth or the dimensions of the cube along the $$X$$, $$Y$$ and $$Z$$ axes when not rotated

- **Rotation or orientation** $$\textbf{r} = [r_x, r_y, r_z]$$, the [angles](https://en.wikipedia.org/wiki/Euler_angles) by which the cube is rotated about the $$X$$, $$Y$$, $$Z$$ axes


## A simpler problem

Lets first tackle the simpler problem where all cubes have orientation $$\textbf{r} = [0,0,0]$$, making their sides parallel to the $$X$$, $$Y$$ and $$Z$$ axes. Lets also only focus on cases where cube faces are completely covered by just **one** other cube.

![Cubes in the same orientation, some of which have their faces completely inside another cube]({{ "assets/images/face-remove/face-remove_3.png" | relative_url }})
*This situation is much easier to solve*

Taking the example of a red cube with a face completely inside a blue cube, let their positions and sizes be $$p_r$$, $$s_r$$, $$p_b$$, $$s_b$$. For red's $$-Z$$ direction face to be fully covered, we need

$$
\begin{align*}
|p_{r,z} - p_{b,z}| &\leq \frac{s_{r,z} + s_{b,z}}{2} \\
|p_{r,x} - p_{b,x}| &\leq \frac{|s_{r,x} - s_{b,x}|}{2} \\
|p_{r,y} - p_{b,y}| &\leq \frac{|s_{r,y} - s_{b,y}|}{2}
\end{align*}
$$

![A red cube half inside a blue cube]({{ "assets/images/face-remove/face-remove_4.png" | relative_url }})
*A red cube half inside a blue cube, shown from different angles*

And that is all we need to solve this simplified problem! A [pseudocode](https://www.unf.edu/~broggio/cop2221/2221pseu.htm) solution would look like this

```lua
function checkFaceCovered(cube1, face, cube2):
    pz1, sz1, pz2, sz2 := position and size coordinates of cube1 and cube2 along axis of face
    px1, sx1, px2, sx2, py1, sy1, py2, sy2 := position coordinates of cube1 and cube2 along other two axes
    if (
        abs(px1 - px2) <= abs(sx1 - sx2) / 2 and
        abs(py1 - py2) <= abs(sy1 - sy2) / 2 and
        abs(pz1 - pz2) <= abs(sz1 + sz2) / 2
    )
        return true
    else
        return false

for each cube1 in cubes
    for each face in cube1.faces
        for each cube2 in cubes
            if cube1 and cube2 are same
                continue
            if checkFaceCovered(cube1, face, cube2)
                face is hidden

```


## Checking whether a point lies inside a cube

For the point $$\textbf{v} = [v_x, v_y, v_z]$$ to lie inside the cube with position $$\textbf{p} = [p_x, p_y, p_z]$$ and size $$\textbf{s} = [s_x, s_y, s_z]$$ and orientation $$\textbf{r} = [0,0,0]$$, the distance between the point and the center of the cube can be up to half the cube's size along each axis

$$
\begin{align*}
|v_x - p_x| &\leq \frac{s_x}{2} \\
|v_y - p_y| &\leq \frac{s_y}{2} \\
|v_z - p_z| &\leq \frac{s_z}{2}
\end{align*}
$$

Converting this to a pseudocode function

```lua
function checkPointInsideCube(v, p, s):
    if (
        abs(v.x - p.x) <= s.x/2 and 
        abs(v.y - p.y) <= s.y/2 and
        abs(v.z - p.z) <= s.z/2
    )
        return true
    else
        return false
```

How would we handle the general case where the cube has some non-zero orientation $$\textbf{r} = [r_x, r_y, r_z]$$?


## Rotations in 3D

To rotate the vector $$\textbf{v} = [x, y, z]$$ by the angles $$\theta_x, \theta_y, \theta_z$$ about the $$X$$, $$Y$$, $$Z$$ axes, we multiply it with the standard [rotation matrices](https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions) and get the resultant vector $$\textbf{v}_r = [x_r, y_r, z_r]$$ as

$$
\begin{align*}

R_x &=

\begin{bmatrix}
1 & 0 & 0 \\
0 & cos(\theta_x) & sin(\theta_x) \\
0 & -sin(\theta_x) & cos(\theta_x) \\
\end{bmatrix}

\\ R_y &=

\begin{bmatrix}
cos(\theta_y) & 0 & -sin(\theta_y) \\
0 & 1 & 0 \\
sin(\theta_y) & 0 & cos(\theta_y) \\
\end{bmatrix}

\\ R_z &=

\begin{bmatrix}
cos(\theta_z) & sin(\theta_z) & 0 \\
-sin(\theta_z) & cos(\theta_z) & 0 \\
0 & 0 & 1 \\
\end{bmatrix}
\end{align*}
$$

$$\textbf{v}_r^T = R_x \times R_y \times R_z \times \textbf{v}^T$$

Similarly, this rotated vector $$\textbf{v}_r$$ can be "inversely" rotated by multiplying it with the inverse rotation matrices $$R^{-1}_x$$, $$R^{-1}_y$$, $$R^{-1}_z$$ in reverse order to get back our original vector $$\textbf{v}$$ as

$$\textbf{v}^T = R^{-1}_z \times R^{-1}_y \times R^{-1}_x \times \textbf{v}_r^T$$

Abstracting away implementation details, we get the pseudocode functions

```lua
function rotateVector3D(v, r)
    return RotMatrixX(r.x) * RotMatrixY(r.y) * RotMatrixZ(r.z) * v

function rotateVector3DInverse(v, r)
    return RotMatrixInvZ(r.z) * RotMatrixInvY(r.y) * RotMatrixInvX(r.x) * v
```


## Checking whether a point lies inside a rotated cube

Going back to our problem of checking whether a point $$\textbf{v}$$ lies inside a rotated cube, a clever trick is to inversely rotate both the cube and the point about the origin. This has the effect of resetting the cube's orientation to $$\textbf{r} = [0,0,0]$$ while not affecting the relative positions of the point and cube. We can then apply the equations for the simple unrotated case.

When the cube has orientation $$\textbf{r} = [r_x, r_y, r_z]$$ we use the `vectorRotate3DInverse` function from earlier

```lua
function checkPointInsideCube(v, p, s, r)
    p_2 := rotateVector3DInverse(p, r)
    v_2 := rotateVector3DInverse(v, r)
    return checkPointInsideCube(v_2, p_2, s)
```


## Getting grid points on a cube face

We now diverge from mathematical exactness and settle for an approximate solution - to determine if a face is hidden we check if all points on an $$n \times n$$ grid are touching or covered by another cube. We can get an arbitrarily accurate (albeit computationally heavy) solution as $$n \rightarrow \infty$$ (for most scenarios though, $$n \approx 10$$ works just fine).

Given a cube with position $$\textbf{p} = [p_x, p_y, p_z]$$, size $$\textbf{s} = [s_x, s_y, s_z]$$ and rotation $$\textbf{r} = [0,0,0]$$, the positions of the $$n \times n$$ grid points on one of its faces would be the vector sequence

$$
\begin{align*}
\Bigl(\textbf{p} &+ [\frac{s_x}{2}, \frac{-s_y}{2}, \frac{-s_z}{2}] \\
&+ [0, \frac{s_y}{2n}, 0] \times a \\
&+ [0, 0, \frac{s_z}{2n}] \times b\Bigl)_{a,b = 0}^{n}
\end{align*}
$$


```lua
function getFacePoints(p, s, r, face)
    face_points := empty list
    a_1 := rotateVector3D([s.x,0,0], r) / 2
    a_2 := rotateVector3D([0,s.x,0], r) / 2
    a_3 := rotateVector3D([0,0,s.x], r) / 2

    a_4 := (face % 3 th of a_1, a_2, a_3) * (-1 or 1 depending on if face % 2 = 0)
    a_5, a_6 := the other two of a_1, a_2, a_3
    for i in 0..n
        for j in 0..n
            b_1 := p + a_4 - a_5 - a_6
            b_2 := b_1 + a_5 * i + a_6 * j
            add b_2 to face_points
    
    return face_points
```


## Final solution

We get the facepoints for each cube face and check if all of them are covered (or more accurately, if a single one is not covered, which is computationally easier)

```lua
function faceRemove(cubes)
    for each cube1 in cubes
        for each face in cube1
            f_points := getFacePoints(cube1.p, cube1.s, cube1.r, face)
            covered := true

            for each face_point in face_points
                once_covered := false
                for each cube2 in cubes
                    if cube1 and cube2 are same
                        continue
                    if checkPointInsideCube(f_points, cube2.p, cube2.s, cube2.r)
                        once_covered := true
                        break
                if not once_covered
                    covered := false
                    break
            if covered
                face is hidden and can be removed

```

The final C implementation of `face-remove` is available [here](https://github.com/Infinitifall/face-remove). It expects the position of a cube to be the center of its bottom face (instead of the geometric center, which is what we assumed here) and the input/outputs look like this

```json
{
    "objects":[
        {
            "s":[1,2,3.5],
            "p":[0.2,10.5,-1],
            "r":[0,1.57,-0.5],
            "f":"1C"
        },
        {
            "s":[7,6,5],
            "p":[0,100,0],
        },
    ]
}
```
