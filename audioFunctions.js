//let music = new Audio('Test_Music.mp3');
//music.play();
//music.loop = true;

/*let audioCtx = new (window.AudioContext || window.webkitAudioContext)();
let gunBuffer = null;

// Preload sound
fetch('nailGun.m4a')
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => audioCtx.decodeAudioData(arrayBuffer))
  .then(audioBuffer => {
    gunBuffer = audioBuffer;
  });

// Play sound
function playGunSound() {
    if (!gunBuffer) return;
    const source = audioCtx.createBufferSource();
    source.buffer = gunBuffer;
    source.connect(audioCtx.destination);
    source.start(0);
}*/
class AudioManager { //written entirely by Chatgpt
    constructor() {
        this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        this.buffers = {}; // Map of name → AudioBuffer
    }

    async loadSound(name, url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        const audioBuffer = await this.audioCtx.decodeAudioData(arrayBuffer);
        this.buffers[name] = audioBuffer;
    }

    play(name, { loop = false, volume = 1.0 } = {}) {
        const buffer = this.buffers[name];
        if (!buffer) {
            console.warn(`Sound "${name}" not loaded`);
            return;
        }
    
        const source = this.audioCtx.createBufferSource();
        source.buffer = buffer;
        source.loop = loop;
    
        // Create a gain node for volume control
        const gainNode = this.audioCtx.createGain();
        gainNode.gain.value = volume; // Range: 0.0 (silent) to 1.0 (full volume)
    
        // Connect source → gain → speakers
        source.connect(gainNode);
        gainNode.connect(this.audioCtx.destination);
    
        source.start(0);
    
        // Return both source and gainNode so caller can stop or fade
        return { source, gainNode };
    }

    async loadAll(sounds) {
        // sounds = { name: url, ... }
        const promises = [];
        for (const [name, url] of Object.entries(sounds)) {
            promises.push(this.loadSound(name, url));
        }
        await Promise.all(promises);
    }
}
//the actual audio manager is created in the main script(this includes the src of all the sounds)