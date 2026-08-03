---
layout: project.njk
title: "RAVISHIN' 2"
description: "An RPG based of me and my friends' first semester of college!"
tags: ["Python", "art", "game"]
date: 2026-06-01
image: "/assets/images/ravishin-2/cover.png"
link: "https://colinstick.itch.io/ravishin-2"
---

## Overview

The sequel to [*RAVISHIN'*](/projects/ravishin), this game has a more robust battle system, a lengthier and more in depth story, improved animations, new characters, an episode system, and more! (Password to the itch.io page is `bigwishes`.)

# Episode One
## Trailer

For fun, I created [a trailer](https://www.youtube.com/watch?v=8fC-b7tiM4I&t=53s) to send to my friend before the game released!

## Gameplay

Here are some stitched together clips of the game. They showcase the dialogue, art, choices, music, battles, and post-game content I included.

<div class="video-container">
  <div class="youtube-embed">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/_tq1a3RSMqU?si=DoR-Yqde3LDnY31I" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
  </div>
</div>


# Battle System

This project features a turn-based bullet-hell battle system built in [Ren'Py](https://www.renpy.org/), combining a visual novel dialogue engine with a real-time game loop running at ~60 FPS. This was inspired by games like [Undertale](https://undertale.com/).

The system is split across three files: `battle_bosses.rpy` defines each boss's attack sequence, `battle_resources.rpy` contains the core classes and game loop, and `battles.rpy` wires it all together into a live screen.

## Overview

The entry point for any battle is running the code
```python
$ start_battle(name, bpm, health)
```
-- which initializes a fresh `Player` and `Enemy`, loads the bosses phase sequence (sequence of dialogue, player turns, and boss attacks) from the `bosses` dictionary, and hands off control to the `bullet_hell` screen. That screen runs a timer that calls `update_basics()` 60 ticks per second. Each tick increments a timer `tempTimer`, moves the player, runs `battle_loop()`, and checks the win/loss conditions.

## Phases

Each boss is defined with a name and a list of `BattlePhase` objects.

```python
class BattlePhase:
    def __init__(self, kind, data=None):
        self.kind = kind # dialogue, player, enemy
        self.data = data
```

The function `battle_loop()` reads the current phase at `battle_step()` and takes one of the following actions:

- **`dialgoue`** phases render text one at a time into a speech bubble overlay. Advancing each line of text requires the player to press SPACE, which a small minimum hold time that is proportional to the line length to prevent accidentally skipping through

- **`player`** phases display PUNCH and HEAL buttons, that the player must navigate to and press SPACE to act. Punching damages the boss, and healing heals the player

- **`enemy`** phases call a given attack function at a given difficulty for a given duration. It is given as a list `[attack_fn, duration_seconds, difficulty]`

After each phase completes, `battle_step` increments by one. If the end of the entire sequences of phases is reached for either the player or the boss reaches 0 HP, `battle_step` decrements by 4 to loop the last few phases, so that the fight continues until an end condition is met.

## Projectile System

For each bosses attack, all the active projectiles live in a shared `bullets` list. So, if new bullet types are added in the future, it will be easy to do so. So far, there are two types of projectiles

- **`Bullet`** is the general-purpose projectile. It stores its position, velocity, size, and image path. It's `update()` method moves it based on velocity. Its `collides()` method checks if it intersects with the player's hitbox.

- **`Laser`** has a two-stage life cycle which is controlled by `laserupdate(timeAlive)`: a prefire phase and a firing phase. Collision is checked only during the firing phase. 

Each individual attack function (or pattern) is responsible for spawning projectiles into `bullets`, updating them each tick, checking collisions with `player.hurt()`, and deleting out-of-bounds or expired objects. When an attack ends, `bullets.clear()` is called, leaving a clean slate for the next phase.

## Extensibility

This system is designed so that when adding a new boss in a future episode, only requires writing some attack functions, creating new sprites, writing dialogue, and putting a list of `BattlePhase`s in the `bosses` dictionary. The game loop, rendering, win/loss logic is all handled automatically.

For an example, ETHAN's battle is started with a single call, with ETHAN's battle sprite bopping to the music at 148 BPM, and his health being set to 167.

```python
$ start_battle("ethan", 148, 167)
```

Also, a snippet of his entry in the `bosses` dictionary:

```python
"ethan": [
    BattlePhase("dialogue", [
        "..."
    ]),
    BattlePhase("enemy", [target_slice_attack,10,2]),
    BattlePhase("player"),
    BattlePhase("dialogue", [ 
        "If you want to survive this...",
        "...you should avoid being {color=#a12118ff}pointed at.{/color}"
    ]),
    BattlePhase("enemy", [simple_laser_attack,8,1]),
    BattlePhase("player"),
    BattlePhase("dialogue", [
        "It all leads back to you..."
    ]),
    BattlePhase("enemy", [rapid_laser_attack,4.5,1]),
    BattlePhase("player"),
# This continues...
```