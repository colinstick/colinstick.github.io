---
layout: project.njk
title: "UTPC Problems"
description: "My set of problems I wrote for UT Programming Contests."
tags: ["C++", "math"]
date: 2026-10-14
image: "/assets/images/utpc-problems/cover.png"
link: ""
github: ""
---

## Overview

I used [Polygon](https://polygon.codeforces.com/) to make these problems. A lot goes into problem writing: you have to create the problem, find a solution, sometimes prove that the solution even works, and write a checker, a verifier, and a test generator, then make sure all edge cases are covered. All of this is written in C++.

Below is a list of problems I've made for University of Texas at Austin Programming Competitions, followed by the editorials I wrote.

# Problems

- [Strongest Attack First](https://codeforces.com/gym/106420/problem/E)
- [Bespin](https://codeforces.com/gym/106457/problem/B)
- [Kickoff Countdown (Easy)](https://codeforces.com/gym/106711/problem/B)
- [Kickoff Countdown (Hard)](https://codeforces.com/gym/106711/problem/H)
- [But First, Coffee](https://codeforces.com/gym/106733/problem/A)
- [Piece of Cake](https://codeforces.com/gym/106764/problem/A)
- [Layers Upon Layers](https://codeforces.com/gym/106764/problem/G)

# Editorials

## Strongest Attack First

Note that setting your level to $\ell$ reduces the damage per second of each attack to $\max(0, d_i - \ell)$. Therefore, the total damage dealt during the $i$-th wave will be $\max(0, d_i - \ell) \times t_i$. The total damage from the skeleton's attack is the sum of this quantity over all waves:

$$ D(\ell) = \sum_{i=1}^{n} \max(0, d_i - \ell) t_i $$

Thus, we must find the minimum $\ell$ such that $D(\ell) < h$. The key observation is that $D(\ell)$ is monotonically decreasing: increasing $\ell$ reduces or doesn't change the damage per wave, so the total damage can never increase as $\ell$ increases. So, if a certain $\ell$ permits survival, then all larger $\ell$ will also permit survival. Conversely, if you die at player level $\ell$, then you will also die at any smaller level. Because this is true, we can binary search for the minimum level that allows survival.

Perform a binary search over $\ell$ in the range $[0, \max(d_i)]$. This upper bound works because if $\ell \geq \max(d_i)$, every attack will deal zero damage and survival is guaranteed. For each $\ell$ during the search, compute the total damage. If it reaches or exceeds $h$, then survival is impossible, otherwise the $\ell$ works.

Each damage check takes $O(n)$ time and the binary search has $O(\log(\max(d_i)))$ iterations. Thus, the total time complexity is $O(n \log(\max(d_i)))$, which is sufficient for the bounds on $n$ and $d_i$.

## Kickoff Countdown (Easy)

Because $n \leq 6$, the largest initial number on the clock will be `999999`. This is small enough to simply simulate the countdown. At each step, compare the current number with the number after subtracting 1, count how many digits changed, and add that count to the answer. Decrease the number by 1 and continue until the clock reaches `0`.

A brute force solution is available [here](https://gist.github.com/colinstick/9b9be3914a672723ed497ddd3f7763a2).

## Kickoff Countdown (Hard)

In this version of the problem, $n \leq 10^5$, so a brute force solution will obviously take too long. Analyzing test cases can lead to a key observation. Consider a starting display of `150`. The countdown is `150` → `149` → `148` → ... → `000`. The first digit changes once, the second digit changes $15$ times, and the last digit changes $150$ times. Thus, the contribution of each digit depends on the sum of all digits up to and including it. For instance, a starting display of `12345` will have an answer of the following:

```
  12345
   1234
    123
     12
+     1
-------
  13715
```

Now, actually calculating this has two different approaches.

### Approach 1

Because the result will be a large string, we have to consider the answer digit by digit. Examining the example above, we can see that each digit of the answer is determined by the sum of all the input digits up to and including the corresponding digit. More generally, if the digits of the input are $d_0, d_1, \ldots, d_{n-1}$, we can compute prefix sums

$$ \text{sums}[i] = \sum_{j=0}^{i} d_j. $$

These prefix sums give the value contributed by each position. We then process the digits from right to left, adding the carry from the previous position. Basically, we simulate standard algorithm addition. My solution for this can be found [here](https://gist.github.com/colinstick/65cc704f152f0e3289b83b06080ad05d).

### Approach 2

Letting $X$ be the integer value of the start of the clock, and $S$ be the sum of all the values of the digits, the closed form solution for the answer $A$ is

$$ A = \frac{10X - S}{9} $$

To derive this formula, let the digits of $X$ be $d_0, d_1, \ldots, d_{n-1}$. The answer is formed from the prefix sums of these digits, so before carrying, it is

$$ A = (d_0)10^{n-1} + (d_0 + d_1)10^{n-2} + \cdots + (d_0 + \cdots + d_{n-1}). $$

Rearranging by digit, each $d_i$ appears in every term from its position onward. This gives

$$ A = d_0(10^{n-1} + \cdots + 1) + d_1(10^{n-2} + \cdots + 1) + \cdots + d_{n-1}. $$

Using the geometric series formula and the definitions

$$ X = 10^{n-1}d_0 + \cdots + d_{n-1}, \qquad S = d_0 + \cdots + d_{n-1}, $$

we obtain

$$ 9A = 10X - S, $$

and therefore

$$ A = \frac{10X - S}{9}. $$

By using something like `BigInteger` in Java, you can directly calculate this value.

## But First, Coffee

Let $C$ be the total number of `C`'s in the string, so after sorting, the first $C$ characters must all be `C`. The minimum number of operations Lois needs, $M$, is equal to the number of misplaced `E`'s in this prefix $s[1 \dots C]$ (equivalently, the number of misplaced `C`'s in the suffix $s[C+1 \dots n]$, since these two counts are always equal).

A single operation can fix both a misplaced `E` and a misplaced `C`. For each operation:

- Pick a misplaced `E` at index $i$
- Pick a misplaced `C` at index $k$
- Pick some index $j$ such that $i < j < k$
- This triplet of characters $(s_i, s_j, s_k)$ will be `(E, ?, C)`, where `?` is either an `E` or a `C`

One cyclic shift can always turn `(E, ?, C)` into `(C, ?, E)`, which corrects both misplaced characters.

- If the triplet is `(E, C, C)`, a left shift makes it `(C, C, E)`
- If the triplet is `(E, E, C)`, a right shift makes it `(C, E, E)`

If there is no character between index $i$ and $k$, then there has to be an `E` to the right of the misplaced `C` or a `C` to the left of the misplaced `E` ($n \geq 3$). We can choose this character and perform a left shift or right shift respectively.

Since each operation fixes one pair, the answer is $M$, which can easily be found in $O(n)$.

## Piece of Cake

Each friend needs one whole slice of size at least $a_i$, and each slice can go to only one friend, so we want to match as many friends as possible to slices that are big enough for them. The greedy idea is to always satisfy the least demanding friend with the smallest slice that works.

So, sort both the slices and the demands in increasing order, and keep a pointer on the least demanding friend who is still unhappy. Walk through the slices from smallest to largest: if the current slice is at least that friend's demand, give it to them and move the pointer to the next friend. Otherwise the slice is too small for this friend, and therefore too small for everyone after them (their demands are at least as large), so we skip it.

This works because using the smallest slice that satisfies a friend never takes away something a pickier friend needs, and if any $k$ friends can be made happy, then the $k$ least demanding ones can too. The answer is the number of friends the pointer passed. This gives an $O(n \log n + m \log m)$ solution.

## Layers Upon Layers

We can model this problem as a graph. Let the nodes be the 26 lowercase English letters, and let each flavor be a directed edge from its first letter to its last letter. For example, the flavor `apple` is the edge `a` → `e`.

A valid arrangement of layers is then a path through this graph that uses every edge exactly once, which is an Euler path. We only need to decide whether one exists, not construct it. To check this, we first check for weak connectivity: all vertices that have at least one edge must be connected when we treat the edges as undirected. This takes $O(n)$ time.

Next, letting $O$ be the out-degree and $I$ the in-degree of a vertex, we check that at most one vertex has $O - I = 1$, at most one vertex has $I - O = 1$, and every other vertex has $I = O$. (Since the sum of $O - I$ over all vertices is $0$, a vertex with $O - I = 1$ always has a partner with $I - O = 1$.) If both conditions hold, an Euler path exists, so a valid cake exists and we print `YES -1`.

Now consider flipping a layer. Flipping a layer reverses the direction of its edge: flipping `apple` into `elppa` changes the edge `a` → `e` into `e` → `a`. This does not change whether the graph is weakly connected, since the undirected graph is the same, so we only check connectivity once. It only changes the degrees of the two endpoints: the old start loses one out-degree and gains one in-degree, and the old end does the opposite.

It seems like we need to try flipping every layer, but many layers give the same edge. There are at most $26^2 = 676$ distinct edges, and flipping two layers with the same first and last letters has the same effect on the degrees. For example, `apple` and `azure` both represent `a` → `e`, so we only need to try one of them. (A layer whose first and last letters are equal is a self-loop, and flipping it changes nothing.) For each distinct edge we flip it, redo the degree check in $O(26)$, and undo the flip. If some flip passes, we print `YES` and the index of that layer. If none do, we print `NO`.

Reading the input and checking connectivity take $O(n)$ time, and the flip checks take $O(26^2 \cdot 26)$, so the [final solution](https://gist.github.com/colinstick/903fd8b3ea17bf180149c1eee1b2c3fb) is $O(n)$.