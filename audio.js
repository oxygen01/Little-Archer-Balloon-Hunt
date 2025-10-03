// ============================================
// WEB AUDIO API - SOUND SYSTEM
// ============================================

let audioContext;
let isMuted = false;
let backgroundMusic = null;
let victoryMusic = null;

function initAudio() {
    // Create background music audio element
    backgroundMusic = new Audio('bg-video-game-music.mp3');
    backgroundMusic.loop = true;
    backgroundMusic.volume = 0.2; // 20% volume

    // Create victory music audio element
    victoryMusic = new Audio('happy-birthday.mp3');
    victoryMusic.loop = false;
    victoryMusic.volume = 0.5; // 50% volume for celebration

    // Create AudioContext on first user interaction (browser policy)
    document.addEventListener('keydown', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Audio initialized!');
            startBackgroundMusic();
        }
    }, { once: true });
}

// ============================================
// POP SOUND (Synthesized - Happy & Varied)
// ============================================
function playPopSound() {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Random pitch for variety (between 400-900 Hz for happy "pop")
    oscillator.frequency.value = 400 + Math.random() * 500;
    oscillator.type = 'sine';

    // Quick "pop" envelope (attack-decay)
    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.3, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
}

// ============================================
// SHOOT SOUND (Arrow whoosh)
// ============================================
function playShootSound() {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Swoosh sound - descending pitch
    oscillator.type = 'sawtooth';
    const now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(800, now);
    oscillator.frequency.exponentialRampToValueAtTime(200, now + 0.15);

    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.15);

    oscillator.start(now);
    oscillator.stop(now + 0.15);
}

// ============================================
// OPTIONAL: SPEAK LETTER (Web Speech API)
// ============================================
function speakLetter(letter) {
    if (isMuted || !window.speechSynthesis) return;

    const utterance = new SpeechSynthesisUtterance(letter);
    utterance.rate = 1.0;
    utterance.pitch = 1.3; // Higher pitch (child-friendly)
    utterance.volume = 0.7;

    window.speechSynthesis.speak(utterance);
}

// ============================================
// BACKGROUND MUSIC (MP3 file at 20% volume)
// ============================================
function startBackgroundMusic() {
    if (!backgroundMusic || isMuted) return;

    backgroundMusic.play().catch(err => {
        console.log('Background music autoplay blocked:', err);
    });

    console.log('🎵 Background music started!');
}

function stopBackgroundMusic() {
    if (backgroundMusic) {
        backgroundMusic.pause();
        backgroundMusic.currentTime = 0;
    }
}

// ============================================
// BALLOON LAUNCH SOUND (Boing!)
// ============================================
function playLaunchSound() {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Bouncy "boing" - ascending then descending pitch
    oscillator.type = 'sine';
    const now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(200, now);
    oscillator.frequency.exponentialRampToValueAtTime(400, now + 0.1);
    oscillator.frequency.exponentialRampToValueAtTime(150, now + 0.2);

    gainNode.gain.setValueAtTime(0.15, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);

    oscillator.start(now);
    oscillator.stop(now + 0.2);
}

// ============================================
// BALLOON ESCAPE SOUND (Happy chime)
// ============================================
function playEscapeSound() {
    if (isMuted || !audioContext) return;

    // Play two notes in harmony (major third)
    const frequencies = [659.25, 830.61]; // E5 and G#5
    const now = audioContext.currentTime;

    frequencies.forEach((freq, i) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        gainNode.gain.setValueAtTime(0.15, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        oscillator.start(now + i * 0.05); // Slight delay between notes
        oscillator.stop(now + 0.4);
    });
}

// ============================================
// ARROW MISS SOUND (Gentle whoosh)
// ============================================
function playMissSound() {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    // Subtle descending whoosh
    oscillator.type = 'sawtooth';
    const now = audioContext.currentTime;

    oscillator.frequency.setValueAtTime(300, now);
    oscillator.frequency.exponentialRampToValueAtTime(100, now + 0.12);

    gainNode.gain.setValueAtTime(0.08, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.12);

    oscillator.start(now);
    oscillator.stop(now + 0.12);
}

