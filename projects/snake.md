---
layout: project.njk
title: "TI Snake"
description: "A version of Snake programmed directly on a graphing calculator."
tags: ["calculator", "C", "game"]
date: 2024-05-01
image: "/assets/images/snake/cover.png"
link: ""
github: "https://github.com/colinstick/tisnake"
---

## Overview

A playable version of Snake that can be played on a TI-84+ CE scientific calculator.

<div class="video-container">
  <div class="youtube-embed">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/XF_I_mNgp98?si=LyFpkzEy1cd-gmby" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</div>


![Render snake by update all parts or just head](/assets/images/snake/diagram.png)
One issue I had when creating this was figuring out the best way to optimize the rendering of the snake. By only updating the head and the tail of the snake, I was able to keep the game running smooth.