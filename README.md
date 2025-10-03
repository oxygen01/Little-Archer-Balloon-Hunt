# 🎈 Little Archer Balloon Hunt

A fun and simple balloon shooting game built with Three.js, designed for 3-year-old children to enjoy!

## 🎮 Game Description

Colorful balloons float up from the bottom of the screen. Press ANY key on your keyboard to shoot an arrow from the archer's bow and pop the balloons! Each successful hit creates a burst of colorful emoji confetti with happy sounds.

## ✨ Features

- 🏹 **Simple Controls** - Press any key to shoot arrows
- 🎈 **Colorful Balloons** - Bright, shiny balloons in multiple sizes float upward
- 🎯 **Archery Mechanics** - Arrows fly horizontally, balloons float vertically
- ⚡ **Power-Up Arrows** - Every 5th arrow gets special abilities (Big, Fast, or Rainbow!)
- 🌈 **Arrow Trails** - Colorful particle trails follow arrows
- ✨ **Sparkle Effects** - Star bursts when balloons pop
- 💫 **Balloon Glow** - Balloons glow when arrows get close
- 🎉 **Emoji Confetti** - Big emoji appears when arrows hit balloons
- 💥 **Confetti Burst** - Multiple small emojis explode when balloons reach the top
- 🎵 **Background Music** - Cheerful looping soundtrack
- 🎵 **Sound Effects** - Pop sounds, arrow whoosh, streak celebrations
- 🏆 **Streak System** - Musical celebrations for 3, 5, and 7 consecutive hits
- 🎂 **Birthday Celebration** - Special animation when reaching 10 balloons with Timo's name
- 🔇 **Mute Button** - Easy sound toggle for parents
- 🌄 **Beautiful Background** - Green ground, mountains, trees, and clouds
- 🎨 **No Losing** - Pure fun with no failure states
- 🔢 **Countdown Intro** - Exciting 3-2-1-GO! countdown to start

## 🚀 How to Start

### Option 1: Using Python (Recommended)
```bash
# Navigate to the game directory
cd Little-Archer-Balloon-Hunt

# Start a simple HTTP server
python3 -m http.server 8000
```

Then open your browser and go to: **http://localhost:8000**

### Option 2: Using Yarn
```bash
# Navigate to the game directory
cd Little-Archer-Balloon-Hunt

# Install dependencies (first time only)
yarn install

# Start the development server
yarn start
```

The game will automatically open in your browser at **http://localhost:8080**

### Option 3: Direct File Opening
Simply open the `index.html` file directly in your web browser (Chrome, Firefox, Safari, Edge).

## 🛑 How to Stop

- **If using Python/Yarn server**: Press `Ctrl+C` in the terminal where the server is running
- **If opened directly**: Simply close the browser tab

## 🎯 How to Play

1. **Wait for balloons** to float up from the bottom of the screen
2. **Press ANY key** (spacebar, letters, numbers, etc.) to shoot an arrow
3. **Watch the arrow** fly horizontally from the archer's bow
4. **Hit the balloons** to pop them with confetti and sounds!
5. **Keep shooting** - more balloons keep appearing

### Tips:
- Arrows shoot straight horizontally from the archer's position
- Balloons float upward and may not be at the right height - timing matters!
- If you miss, the arrow flies off screen and a new one can be shot
- Balloons that reach the top explode with a burst of confetti

## 🎨 Game Elements

- **Archer**: Bow emoji (🏹) on the left side
- **Balloons**: 7 different colors (red, teal, yellow, mint, pink, purple, orange)
- **Confetti Emojis**: Smileys (😀😃😄😊) and animals (🐶🐱🐼🐰🦁🐸🐙🦋)
- **Background**: Sky blue with mountains, trees, clouds, and green ground

## 📁 Files

- `index.html` - Main game page with UI overlay
- `game.js` - Game logic, Three.js scene, and enhanced features
- `audio.js` - Sound effects system with synthesized sounds
- `bg-video-game-music.mp3` - Background music (Pixabay)
- `happy-birthday.mp3` - Victory celebration music (Pixabay)
- `README.md` - This file
- `CLAUDE.md` - Project documentation for Claude Code

## 🔧 Technical Details

- **Framework**: Three.js (3D graphics library)
- **Audio**:
  - Web Audio API for synthesized sound effects
  - HTML5 Audio API for background music
  - Background music files sourced from [Pixabay](https://pixabay.com/)
- **Controls**: Keyboard input (any key)
- **Target Age**: 3+ years old
- **Browser**: Modern browsers (Chrome, Firefox, Safari, Edge)
- **Special Features**: Power-ups, particle effects, streak system, birthday celebration

## 🎓 Educational Value

- **Hand-eye coordination**: Timing arrow shots with moving balloons
- **Cause and effect**: Pressing keys makes things happen
- **Spatial awareness**: Understanding horizontal and vertical movement
- **Fine motor skills**: Keyboard interaction

## 🐛 Troubleshooting

**No sound?**
- Click the mute button (🔊) in the top-right corner
- Make sure your device volume is up
- Try pressing a key first (browsers require user interaction before playing sounds)

**Balloons not appearing?**
- Refresh the page (F5 or Cmd+R)
- Check the browser console for errors (F12)

**Game running slow?**
- Close other browser tabs
- Try a different browser
- Reduce screen size

## 📝 License & Attribution

### Game Code
Free to use and modify for personal and educational purposes.

### Audio Files
Background music files (`bg-video-game-music.mp3`, `happy-birthday.mp3`) are sourced from **[Pixabay](https://pixabay.com/)**.

**Pixabay Content License:**
- ✅ Free for commercial and non-commercial use
- ✅ No attribution required (but appreciated)
- ❌ Cannot be redistributed as standalone audio files

For more details, see: [Pixabay License](https://pixabay.com/service/license-summary/)

---

**Enjoy the game! 🎈🎉**