// ============================================
// COMBO HIT SOUND (Ascending celebration)
// ============================================
let comboCount = 0;
let comboTimeout = null;

function playComboSound() {
    if (isMuted || !audioContext) return;

    // Reset combo timer
    clearTimeout(comboTimeout);
    comboCount++;

    // Play ascending tone based on combo count (capped at 5)
    const baseFreq = 500;
    const pitch = baseFreq + (Math.min(comboCount, 5) * 100);

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.type = 'square';
    oscillator.frequency.value = pitch;

    const now = audioContext.currentTime;
    gainNode.gain.setValueAtTime(0.2, now);
    gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);

    oscillator.start(now);
    oscillator.stop(now + 0.1);

    // Reset combo after 2 seconds of no hits
    comboTimeout = setTimeout(() => {
        comboCount = 0;
    }, 2000);
}

// ============================================
// VICTORY MUSIC (Birthday Celebration)
// ============================================
function playVictoryMusic() {
    if (!victoryMusic || isMuted) return;

    // Stop background music
    if (backgroundMusic) {
        backgroundMusic.pause();
    }

    // Play victory music from beginning
    victoryMusic.currentTime = 0;
    victoryMusic.play().catch(err => {
        console.log('Victory music play error:', err);
    });

    console.log('🎉 Victory music playing!');
}

function stopVictoryMusic() {
    if (victoryMusic) {
        victoryMusic.pause();
        victoryMusic.currentTime = 0;
    }
}

// ============================================
// MUTE TOGGLE
// ============================================
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';

    // Control background music
    if (backgroundMusic) {
        if (isMuted) {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play().catch(err => console.log('Music play error:', err));
        }
    }

    // Control victory music
    if (victoryMusic && victoryMusic.currentTime > 0) {
        if (isMuted) {
            victoryMusic.pause();
        } else {
            victoryMusic.play().catch(err => console.log('Music play error:', err));
        }
    }

    console.log(isMuted ? '🔇 Muted' : '🔊 Unmuted');
});

// ============================================
// COUNTDOWN SOUNDS
// ============================================
function playCountdownSound(type) {
    if (isMuted || !audioContext) return;

    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    const now = audioContext.currentTime;

    if (type === 'tick') {
        // Higher pitched beep for 3, 2, 1
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        gainNode.gain.setValueAtTime(0.3, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        oscillator.start(now);
        oscillator.stop(now + 0.1);
    } else if (type === 'go') {
        // Lower triumphant sound for GO
        oscillator.frequency.value = 600;
        oscillator.type = 'triangle';
        gainNode.gain.setValueAtTime(0.4, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        oscillator.start(now);
        oscillator.stop(now + 0.3);
    }
}

// ============================================
// STREAK SOUNDS (Yay!)
// ============================================
function playStreakSound(streakNumber) {
    if (isMuted || !audioContext) return;

    // Play ascending celebratory tones
    const frequencies = {
        3: [523.25, 659.25, 783.99], // C, E, G (3 streak)
        5: [523.25, 659.25, 783.99, 1046.50], // C, E, G, C (5 streak)
        7: [523.25, 659.25, 783.99, 1046.50, 1318.51], // Full celebration (7 streak)
    };

    const notes = frequencies[streakNumber] || frequencies[3];
    const now = audioContext.currentTime;

    notes.forEach((freq, index) => {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.type = 'sine';
        oscillator.frequency.value = freq;

        const startTime = now + index * 0.1;
        gainNode.gain.setValueAtTime(0.2, startTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, startTime + 0.15);

        oscillator.start(startTime);
        oscillator.stop(startTime + 0.15);
    });

    console.log(`🎉 ${streakNumber} HIT STREAK!`);
}
