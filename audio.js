const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
const soundBuffers = {};
let isMuted = false;

async function loadSound(id, url) {
    try {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await audioCtx.decodeAudioData(arrayBuffer);
        soundBuffers[id] = audioBuffer;
    } catch (e) {
        console.error("Failed to load sound:", url, e);
    }
}

const seToPreload = [
    { id: 'correct-sound', url: 'sounds/correct.mp3' },
    { id: 'wrong-sound', url: 'sounds/wrong.mp3' },
    { id: 'base-damage-sound', url: 'sounds/base-damage.mp3' },
    { id: 'buy-sound', url: 'sounds/buy.mp3' },
    { id: 'gameover-low-sound', url: 'sounds/gameover-low.mp3' },
    { id: 'gameover-mid-sound', url: 'sounds/gameover-mid.mp3' },
    { id: 'gameover-high-sound', url: 'sounds/gameover-high.mp3' },
    { id: 'click-sound', url: 'sounds/click.mp3' },
    { id: 'sweep-sound', url: 'sounds/sweep.mp3' },
    { id: 'place-sound', url: 'sounds/place.mp3' },
    { id: 'game-clear-sound', url: 'sounds/clear.mp3' },
    { id: 'wave-start-sound', url: 'sounds/wave-start.mp3' },
    { id: 'wave-clear-sound', url: 'sounds/wave-clear.mp3' }
];

seToPreload.forEach(se => loadSound(se.id, se.url));

function unlockAudio() {
    if (audioCtx.state === 'suspended') {
        audioCtx.resume();
    }
}

function playSound(sound) {
    if (isMuted || !sound) return;

    if (soundBuffers[sound.id]) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const source = audioCtx.createBufferSource();
        source.buffer = soundBuffers[sound.id];
        source.connect(audioCtx.destination);
        source.start(0);
        return;
    }

    sound.currentTime = 0;
    sound.play().catch(e => console.error("Audio play failed:", e));
}