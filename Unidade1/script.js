let audioContext;
let audioBuffer;
let sourceNode;
let gainNode;
let distortionNode;
let effectGain;
let directGain;

let isPlaying = false;
let startTime = 0;
let pauseTime = 0;
let currentPause = 0;
let playbackTime = 0;

document.addEventListener('DOMContentLoaded', init);

function init() {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    
    gainNode = audioContext.createGain();
    distortionNode = audioContext.createWaveShaper();
    effectGain = audioContext.createGain();
    directGain = audioContext.createGain();
    
    distortionNode.curve = makeDistortionCurve(400);
    distortionNode.oversample = '4x';

    gainNode.connect(distortionNode);
    distortionNode.connect(effectGain);
    effectGain.connect(audioContext.destination);

    gainNode.connect(directGain);
    directGain.connect(audioContext.destination);

    effectGain.gain.value = 0;
    directGain.gain.value = 1;

    loadAudio();
    
    document.getElementById('playBtn').addEventListener('click', play);
    document.getElementById('pauseBtn').addEventListener('click', pause);
    document.getElementById('stopBtn').addEventListener('click', stop);
    document.getElementById('volumeSlider').addEventListener('input', adjustVolume);
    document.getElementById('distortionCheckbox').addEventListener('change', toggleDistortion);
}

function loadAudio() {
    fetch('musica.mp3')
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(decodedAudio => {
            audioBuffer = decodedAudio;
        })
        .catch(error => console.error('Erro ao carregar áudio:', error));
}

function makeDistortionCurve(amount) {
    const samples = 44100;
    const curve = new Float32Array(samples);
    const deg = Math.PI / 180;
    
    for (let i = 0; i < samples; i++) {
        const x = (i * 2) / samples - 1;
        curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x));
    }
    return curve;
}

function pause() {
    if (!isPlaying) return;

    const elapsed = audioContext.currentTime - startTime;
    playbackTime += elapsed;

    sourceNode.stop();
    sourceNode.disconnect();
    isPlaying = false;
}

function play() {
    if (!audioBuffer) return;
    if (isPlaying) return;

    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    startPlayback(playbackTime);
}

function stop() {
    if (sourceNode) {
        sourceNode.stop();
        sourceNode.disconnect();
    }
    isPlaying = false;
    playbackTime = 0;
}

function startPlayback(offset = 0) {
    sourceNode = audioContext.createBufferSource();
    sourceNode.buffer = audioBuffer;
    sourceNode.connect(gainNode);
    
    startTime = audioContext.currentTime;
    sourceNode.start(0, offset);
    isPlaying = true;

    sourceNode.onended = () => {
        if (isPlaying) {
            isPlaying = false;
            playbackTime = 0;
        }
    };
}

function adjustVolume(e) {
    gainNode.gain.value = e.target.value / 100;
}

function toggleDistortion(e) {
    if (e.target.checked) {
        effectGain.gain.value = 1;
        directGain.gain.value = 0;
    } else {
        effectGain.gain.value = 0;
        directGain.gain.value = 1;
    }
}
