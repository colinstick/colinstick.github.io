---
layout: project.njk
title: "Piano Helper"
description: "A command line tool to easily sift through MIDI files."
tags: ["C++", "art"]
date: 2026-99-99
image: "/assets/images/memory-allocator/cover.png"
link: ""
hidden: true
---

## Overview

I don't know how to read sheet music and I was never really taught how to play the piano. If I want to learn a song, I look up a YouTube tutorial like [this](https://www.youtube.com/watch?v=X4FuaEF5-J4), where the keys are animated and go down to the keyboard. I would end up restarting and skipping through and slowing down and speeding up the video over and over again, and it's really hard to learn. So, I decided to make a tool that would help me learn it.

Enter `piano_helper`!

## Analyzing MIDI Files

I decided to write this in C++, so I needed to find a library that would help me analyze MIDI files. So, I found the [MidiFile](https://github.com/craigsapp/midifile) library and used it to write a simple program that would simply print out what notes were on each track.

***Note:** I created the track `dont_forget_basic.mid` for testing purposes which plays a simplified version of ["Don't Forget"](https://www.youtube.com/watch?v=YLeid-bIRQA) from DELTARUNE!*

```
> ./main dont_forget_basic.mid 
Track count: 2
================= ANALYZING TRACK 0 ==================
D#4 E4 F#4 F#4 F#4 F#4 F#4 B3 D#4 C#4 C#4 C#4 C#4 C#4 D#4 C#4 B3 B3 B3 B3 B3 A#4 B4 A#4 G#4 D#4 
Note count: 26
================= ANALYZING TRACK 1 ==================
F#3 C#3 B2 F#3 
Note count: 4
```

## Goals

I wanted this to solve the problems I had. Skipping back and forth was too much work. 
