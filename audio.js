// ============================================
// WEB AUDIO API - SOUND SYSTEM
// ============================================

let audioContext;
let isMuted = false;

function initAudio() {
    // Create AudioContext on first user interaction (browser policy)
    document.addEventListener('keydown', () => {
        if (!audioContext) {
            audioContext = new (window.AudioContext || window.webkitAudioContext)();
            console.log('🔊 Audio initialized!');
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
// MUTE TOGGLE
// ============================================
const muteBtn = document.getElementById('muteBtn');
muteBtn.addEventListener('click', () => {
    isMuted = !isMuted;
    muteBtn.textContent = isMuted ? '🔇' : '🔊';
    console.log(isMuted ? '🔇 Muted' : '🔊 Unmuted');
});
