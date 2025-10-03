// ============================================
// BALLOON POP PARTY - Simple Fun Game
// For 3-year-old boys - Press ANY key to pop!
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Balloon colors (bright and cheerful!)
  BALLOON_COLORS: [
    0xff0000, // Red
    0xffff00, // Yellow
    0x0000ff, // Blue
    0x00ff00, // Green
    0xff69b4, // Pink
    0x9b59b6, // Purple
    0xffa500, // Orange
  ],

  // Emoji confetti (smilies and animals)
  EMOJIS: [
    "😃",
    "😡",
    "😝",
    "😮",
    "🐶",
    "🐱",
    "💩",
    "🚙",
    "🦁",
    "🐸", 
    "🐙",
    "🎉",
    "🎂",
    "⭐",
    "❤️",
  ],

  // Timing (more challenging!)
  SPAWN_INTERVAL: 1200, // 1.2 seconds between spawns (even faster!)
  RISE_SPEED: 0.03, // 50% faster upward float (was 0.008)
  MAX_BALLOONS: 16, // Max balloons on screen at once (more targets!)

  // Visual
  BALLOON_SIZE: 1.2, // Balloon radius

  // Physics
  SWAY_AMOUNT: 0.15, // Gentle side-to-side drift
  SWAY_SPEED: 0.002, // Sway frequency
};

// ============================================
// SCENE SETUP
// ============================================
let scene, camera, renderer;
let balloons = []; // Active balloon objects
let archer = null; // Archer character
let activeArrows = []; // Arrows currently in flight

function initScene() {
  // Create scene with sky blue background
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x87ceeb); // Sky blue

  // Camera setup (perspective for depth)
  const aspect = window.innerWidth / window.innerHeight;
  camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
  camera.position.set(0, 0, 15);
  camera.lookAt(0, 0, 0);

  // Renderer setup
  const canvas = document.getElementById("gameCanvas");
  renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: false,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimize for performance

  // Lighting (soft and even)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(5, 10, 7);
  scene.add(directionalLight);

  // Create background scenery
  createBackground();

  // Create archer
  createArcher();

  console.log("🎮 Scene initialized!");
}

// ============================================
// BACKGROUND SCENERY (Mountains, Trees, Clouds)
// ============================================
function createBackground() {
  // Create green ground at bottom
  createGround();

  // Create mountains (far back)
  createMountains();

  // Create trees (middle ground)
  createTrees();

  // Create clouds (floating)
  createClouds();
}

// ============================================
// GREEN GROUND
// ============================================
function createGround() {
  // Create a green rectangle at the bottom of the screen
  const groundGeometry = new THREE.PlaneGeometry(40, 6); // Wide and tall enough
  const groundMaterial = new THREE.MeshBasicMaterial({
    color: 0x32cd32, // Lime green
    side: THREE.DoubleSide,
  });
  const ground = new THREE.Mesh(groundGeometry, groundMaterial);

  // Position at bottom of screen
  ground.position.set(0, -8, -6); // Far back, below everything

  scene.add(ground);
  console.log("🟩 Green ground created!");
}

// ============================================
// MOUNTAINS
// ============================================
function createMountains() {
  const mountainGroup = new THREE.Group();

  // Mountain 1 (left)
  const mountain1Shape = new THREE.Shape();
  mountain1Shape.moveTo(-15, -8);
  mountain1Shape.lineTo(-12, -2);
  mountain1Shape.lineTo(-9, -8);
  mountain1Shape.lineTo(-15, -8);

  const mountain1Geometry = new THREE.ShapeGeometry(mountain1Shape);
  const mountain1Material = new THREE.MeshBasicMaterial({ color: 0x8b7355 }); // Brown
  const mountain1 = new THREE.Mesh(mountain1Geometry, mountain1Material);
  mountain1.position.z = -5; // Far back
  mountainGroup.add(mountain1);

  // Mountain 2 (center-left)
  const mountain2Shape = new THREE.Shape();
  mountain2Shape.moveTo(-10, -8);
  mountain2Shape.lineTo(-6, 0);
  mountain2Shape.lineTo(-2, -8);
  mountain2Shape.lineTo(-10, -8);

  const mountain2Geometry = new THREE.ShapeGeometry(mountain2Shape);
  const mountain2Material = new THREE.MeshBasicMaterial({ color: 0xa0826d }); // Lighter brown
  const mountain2 = new THREE.Mesh(mountain2Geometry, mountain2Material);
  mountain2.position.z = -4.5;
  mountainGroup.add(mountain2);

  // Mountain 3 (right)
  const mountain3Shape = new THREE.Shape();
  mountain3Shape.moveTo(5, -8);
  mountain3Shape.lineTo(9, -1);
  mountain3Shape.lineTo(13, -8);
  mountain3Shape.lineTo(5, -8);

  const mountain3Geometry = new THREE.ShapeGeometry(mountain3Shape);
  const mountain3Material = new THREE.MeshBasicMaterial({ color: 0x9b8b7e });
  const mountain3 = new THREE.Mesh(mountain3Geometry, mountain3Material);
  mountain3.position.z = -4.8;
  mountainGroup.add(mountain3);

  scene.add(mountainGroup);
  console.log("⛰️ Mountains created!");
}

