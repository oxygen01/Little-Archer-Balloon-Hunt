# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Little Archer Balloon Hunt is a browser-based balloon shooting game built with Three.js for young children (3+ years). The game features an archer that shoots arrows horizontally at balloons floating vertically up the screen.

## Running the Game

```bash
# Start local development server
npm start
```

This uses `http-server` to serve the game on `http://localhost:8080` and automatically opens it in the browser.

Alternative methods:
- Python: `python3 -m http.server 8000`
- Direct: Open `index.html` in a browser

## Architecture

### File Structure
- **index.html**: Main entry point with UI overlay (mute button, instructions)
- **game.js**: Core game logic, Three.js scene, balloons, arrows, archer
- **audio.js**: Web Audio API sound system (pop sounds, arrow whoosh)

### Key Components

**Scene Setup** ([game.js:61-97](game.js#L61-L97))
- Three.js scene with perspective camera and WebGL renderer
- Sky blue background with ambient and directional lighting
- Scenery includes mountains, trees, clouds, and green ground

**Archer** ([game.js:271-312](game.js#L271-L312))
- Emoji-based sprite (🏹) positioned on the left side
- Rotated 45° for visual effect
- Has recoil animation when shooting

**Balloons** ([game.js:444-566](game.js#L444-L566))
- 7 configurable colors with shiny Phong material
- Float upward with gentle side-to-side sway
- Spawn at bottom, rise to top at configurable speed
- Auto-spawn based on `SPAWN_INTERVAL` (max `MAX_BALLOONS` on screen)
- Show emoji confetti when popped or reaching the top

**Arrows** ([game.js:317-396](game.js#L317-L396))
- Shoot horizontally (X-axis) from archer's Y position
- Collision detection with balloons based on distance
- Auto-remove when hitting balloon or going off-screen

**Confetti System** ([game.js:595-751](game.js#L595-L751))
- Single large emoji (2 seconds) when arrow hits balloon
- Burst of 20 small emojis when balloon reaches top
- Uses canvas textures for emoji rendering as Three.js sprites

**Audio** ([audio.js](audio.js))
- Web Audio API for synthesized sounds (no external files)
- `playPopSound()`: Random pitch sine wave (400-900 Hz)
- `playShootSound()`: Descending sawtooth wave (800→200 Hz)
- Mute toggle button in UI

### Configuration

All tunable parameters are in `CONFIG` object ([game.js:9-51](game.js#L9-L51)):
- Balloon colors, emojis, spawn timing, rise speed
- Max balloons, balloon size, sway physics

### Input Handling

Keyboard: Any key press shoots arrow horizontally ([game.js:756-768](game.js#L756-L768))
- Prevents default browser behavior
- Ignores modifier-only keys
- Arrow trajectory is purely horizontal, balloons move vertically

## Key Game Mechanics

1. **No failure state**: This is a pure fun experience for young children
2. **Horizontal vs Vertical**: Arrows shoot horizontally, balloons float vertically - timing is key
3. **Hit detection**: Distance-based collision between arrow position and balloon position
4. **Confetti types**:
   - Arrow hit: One big emoji at pop location
   - Balloon reaches top: Radial burst of 20 small emojis
