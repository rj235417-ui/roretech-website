let audioCtx = null, mainEngine = null, subEngine = null, gainNode = null, modulator = null;
let isMuted = true, currentSkin = 'lambo', angle = 0, velocity = 0, lastY = 0;

const config = {
    lambo:   { base: 45, harmonic: 'sawtooth', rumble: 'triangle', pulse: 0,  img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800' },
    mustang: { base: 35, harmonic: 'square',   rumble: 'sawtooth', pulse: 12, img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800' },
    harley:  { base: 22, harmonic: 'sawtooth', rumble: 'square',   pulse: 35, img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800' },
    jet:     { base: 85, harmonic: 'sine',     rumble: 'sine',     pulse: 0,  img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800' }
};

function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function handlePowerClick() {
    initAudio();
    isMuted = !isMuted;
    const btn = document.getElementById('power-toggle');
    if (!isMuted) {
        audioCtx.resume();
        startEngine();
        btn.innerText = "🔊";
    } else {
        stopEngine();
        btn.innerText = "🔇";
    }
}

function startEngine() {
    if (mainEngine) return;
    mainEngine  = audioCtx.createOscillator();
    subEngine   = audioCtx.createOscillator();
    modulator   = audioCtx.createOscillator();
    let modGain = audioCtx.createGain();
    gainNode    = audioCtx.createGain();

    mainEngine.type = config[currentSkin].harmonic;
    subEngine.type  = config[currentSkin].rumble;
    modulator.type  = 'sine';

    modulator.connect(modGain);
    modGain.gain.value = 0.5;
    modGain.connect(gainNode.gain);
    mainEngine.connect(gainNode);
    subEngine.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    mainEngine.start();
    subEngine.start();
    modulator.start();
}

function stopEngine() {
    if (mainEngine) {
        try {
            mainEngine.stop();
            subEngine.stop();
            modulator.stop();
        } catch(e) {}
        mainEngine = null;
        subEngine  = null;
        modulator  = null;
        gainNode   = null;
    }
    if (audioCtx) audioCtx.suspend();
}

// ✅ FIXED: all reset logic is now inside the function block
function hardStop() {
    velocity = 0;
    angle = 0;
    stopEngine();
    isMuted = true;
    document.getElementById('power-toggle').innerText = "🔇";
    document.getElementById('spinner').style.transform = `rotate(0deg)`;
    document.getElementById('spinner').style.filter = `blur(0px)`;
    document.getElementById('spinner').style.setProperty('--glint', 0);
    document.getElementById('needle').style.transform = `rotate(-90deg)`;
    document.getElementById('stats').innerText = '0';
    document.getElementById('stats').classList.remove('overheat');
    document.getElementById('header-bar').style.transform = `translate(0,0)`;
    document.getElementById('menu').style.transform = `translate(0,0)`;
}

function setSkin(skin) {
    currentSkin = skin;
    document.getElementById('spinner').style.backgroundImage = `url('${config[skin].img}')`;
    if (mainEngine) {
        mainEngine.type = config[skin].harmonic;
        subEngine.type  = config[skin].rumble;
    }
}

function loadPhoto(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('spinner').style.backgroundImage = `url('${e.target.result}')`;
        };
        reader.readAsDataURL(file);
    }
}

window.addEventListener('touchstart', (e) => {
    lastY = e.touches[0].clientY;
    if (audioCtx && !isMuted) audioCtx.resume();
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const delta = currentY - lastY;
    if (Math.abs(delta) < 2) {
        velocity *= 0.95;
    } else {
        velocity += delta * 0.8;
    }
    lastY = currentY;
}, { passive: false });

function animate() {
    velocity *= 0.997;
    angle += velocity;
    const rpm = Math.abs(velocity * 18);
    const spinner = document.getElementById('spinner');

    spinner.style.transform = `rotate(${angle}deg)`;
    spinner.style.filter = `blur(${Math.min(rpm / 9000, 15)}px)`;
    spinner.style.setProperty('--glint', Math.min(rpm / 150000, 0.8));

    const needleRot = Math.min((rpm / 200000) * 180 - 90, 105);
    document.getElementById('needle').style.transform = `rotate(${needleRot}deg)`;

    if (rpm > 100000) {
        const shake = (rpm - 100000) / 10000;
        document.getElementById('header-bar').style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
        document.getElementById('menu').style.transform = `translate(${(Math.random()-0.5)*shake}px, ${(Math.random()-0.5)*shake}px)`;
    } else {
        document.getElementById('header-bar').style.transform = `translate(0,0)`;
        document.getElementById('menu').style.transform = `translate(0,0)`;
    }

    if (mainEngine && gainNode && !isMuted) {
        const speed = Math.abs(velocity);
        mainEngine.frequency.setTargetAtTime(Math.min((speed * 6) + config[currentSkin].base, 1100), audioCtx.currentTime, 0.05);
        subEngine.frequency.setTargetAtTime((speed * 1.8) + (config[currentSkin].base / 2), audioCtx.currentTime, 0.05);
        gainNode.gain.setTargetAtTime(Math.min(speed / 35, 0.6), audioCtx.currentTime, 0.1);
    }

    const statsEl = document.getElementById('stats');
    statsEl.innerText = Math.round(rpm).toLocaleString();
    if (rpm > 120000) statsEl.classList.add('overheat');
    else statsEl.classList.remove('overheat');

    requestAnimationFrame(animate);
}

setSkin('lambo');
animate();