// ============================================
// TREES
// ============================================
function createTrees() {
  const treeGroup = new THREE.Group();

  // Create several simple trees
  const treePositions = [
    { x: -12, y: -7 },
    { x: -7, y: -7 },
    { x: 3, y: -7 },
    { x: 8, y: -7 },
    { x: 12, y: -7 },
  ];

  treePositions.forEach((pos) => {
    // Tree trunk
    const trunkGeometry = new THREE.BoxGeometry(0.3, 1.5, 0.1);
    const trunkMaterial = new THREE.MeshBasicMaterial({ color: 0x654321 }); // Brown
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.set(pos.x, pos.y + 0.75, -3);

    // Tree foliage (triangle)
    const foliageShape = new THREE.Shape();
    foliageShape.moveTo(0, 0.8);
    foliageShape.lineTo(-0.6, -0.2);
    foliageShape.lineTo(0.6, -0.2);
    foliageShape.lineTo(0, 0.8);

    const foliageGeometry = new THREE.ShapeGeometry(foliageShape);
    const foliageMaterial = new THREE.MeshBasicMaterial({ color: 0x228b22 }); // Forest green
    const foliage = new THREE.Mesh(foliageGeometry, foliageMaterial);
    foliage.position.set(pos.x, pos.y + 1.8, -3);

    treeGroup.add(trunk);
    treeGroup.add(foliage);
  });

  scene.add(treeGroup);
  console.log("🌲 Trees created!");
}

// ============================================
// CLOUDS
// ============================================
function createClouds() {
  const cloudGroup = new THREE.Group();

  // Create several simple clouds
  const cloudPositions = [
    { x: -10, y: 7 },
    { x: -3, y: 8 },
    { x: 5, y: 7.5 },
    { x: 11, y: 8 },
  ];

  cloudPositions.forEach((pos) => {
    // Cloud made of overlapping circles
    const cloud = new THREE.Group();

    // Create 3-4 circles for each cloud
    for (let i = 0; i < 3; i++) {
      const cloudGeometry = new THREE.CircleGeometry(
        0.5 + Math.random() * 0.3,
        16
      );
      const cloudMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.8,
      });
      const cloudPart = new THREE.Mesh(cloudGeometry, cloudMaterial);
      cloudPart.position.set(i * 0.6 - 0.6, Math.random() * 0.2, -2);
      cloud.add(cloudPart);
    }

    cloud.position.set(pos.x, pos.y, 0);
    cloudGroup.add(cloud);
  });

  scene.add(cloudGroup);
  console.log("☁️ Clouds created!");
}

// ============================================
// ARCHER CHARACTER
// ============================================
function createArcher() {
  const archerGroup = new THREE.Group();

  // Create simple archer using emoji (bow and arrow)
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Rotate canvas 90 degrees
  ctx.save();
  ctx.translate(128, 128);
  ctx.rotate((45 * Math.PI) / 180); // 90 degrees
  ctx.translate(-128, -128);

  // Draw archer emoji
  ctx.font = "200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🏹", 128, 128);

  ctx.restore();

  // Create sprite
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2.5, 2.5, 1);

  archerGroup.add(sprite);

  // Position further to the left
  archerGroup.position.set(-11, 0, 0);

  scene.add(archerGroup);
  archer = archerGroup;

  console.log("🏹 Archer emoji created and rotated 90°!");
}

// ============================================
// ARROW CLASS
// ============================================
class Arrow {
  constructor(archerY) {
    this.mesh = null;
    this.speed = 0.3;
    this.hasHit = false;
    this.archerY = archerY; // Y position where arrow was fired

    this.createArrow();

    // Start position at archer
    this.mesh.position.set(archer.position.x, archerY, 0.5); // In front of balloons

    // Arrow shoots ONLY horizontally (right along X-axis)
    // No rotation needed - arrow already points right

    scene.add(this.mesh);
  }

