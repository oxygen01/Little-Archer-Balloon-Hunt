// ============================================
// LITTLE ARCHER BALLOON HUNT - Simple Fun Game
// For 3-year-old children - Press ANY key to shoot!
// ============================================

// ============================================
// CONFIGURATION
// ============================================
const CONFIG = {
  // Balloon colors (bright and cheerful!)
  BALLOON_COLORS: [
    0xff1744, // Bright Red
    0xffeb3b, // Bright Yellow
    0x2196f3, // Sky Blue
    0x4caf50, // Grass Green
    0xff4081, // Hot Pink
    0x9c27b0, // Vibrant Purple
    0xff9800, // Bright Orange
    0x00bcd4, // Cyan
    0xe91e63, // Deep Pink
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

// ============================================
// BIRTHDAY CELEBRATION TRACKING
// ============================================
let balloonsPopped = 0;
const BALLOONS_TO_WIN = 10;
let isCelebrating = false;
const balloonCounterEl = document.getElementById('balloonCounter');
const celebrationEl = document.getElementById('celebration');

// 2D Confetti Canvas
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx = confettiCanvas.getContext('2d');
let confettiParticles = [];
let confettiAnimationId = null;

// ============================================
// ENHANCED GAME FEATURES
// ============================================
// Countdown
const countdownEl = document.getElementById('countdown');
let gameStarted = false;
let countdownShown = false;

// Power-ups
const powerUpIndicatorEl = document.getElementById('powerUpIndicator');
let arrowCount = 0;
let currentPowerUp = null;
const POWER_UP_TYPES = ['big', 'fast', 'rainbow'];

// Streak system
let currentStreak = 0;
let missedShots = 0;

// Arrow trails
let arrowTrails = [];

// Archer animation
let archerOriginalX = -11;
let archerOriginalY = 0;
let isArcherDancing = false;
let isArcherRecoiling = false;

// Celebration Character
let celebrationCharacter = null;
let characterOriginalX = -11;
let characterOriginalY = -5;
let isCharacterCelebrating = false;

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

  // Create celebration character
  createCelebrationCharacter();

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
  archerOriginalX = -11; // Store original X position
  archerOriginalY = 0; // Store original Y position

  scene.add(archerGroup);
  archer = archerGroup;

  console.log("🏹 Archer emoji created and rotated 90°!");
}

// ============================================
// CELEBRATION CHARACTER
// ============================================
function createCelebrationCharacter() {
  // Load monkey sprite image
  const textureLoader = new THREE.TextureLoader();

  textureLoader.load(
    'monkey-sprite.png', // Place your downloaded monkey sprite here
    (texture) => {
      // Success - create sprite with loaded texture
      const spriteMaterial = new THREE.SpriteMaterial({
        map: texture,
        transparent: true,
      });
      const sprite = new THREE.Sprite(spriteMaterial);
      sprite.scale.set(3.0, 3.0, 1); // Slightly larger for visibility

      // Position at bottom-right
      sprite.position.set(characterOriginalX, characterOriginalY, 1);

      scene.add(sprite);
      celebrationCharacter = sprite;

      console.log("🐵 Celebration monkey character loaded!");
    },
    undefined, // Progress callback (optional)
    (error) => {
      // Error - fallback to emoji
      console.warn("Could not load monkey sprite, using emoji fallback:", error);
      createCharacterFallback();
    }
  );
}

// Fallback function if image fails to load
function createCharacterFallback() {
  const canvas = document.createElement("canvas");
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext("2d");

  // Draw monkey emoji as fallback
  ctx.font = "200px Arial";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("🐵", 128, 128);

  const texture = new THREE.CanvasTexture(canvas);
  const spriteMaterial = new THREE.SpriteMaterial({
    map: texture,
    transparent: true,
  });
  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(2.5, 2.5, 1);

  sprite.position.set(characterOriginalX, characterOriginalY, 1);
  scene.add(sprite);
  celebrationCharacter = sprite;

  console.log("🐵 Celebration character created (emoji fallback)!");
}

// ============================================
// ARROW CLASS
// ============================================
class Arrow {
  constructor(archerY, powerUp = null) {
    this.mesh = null;
    this.powerUp = powerUp;
    this.hasHit = false;
    this.archerY = archerY; // Y position where arrow was fired
    this.trailParticles = [];
    this.time = 0;

    // Power-up stats
    if (powerUp === 'big') {
      this.speed = 0.3;
      this.sizeMultiplier = 2.0;
      this.hitRadius = CONFIG.BALLOON_SIZE * 1.5;
    } else if (powerUp === 'fast') {
      this.speed = 0.6;
      this.sizeMultiplier = 1.0;
      this.hitRadius = CONFIG.BALLOON_SIZE;
    } else if (powerUp === 'rainbow') {
      this.speed = 0.3;
      this.sizeMultiplier = 1.0;
      this.hitRadius = CONFIG.BALLOON_SIZE;
    } else {
      this.speed = 0.3;
      this.sizeMultiplier = 1.0;
      this.hitRadius = CONFIG.BALLOON_SIZE;
    }

    this.createArrow();

    // Start position at archer
    this.mesh.position.set(archer.position.x, archerY, 0.5); // In front of balloons

    scene.add(this.mesh);
  }

  createArrow() {
    // Create arrow shaft (thin cylinder)
    const shaftGeometry = new THREE.CylinderGeometry(0.03 * this.sizeMultiplier, 0.03 * this.sizeMultiplier, 1 * this.sizeMultiplier, 8);
    const shaftColor = this.powerUp === 'rainbow' ? 0xff00ff : 0x8b4513;
    const shaftMaterial = new THREE.MeshBasicMaterial({ color: shaftColor });
    const shaft = new THREE.Mesh(shaftGeometry, shaftMaterial);
    shaft.rotation.z = Math.PI / 2; // Point horizontally

    // Create arrowhead (cone)
    const headGeometry = new THREE.ConeGeometry(0.1 * this.sizeMultiplier, 0.3 * this.sizeMultiplier, 8);
    const headColor = this.powerUp ? 0xffd700 : 0xc0c0c0; // Gold for power-up
    const headMaterial = new THREE.MeshBasicMaterial({ color: headColor });
    const head = new THREE.Mesh(headGeometry, headMaterial);
    head.rotation.z = -Math.PI / 2; // Point right
    head.position.x = 0.65 * this.sizeMultiplier;

    // Group arrow parts
    const arrowGroup = new THREE.Group();
    arrowGroup.add(shaft);
    arrowGroup.add(head);

    this.mesh = arrowGroup;
  }

  update() {
    if (this.hasHit) return true; // Remove from array

    this.time++;

    // Move arrow ONLY horizontally (right along X-axis)
    this.mesh.position.x += this.speed;

    // Rainbow color cycling for rainbow arrow
    if (this.powerUp === 'rainbow') {
      const hue = (this.time * 0.05) % 1;
      this.mesh.children[0].material.color.setHSL(hue, 1, 0.5);
    }

    // Create trail particle
    if (this.time % 2 === 0) {
      this.createTrailParticle();
    }

    // Check collision with ANY balloon at this Y level
    for (let balloon of balloons) {
      const dx = this.mesh.position.x - balloon.mesh.position.x;
      const dy = this.mesh.position.y - balloon.mesh.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.hitRadius) {
        // Hit! Pop the balloon
        balloon.pop();
        this.destroy();
        return true; // Signal removal
      }
    }

    // Check if arrow went off screen (right side)
    if (this.mesh.position.x > 15) {
      playMissSound(); // Gentle whoosh for missing
      resetStreak(); // Reset streak on miss
      this.destroy();
      return true; // Signal removal (miss!)
    }

    return false;
  }

  createTrailParticle() {
    const geometry = new THREE.CircleGeometry(0.1, 8);
    const color = this.powerUp === 'rainbow'
      ? new THREE.Color().setHSL(Math.random(), 1, 0.6)
      : new THREE.Color(0xffaa00);
    const material = new THREE.MeshBasicMaterial({
      color: color,
      transparent: true,
      opacity: 0.8
    });
    const particle = new THREE.Mesh(geometry, material);

    particle.position.copy(this.mesh.position);
    particle.userData = { life: 1.0 };

    scene.add(particle);
    this.trailParticles.push(particle);

    // Fade out trail
    setTimeout(() => {
      const fadeOut = () => {
        particle.userData.life -= 0.05;
        particle.material.opacity = particle.userData.life;
        if (particle.userData.life > 0) {
          requestAnimationFrame(fadeOut);
        } else {
          scene.remove(particle);
          particle.geometry.dispose();
          particle.material.dispose();
        }
      };
      fadeOut();
    }, 50);
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
  arrowCount++;

  // Check for power-up every 5th arrow
  if (arrowCount % 5 === 0) {
    currentPowerUp = POWER_UP_TYPES[Math.floor(Math.random() * POWER_UP_TYPES.length)];
    powerUpIndicatorEl.classList.add('active');
    console.log(`⚡ POWER-UP: ${currentPowerUp.toUpperCase()} ARROW!`);
  }

  // Arrow shoots from archer's current Y position (horizontally)
  const arrow = new Arrow(archer.position.y, currentPowerUp);
  activeArrows.push(arrow);

  // Clear power-up after use
  if (currentPowerUp) {
    setTimeout(() => {
      currentPowerUp = null;
      powerUpIndicatorEl.classList.remove('active');
    }, 500);
  }

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
  if (isArcherRecoiling) return; // Prevent overlapping recoil animations

  isArcherRecoiling = true;
  const recoilAmount = -0.3;
  const duration = 200; // ms
  const startTime = performance.now();

  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      archer.position.x = archerOriginalX; // Always return to original X position
      isArcherRecoiling = false;
    } else {
      // Recoil back, then forward
      const recoil = Math.sin(progress * Math.PI) * recoilAmount;
      archer.position.x = archerOriginalX + recoil;
      requestAnimationFrame(animate);
    }
  }

  animate();
}

