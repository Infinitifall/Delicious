---
layout: post
title: "Detecting hidden cube faces"
excerpt: "Given the sizes, positions and orientations of cubes in 3D space, find cube faces which are hidden from view."
date: 2022-10-19 9:00:00 +1100
updated: 2022-10-26 22:00:00 +1100
tags: 3d-geometry javascript
categories: Scripting
latex: true
---

**Problem**: Given the sizes, positions and orientations of cubes in 3D space, find cube faces which are hidden from view.

**Motive**: Disabling rendering for hidden faces nets a significant performance boost with no change in appearance. Besides, its simply [irresistible](https://xkcd.com/356/).

A "face" in this context refers to one of the six faces of a cube. A face is "hidden" if it is completely covered by or inside one or more other cubes. This could be as simple as two similar cube faces touching, a small cube face inside a larger cube or as complicated as multiple cubes together covering up a larger cube face.

![Cuboids in various orientations, some of which have their faces hidden inside another]({{ "assets/images/face-remove/face-remove_1.png" | relative_url }})
*The blue cube has one of its faces hidden, so does the yellow cube*


Throughout this article "cube" and "cuboid" are used interchangeably and mean the same thing - a cuboid with a length, breadth and height. Cubes have three properties that we care about,
  
- **Position**, represented by the vector $$\textbf{p} = [p_x, p_y, p_z]$$, the $$X$$, $$Y$$ and $$Z$$ coordinates of the position of the center of the cube

- **Size**, represented by the vector $$\textbf{s} = [s_x, s_y, s_z]$$, the length, height and breadth or dimensions of the cube along the $$X$$, $$Y$$ and $$Z$$ axes, respectively (when not rotated)

- **Rotation or orientation**, used here interchangeably and represented by the vector $$\textbf{r} = [r_x, r_y, r_z]$$, the [angles](https://en.wikipedia.org/wiki/Euler_angles) by which the cube is rotated about the $$X$$, $$Y$$, $$Z$$ axes (when $$\textbf{r} = [0,0,0]$$ the sides of the cube are parallel to the axes)

![Multiple cubes together cover the face of another]({{ "assets/images/face-remove/face-remove_2.png" | relative_url }})
*The orange cube has a face hidden due to multiple other cubes*


## A simpler problem

Lets first try to tackle the simpler problem where all cubes have orientation $$\textbf{r} = [0,0,0]$$ so their sides parallel to the $$X$$, $$Y$$ and $$Z$$ axes, and where we only care about detecting hidden faces that are touching or completely inside **one** other cube and don't care whether multiple cubes together cover up a face.

![Cubes in the same orientation, some of which have their faces completely inside another cube]({{ "assets/images/face-remove/face-remove_3.png" | relative_url }})
*This situation is much easier to solve*

Lets take the example of a red cube which has a face completely inside a blue cube. Let their positions and sizes be given by $$p_r$$, $$s_r$$, $$p_b$$, $$s_b$$. For the red cube's face in the $$-Z$$ direction to be completely covered by or inside by the blue cube, we have the following restrictions

$$
\begin{align*}
|p_{r,z} - p_{b,z}| &\leq \frac{s_{r,z} + s_{b,z}}{2} \\
|p_{r,x} - p_{b,x}| &\leq \frac{|s_{r,x} - s_{b,x}|}{2} \\
|p_{r,y} - p_{b,y}| &\leq \frac{|s_{r,y} - s_{b,y}|}{2}
\end{align*}
$$

![A red cube half inside a blue cube]({{ "assets/images/face-remove/face-remove_4.png" | relative_url }})
*A red cube half inside a blue cube, shown from different angles*

And that is all we need to solve this simplified problem! A [pseudocode](https://www.unf.edu/~broggio/cop2221/2221pseu.htm) solution would be as follows

```lua
for each cube1 in cubes
    for each face in cube1
        for each cube2 in cubes
            if cube1 and cube2 are different
                if the equations above hold for face and cube2
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

We construct the pseudocode function

```lua
function checkPointInsideCube(v, p, s):
    if abs(v.x - p.x) <= s.x/2 and abs(v.y - p.y) <= s.y/2 and abs(v.z - p.z) <= s.z/2
        return true
    else
        return false
```

How would we handle the general case where the cube has some orientation $$\textbf{r} = [r_x, r_y, r_z]$$?


## Rotations in 3D

To rotate the vector $$\textbf{v} = [x, y, z]$$ by the angles $$\theta_x, \theta_y, \theta_z$$ about the $$X$$, $$Y$$, $$Z$$ axes, we use the standard [rotation matrices](https://en.wikipedia.org/wiki/Rotation_matrix#In_three_dimensions) and get the resultant vector $$\textbf{v}_r = [x_r, y_r, z_r]$$ as

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

Similarly, the rotated vector $$\textbf{v}_r$$ can be "inversely" rotated by multiplying it with the inverse rotation matrices $$R^{-1}_x$$, $$R^{-1}_y$$, $$R^{-1}_z$$ in reverse order to get back our original vector $$\textbf{v}$$ as

$$\textbf{v}^T = R^{-1}_z \times R^{-1}_y \times R^{-1}_x \times \textbf{v}_r^T$$

We construct the pseudocode functions (abstracting away implementation details)

```lua
function rotateVector3D(v, r)
    return RotMatrixX(r.x) * RotMatrixY(r.y) * RotMatrixZ(r.z) * v

function rotateVector3DInverse(v, r)
    return RotMatrixInvZ(r.z) * RotMatrixInvY(r.y) * RotMatrixInvX(r.x) * v
```


## Checking whether a point lies inside a rotated cube

Going back to our earlier problem of checking whether a point $$\textbf{v}$$ lies inside a rotated cube, a clever trick is to inversely rotate both the cube and the point about the origin. This has the effect of resetting the cube's orientation to $$\textbf{r} = [0,0,0]$$ while not affecting the relative positions of the point and cube. We can then apply the equations from earlier to check if the rotated point lies inside the rotated cube.

A pseudocode function for checking if a point lies inside a rotated cube would combine our previous pseudocode functions

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

When the cube has orientation $$\textbf{r} = [r_x, r_y, r_z]$$, we use the `vectorRotate3D` function from earlier, giving us the pseudocode function

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

Our final pseudocode solution combines everything we talked about

```lua
for each cube1 in cubes
    for each face in cube1
        f_points := getFacePoints(cube1.p, cube1.s, cube1.r, face)
        covered := true

        for each face_point in face_points
            once_covered := false
            for each cube2 in cubes
                if cube1 and cube2 are different
                    if checkPointInsideCube(f_points, cube2.p, cube2.s, cube2.r) = true
                        once_covered := true
                        break

            if once_covered = false
                covered := false
                break

        if covered = true
            face is hidden

```

You can view the JavaScript implementation [here](https://github.com/Infinitifall/face-remove) or [run it in your browser](https://htmlpreview.github.io/?https://github.com/Infinitifall/face-remove/blob/main/index.html). Note that it expects the position of a cube to be the center of its bottom face (instead of its geometric center, which is what we assumed here) and the input/outputs look like this

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