  createArrow() {
    // Create arrow shaft (thin cylinder)
    const shaftGeometry = new THREE.CylinderGeometry(0.03, 0.03, 1, 8);
    const shaftMaterial = new THREE.MeshBasicMaterial({ color: 0x8b4513 }); // Brown
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2; // Point horizontally

    // Create arrowhead (cone)
    const headGeometry = new THREE.ConeGeometry(0.1, 0.3, 8);
    const headMaterial = new THREE.MeshBasicMaterial({ color: 0xc0c0c0 }); // Silver
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.rotation.z = -Math.PI / 2; // Point right
    head.position.x = 0.65;

    // Group arrow parts
    const arrowGroup = new THREE.Group();
    arrowGroup.add(shaft);
    arrowGroup.add(head);

    this.mesh = arrowGroup;
  }

  update() {
    if (this.hasHit) return true; // Remove from array

    // Move arrow ONLY horizontally (right along X-axis)
    this.mesh.position.x += this.speed;

    // Check collision with ANY balloon at this Y level
    for (let balloon of balloons) {
      const dx = this.mesh.position.x - balloon.mesh.position.x;
      const dy = this.mesh.position.y - balloon.mesh.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < CONFIG.BALLOON_SIZE) {
        // Hit! Pop the balloon
        balloon.pop();
        this.destroy();
        return true; // Signal removal
      }
    }

    // Check if arrow went off screen (right side)
    if (this.mesh.position.x > 15) {
      playMissSound(); // Gentle whoosh for missing
      this.destroy();
      return true; // Signal removal (miss!)
    }

    return false;
  }

  destroy() {
    this.hasHit = true;
    if (this.mesh) {
      scene.remove(this.mesh);
      this.mesh.traverse((child) => {
        if (child.geometry) child.geometry.dispose();
        if (child.material) child.material.dispose();
      });
    }
  }
}

// ============================================
// SHOOT ARROW
// ============================================
function shootArrow() {
  // Arrow shoots from archer's current Y position (horizontally)
  const arrow = new Arrow(archer.position.y);
  activeArrows.push(arrow);

  // Play shoot sound
  playShootSound();

  // Animate archer (slight recoil)
  animateArcherShoot();

  console.log("➡️ Arrow fired horizontally!");
}