// ============================================
// CHARACTER CELEBRATION ANIMATION
// ============================================
function characterCelebrate() {
  if (!celebrationCharacter || isCharacterCelebrating) return;

  isCharacterCelebrating = true;
  const duration = 400; // ms
  const startTime = performance.now();

  // Pick random animation type
  const animations = ['jump', 'spin', 'shake', 'pulse'];
  const animationType = animations[Math.floor(Math.random() * animations.length)];

  function animate() {
    const elapsed = performance.now() - startTime;
    const progress = elapsed / duration;

    if (progress >= 1) {
      // Return to original position and scale
      celebrationCharacter.position.x = characterOriginalX;
      celebrationCharacter.position.y = characterOriginalY;
      celebrationCharacter.scale.set(2.5, 2.5, 1);
      celebrationCharacter.rotation.z = 0;
      isCharacterCelebrating = false;
    } else {
      if (animationType === 'jump') {
        // Jump up and down
        const jumpHeight = Math.sin(progress * Math.PI) * 1.5;
        celebrationCharacter.position.y = characterOriginalY + jumpHeight;
      } else if (animationType === 'spin') {
        // Spin 360 degrees
        celebrationCharacter.rotation.z = progress * Math.PI * 2;
      } else if (animationType === 'shake') {
        // Shake left and right
        const shakeAmount = Math.sin(progress * Math.PI * 8) * 0.3;
        celebrationCharacter.position.x = characterOriginalX + shakeAmount;
      } else if (animationType === 'pulse') {
        // Scale up and down
        const pulseScale = 1 + Math.sin(progress * Math.PI) * 0.3;
        celebrationCharacter.scale.set(2.5 * pulseScale, 2.5 * pulseScale, 1);
      }
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

    // Size variety: 70% normal, 20% big, 10% small
    const rand = Math.random();
    if (rand < 0.10) {
      this.sizeMultiplier = 0.7; // Small
    } else if (rand < 0.30) {
      this.sizeMultiplier = 1.4; // Big
    } else {
      this.sizeMultiplier = 1.0; // Normal
    }

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
    // Create shiny balloon sphere with size variety
    const size = CONFIG.BALLOON_SIZE * this.sizeMultiplier;
    const geometry = new THREE.SphereGeometry(size, 32, 32);
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

    // Wobble animation (gentle squash and stretch)
    const wobble = Math.sin(this.timeAlive * 0.003) * 0.05 + 1;
    this.mesh.scale.set(1, wobble, 1);

    // Check proximity to arrows for glow effect
    this.checkArrowProximity();

    // Update string position
    this.updateStringPosition();

    // Check if balloon floated off top of screen
    if (this.mesh.position.y > 10 && !this.hasPopped) {
      console.log("🎈 Balloon reached top! Burst confetti!");
      this.hasPopped = true; // Mark as popped

      // Create confetti BURST when reaching top
      const popPosition = this.mesh.position.clone();
      createConfettiBurst(popPosition);
      // No sound when balloon escapes to the top
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

  checkArrowProximity() {
    // Check if any arrow is close and add glow effect
    let closestDistance = Infinity;
    activeArrows.forEach(arrow => {
      const distance = this.mesh.position.distanceTo(arrow.mesh.position);
      if (distance < closestDistance) {
        closestDistance = distance;
      }
    });

    // Add emissive glow when arrow is close (within 3 units)
    if (closestDistance < 3) {
      const glowIntensity = Math.max(0, 1 - closestDistance / 3);
      this.mesh.material.emissive.setHex(0xffff00); // Yellow glow
      this.mesh.material.emissiveIntensity = glowIntensity * 0.5;
    } else {
      this.mesh.material.emissiveIntensity = 0;
    }
  }

  pop() {
    // Prevent double-popping
    if (this.hasPopped) return;
    this.hasPopped = true;

    // Store position before destroying
    const popPosition = this.mesh.position.clone();

    // Create sparkle burst at impact point
    createSparkleBurst(popPosition);

    // Create emoji confetti explosion at balloon position
    createEmojiConfetti(popPosition);

    // Play happy pop sound and combo sound
    playPopSound();
    playComboSound();

    // Celebrate with character animation
    characterCelebrate();

    // Update streak
    currentStreak++;
    checkStreak();

    // Increment balloon counter
    incrementBalloonCounter();

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
// BIRTHDAY CELEBRATION FUNCTIONS
// ============================================
function incrementBalloonCounter() {
  if (isCelebrating) return;

  balloonsPopped++;
  balloonCounterEl.textContent = `🎈 ${balloonsPopped}/${BALLOONS_TO_WIN}`;

  // Check if player won
  if (balloonsPopped >= BALLOONS_TO_WIN) {
    triggerCelebration();
  }
}

function triggerCelebration() {
  isCelebrating = true;
  console.log('🎉 BIRTHDAY CELEBRATION! 🎉');

  // Stop background music and play victory music
  playVictoryMusic();

  // Show celebration overlay
  celebrationEl.classList.add('active');

  // Setup confetti canvas
  confettiCanvas.width = window.innerWidth;
  confettiCanvas.height = window.innerHeight;

  // Create 2D confetti particles
  create2DConfetti();

  // Start confetti animation
  animate2DConfetti();
}

// ============================================
// 2D CANVAS CONFETTI SYSTEM
// ============================================
class ConfettiParticle {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.size = Math.random() * 12 + 8; // 8-20px
    this.speedX = (Math.random() - 0.5) * 8;
    this.speedY = Math.random() * -15 - 5; // Launch upward
    this.gravity = 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = (Math.random() - 0.5) * 15;
    this.color = this.randomColor();
    this.opacity = 1;
    this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
  }

  randomColor() {
    const colors = [
      '#FF0000', '#FF7F00', '#FFFF00', '#00FF00',
      '#0000FF', '#4B0082', '#9400D3', '#FF1493',
      '#00FFFF', '#FF69B4', '#FFD700', '#FF6347'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  update() {
    this.speedY += this.gravity;
    this.x += this.speedX;
    this.y += this.speedY;
    this.rotation += this.rotationSpeed;

    // Fade out when falling
    if (this.y > window.innerHeight / 2) {
      this.opacity -= 0.01;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;

    if (this.shape === 'rect') {
      ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    } else {
      ctx.beginPath();
      ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  isDead() {
    return this.opacity <= 0 || this.y > window.innerHeight + 50;
  }
}

function create2DConfetti() {
  confettiParticles = [];

  // Create initial burst from center
  for (let i = 0; i < 150; i++) {
    confettiParticles.push(
      new ConfettiParticle(
        window.innerWidth / 2 + (Math.random() - 0.5) * 200,
        window.innerHeight / 2
      )
    );
  }

  // Continuous confetti from top
  setInterval(() => {
    if (isCelebrating) {
      for (let i = 0; i < 5; i++) {
        confettiParticles.push(
          new ConfettiParticle(
            Math.random() * window.innerWidth,
            -20
          )
        );
      }
    }
  }, 100);

  // Side bursts
  setInterval(() => {
    if (isCelebrating) {
      // Left side
      for (let i = 0; i < 3; i++) {
        const particle = new ConfettiParticle(0, Math.random() * window.innerHeight);
        particle.speedX = Math.random() * 10 + 5;
        confettiParticles.push(particle);
      }
      // Right side
      for (let i = 0; i < 3; i++) {
        const particle = new ConfettiParticle(window.innerWidth, Math.random() * window.innerHeight);
        particle.speedX = -(Math.random() * 10 + 5);
        confettiParticles.push(particle);
      }
    }
  }, 200);
}

function animate2DConfetti() {
  if (!isCelebrating) {
    cancelAnimationFrame(confettiAnimationId);
    return;
  }

  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  // Update and draw all particles
  confettiParticles = confettiParticles.filter(particle => {
    particle.update();
    particle.draw(confettiCtx);
    return !particle.isDead();
  });

  confettiAnimationId = requestAnimationFrame(animate2DConfetti);
}

function resetGame() {
  console.log('🔄 Resetting game...');

  isCelebrating = false;
  balloonsPopped = 0;
  balloonCounterEl.textContent = `🎈 0/${BALLOONS_TO_WIN}`;

  // Hide celebration overlay
  celebrationEl.classList.remove('active');

  // Stop confetti animation
  if (confettiAnimationId) {
    cancelAnimationFrame(confettiAnimationId);
    confettiAnimationId = null;
  }
  confettiParticles = [];
  confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

  // Clear all balloons and arrows
  balloons.forEach(balloon => balloon.destroy());
  balloons = [];
  activeArrows.forEach(arrow => arrow.destroy());
  activeArrows = [];

  // Reset streak and power-ups
  currentStreak = 0;
  arrowCount = 0;
  currentPowerUp = null;
  powerUpIndicatorEl.classList.remove('active');

  // Stop victory music and resume background music
  stopVictoryMusic();
  if (!isMuted && audioContext) {
    startBackgroundMusic();
  }

  console.log('✅ Game reset! Ready to play again!');
}

// ============================================
// INPUT HANDLING (KEYBOARD - ANY KEY!)
// ============================================
function handleKeyPress(event) {
  // ESC key to reset game during celebration
  if (event.key === 'Escape' && isCelebrating) {
    resetGame();
    return;
  }

  // Don't allow shooting during celebration or before game starts
  if (isCelebrating || !gameStarted) return;

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

  // Don't spawn or update during celebration or before game starts
  if (!isCelebrating && gameStarted) {
    // Spawn new balloon based on timer
    if (currentTime - lastSpawnTime > CONFIG.SPAWN_INTERVAL) {
      spawnBalloon();
      lastSpawnTime = currentTime;
    }

    // Update all active balloons and remove ones that return true
    balloons = balloons.filter((balloon) => !balloon.update(deltaTime));

    // Update all active arrows
    activeArrows = activeArrows.filter((arrow) => !arrow.update());
  }

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
  console.log("🚀 Initializing Little Archer Balloon Hunt...");

  // Setup Three.js scene
  initScene();

  // Setup audio system
  initAudio();

  // Event listeners
  window.addEventListener("keydown", handleKeyPress);
  window.addEventListener("resize", onWindowResize);

  // Start spawn timer
  lastSpawnTime = performance.now();

  // Start animation loop
  animate();

  // Show countdown on first load
  if (!countdownShown) {
    startCountdown();
  } else {
    gameStarted = true;
    setTimeout(() => spawnBalloon(), 500);
  }

  console.log("✅ Game ready!");
}

// ============================================
// COUNTDOWN SYSTEM
// ============================================
function startCountdown() {
  let count = 3;
  gameStarted = false;

  function showNumber() {
    if (count === 0) {
      countdownEl.textContent = 'GO!';
      countdownEl.classList.add('active');
      playCountdownSound('go');

      setTimeout(() => {
        countdownEl.classList.remove('active');
        gameStarted = true;
        countdownShown = true;
        // Spawn first balloon
        setTimeout(() => spawnBalloon(), 500);
      }, 1000);
    } else {
      countdownEl.textContent = count;
      countdownEl.classList.add('active');
      playCountdownSound('tick');

      setTimeout(() => {
        countdownEl.classList.remove('active');
        count--;
        setTimeout(showNumber, 300);
      }, 800);
    }
  }

  setTimeout(showNumber, 500);
}

// ============================================
// SPARKLE BURST ON HIT
// ============================================
function createSparkleBurst(position) {
  const sparkleCount = 15;
  for (let i = 0; i < sparkleCount; i++) {
    const geometry = new THREE.SphereGeometry(0.1, 8, 8);
    const material = new THREE.MeshBasicMaterial({
      color: Math.random() > 0.5 ? 0xffff00 : 0xffffff,
    });
    const sparkle = new THREE.Mesh(geometry, material);

    sparkle.position.copy(position);
    const angle = (i / sparkleCount) * Math.PI * 2;
    const speed = 0.1 + Math.random() * 0.1;
    sparkle.userData = {
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1.0,
    };

    scene.add(sparkle);

    // Animate sparkle
    const startTime = performance.now();
    function animateSparkle() {
      const elapsed = performance.now() - startTime;
      if (elapsed > 500 || !sparkle.parent) return;

      sparkle.position.x += sparkle.userData.vx;
      sparkle.position.y += sparkle.userData.vy;
      sparkle.userData.life -= 0.02;
      sparkle.material.opacity = sparkle.userData.life;
      sparkle.material.transparent = true;

      if (sparkle.userData.life > 0) {
        requestAnimationFrame(animateSparkle);
      } else {
        scene.remove(sparkle);
        sparkle.geometry.dispose();
        sparkle.material.dispose();
      }
    }
    animateSparkle();
  }
}

// ============================================
// STREAK SYSTEM
// ============================================
function checkStreak() {
  if (currentStreak === 3) {
    playStreakSound(3);
  } else if (currentStreak === 5) {
    playStreakSound(5);
  } else if (currentStreak === 7) {
    playStreakSound(7);
  }
}

function resetStreak() {
  currentStreak = 0;
}

// ============================================
// ARCHER VICTORY DANCE
// ============================================
function doArcherDance() {
  if (!archer || isArcherDancing) return;

  isArcherDancing = true;
  const bounces = 3;
  const duration = 300;

  let bounceCount = 0;
  function bounce() {
    if (bounceCount >= bounces) {
      archer.position.y = archerOriginalY; // Always return to original position
      isArcherDancing = false;
      return;
    }

    const startTime = performance.now();
    function animateBounce() {
      const elapsed = performance.now() - startTime;
      if (elapsed > duration) {
        bounceCount++;
        bounce();
        return;
      }

      const progress = elapsed / duration;
      const bounceHeight = Math.sin(progress * Math.PI) * 0.3;
      archer.position.y = archerOriginalY + bounceHeight;

      requestAnimationFrame(animateBounce);
    }
    animateBounce();
  }
  bounce();
}

// ============================================
// START GAME WHEN PAGE LOADS
// ============================================
window.addEventListener("load", init);