// ============================================
// ANIMATE ARCHER SHOOTING
// ============================================
function animateArcherShoot() {
  const originalX = archer.position.x;
  const recoilAmount = -0.3;
  const duration = 200; // ms
  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      archer.position.x = originalX;
    } else {
      // Recoil back, then forward
      const recoil = Math.sin(progress * Math.PI) * recoilAmount;
      archer.position.x = originalX + recoil;
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// ============================================
// BALLOON CLASS
// ============================================
class Balloon {
  constructor(color) {
    this.color = color;
    this.timeAlive = 0;
    this.mesh = null;
    this.stringMesh = null;
    this.swayOffset = Math.random() * Math.PI * 2; // Unique sway pattern
    this.hasPopped = false; // Flag to ensure only one pop per balloon

    this.createBalloon();
    this.createString();

    // Random starting position at bottom of screen
    const startX = (Math.random() - 0.5) * 10;
    const startY = -8;

    this.mesh.position.set(startX, startY, 0);
    this.updateStringPosition();

    // Add to scene
    scene.add(this.mesh);
    scene.add(this.stringMesh);
  }

  createBalloon() {
    // Create shiny balloon sphere
    const geometry = new THREE.SphereGeometry(CONFIG.BALLOON_SIZE, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: this.color,
      shininess: 100,
      specular: 0xffffff,
      emissive: this.color,
      emissiveIntensity: 0.2,
    });
    this.mesh = new THREE.Mesh(geometry, material);
  }

  createString() {
    // Thin string hanging below balloon
    const stringGeometry = new THREE.CylinderGeometry(0.02, 0.02, 1.5, 8);
    const stringMaterial = new THREE.MeshBasicMaterial({
      color: 0x444444,
    });
    this.stringMesh = new THREE.Mesh(stringGeometry, stringMaterial);
  }

  update(deltaTime) {
    this.timeAlive += deltaTime;

    // Float upward slowly
    this.mesh.position.y += CONFIG.RISE_SPEED;

    // Gentle side-to-side sway
    const swayX =
      Math.sin(this.timeAlive * CONFIG.SWAY_SPEED + this.swayOffset) *
      CONFIG.SWAY_AMOUNT;
    this.mesh.position.x += swayX * 0.01;

    // Update string position
    this.updateStringPosition();

    // Check if balloon floated off top of screen
    if (this.mesh.position.y > 10 && !this.hasPopped) {
      console.log("🎈 Balloon reached top! Burst confetti!");
      this.hasPopped = true; // Mark as popped

      // Create confetti BURST when reaching top
      const popPosition = this.mesh.position.clone();
      createConfettiBurst(popPosition);
      playEscapeSound(); // Happy chime for balloon escaping
      this.destroy();
      return true; // Signal for removal from array
    }

    return false;
  }

  updateStringPosition() {
    if (this.stringMesh && this.mesh) {
      this.stringMesh.position.set(
        this.mesh.position.x,
        this.mesh.position.y - CONFIG.BALLOON_SIZE - 0.75,
        this.mesh.position.z
      );
    }
  }

  pop() {
    // Prevent double-popping
    if (this.hasPopped) return;
    this.hasPopped = true;

    // Store position before destroying
    const popPosition = this.mesh.position.clone();

    // Create emoji confetti explosion at balloon position
    createEmojiConfetti(popPosition);

    // Play happy pop sound and combo sound
    playPopSound();
    playComboSound();

    // Remove balloon from scene
    this.destroy();
  }

  destroy() {
    // Remove all meshes from scene
    if (this.mesh) scene.remove(this.mesh);
    if (this.stringMesh) scene.remove(this.stringMesh);

    // Clean up geometries and materials
    if (this.mesh) {
      this.mesh.geometry.dispose();
      this.mesh.material.dispose();
    }
    if (this.stringMesh) {
      this.stringMesh.geometry.dispose();
      this.stringMesh.material.dispose();
    }

    // Note: Removal from balloons array is now handled by filter in animate()
  }
}

// ============================================
// BALLOON SPAWNING SYSTEM
// ============================================
let lastSpawnTime = 0;

function spawnBalloon() {
  // Don't spawn if at max capacity
  if (balloons.length >= CONFIG.MAX_BALLOONS) {
    return;
  }

  // Pick random color
  const color =
    CONFIG.BALLOON_COLORS[
      Math.floor(Math.random() * CONFIG.BALLOON_COLORS.length)
    ];

  // Create new balloon
  const balloon = new Balloon(color);
  balloons.push(balloon);

  // Play launch sound
  playLaunchSound();

  console.log(`🎈 Spawned balloon`);
}

// ============================================
// EMOJI CONFETTI - ONE BIG EMOJI FOR 2 SECONDS
// ============================================
function createEmojiConfetti(position) {
  // Pick random emoji from config
  const emoji = CONFIG.EMOJIS[Math.floor(Math.random() * CONFIG.EMOJIS.length)];

  // Create canvas with BIG emoji
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Draw big emoji
  ctx.font = "200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(emoji, 128, 128);

  // Create texture and sprite
  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
    opacity: 1.0,
  });
  const sprite = new THREE.Sprite(spriteMaterial);

  // BIG size!
  sprite.scale.set(3, 3, 1);

  // Position at pop location
  sprite.position.copy(position);

  scene.add(sprite);

  // Animate: stay for 2 seconds (120 frames at 60fps)
  const displayDuration = 120; // frames
  let frameCount = 0;

  function animateBigEmoji() {
    frameCount++;

    // Slight scale pulse animation (makes it more fun!)
    const pulse = 1 + Math.sin(frameCount * 0.1) * 0.1;
    sprite.scale.set(3 * pulse, 3 * pulse, 1);

    // Fade out in last 20 frames
    if (frameCount > displayDuration - 20) {
      const fadeProgress = (displayDuration - frameCount) / 20;
      sprite.material.opacity = fadeProgress;
    }

    // Remove after 2 seconds
    if (frameCount >= displayDuration) {
      scene.remove(sprite);
      sprite.material.map.dispose();
      sprite.material.dispose();
    } else {
      requestAnimationFrame(animateBigEmoji);
    }
  }

  animateBigEmoji();
}

// ============================================
// CONFETTI BURST (Multiple small emojis)
// ============================================
function createConfettiBurst(position) {
  const emojiCount = 20; // Many small emojis
  const sprites = [];

  for (let i = 0; i < emojiCount; i++) {
    // Pick random emoji
    const emoji =
      CONFIG.EMOJIS[Math.floor(Math.random() * CONFIG.EMOJIS.length)];

    // Create canvas with emoji
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const ctx = canvas.getContext("2d");

    ctx.font = "100px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(emoji, 64, 64);

    // Create sprite
    const texture = new THREE.CanvasTexture(canvas);
    const spriteMaterial = new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      opacity: 1.0,
    });
    const sprite = new THREE.Sprite(spriteMaterial);

    // Small varied sizes
    const size = 0.4 + Math.random() * 0.3;
    sprite.scale.set(size, size, 1);

    // Start at pop position
    sprite.position.copy(position);

    // Random outward velocity (radial burst) - SLOWER for visibility
    const angle = Math.random() * Math.PI * 2;
    const speed = 0.05 + Math.random() * 0.08; // Much slower (was 0.15-0.4)
    sprite.velocity = new THREE.Vector3(
      Math.cos(angle) * speed,
      Math.sin(angle) * speed,
      (Math.random() - 0.5) * 0.05
    );

    sprite.angularVelocity = (Math.random() - 0.5) * 0.15; // Slower rotation
    sprite.life = 180; // frames (3 seconds at 60fps - was 90)
    sprite.maxLife = 180;

    scene.add(sprite);
    sprites.push(sprite);
  }

  // Animate confetti burst
  function animateConfettiBurst() {
    let aliveCount = 0;

    sprites.forEach((sprite) => {
      // Apply velocity
      sprite.position.add(sprite.velocity);

      // Apply gentle gravity (slower fall)
      sprite.velocity.y -= 0.001; // Gentler gravity (was 0.012)

      // Rotation
      sprite.material.rotation += sprite.angularVelocity * 0.05;

      // Decrease life
      sprite.life--;

      // Fade out based on remaining life
      sprite.material.opacity = sprite.life / sprite.maxLife;

      // Remove when dead
      if (sprite.life <= 0) {
        scene.remove(sprite);
        sprite.material.map.dispose();
        sprite.material.dispose();
      } else {
        aliveCount++;
      }
    });

    // Continue animating if sprites still alive
    if (aliveCount > 0) {
      requestAnimationFrame(animateConfettiBurst);
    }
  }

  animateConfettiBurst();
}

// ============================================
// INPUT HANDLING (KEYBOARD - ANY KEY!)
// ============================================
function handleKeyPress(event) {
  // Prevent default behavior (like space scrolling page)
  event.preventDefault();

  // Ignore modifier-only keys
  if (event.ctrlKey || event.altKey || event.metaKey) {
    return;
  }

  // Shoot arrow horizontally (might hit or miss!)
  console.log(`🎯 Shooting arrow horizontally!`);
  shootArrow();
}

// ============================================
// ANIMATION LOOP
// ============================================
let lastTime = performance.now();

function animate() {
  requestAnimationFrame(animate);

  const currentTime = performance.now();
  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  // Spawn new balloon based on timer
  if (currentTime - lastSpawnTime > CONFIG.SPAWN_INTERVAL) {
    spawnBalloon();
    lastSpawnTime = currentTime;
  }

  // Update all active balloons and remove ones that return true
  balloons = balloons.filter((balloon) => !balloon.update(deltaTime));

  // Update all active arrows
  activeArrows = activeArrows.filter((arrow) => !arrow.update());

  // Render the scene
  renderer.render(scene, camera);
}

// ============================================
// WINDOW RESIZE HANDLER
// ============================================
function onWindowResize() {
  const width = window.innerWidth;
  const height = window.innerHeight;

  camera.aspect = width / height;
  camera.updateProjectionMatrix();

  renderer.setSize(width, height);

  console.log("📐 Window resized");
}

// ============================================
// INITIALIZATION
// ============================================
function init() {
  console.log("🚀 Initializing Balloon Pop Party...");

  // Setup Three.js scene
  initScene();

  // Setup audio system
  initAudio();

  // Event listeners
  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("resize", onWindowResize);

  // Start spawn timer
  lastSpawnTime = performance.now();

  // Spawn first balloon immediately
  setTimeout(() => spawnBalloon(), 500);

  // Start animation loop
  animate();

  console.log("✅ Game ready! Press ANY key to pop balloons!");
}

// ============================================
// START GAME WHEN PAGE LOADS
// ============================================
window.addEventListener("load", init);
