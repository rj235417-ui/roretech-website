// ─── TIER & SKIN STATE ───────────────────────────────────────────────────────
let vibeTier   = localStorage.getItem('vibeTier')   || 'free';
let ownedSkins = JSON.parse(localStorage.getItem('ownedSkins') || '[]');

const PRO_SKINS = ['lambo', 'mustang', 'harley', 'jet'];

// ─── AUDIO & PHYSICS STATE ───────────────────────────────────────────────────
let audioCtx = null, mainEngine = null, subEngine = null, gainNode = null, modulator = null;
let isMuted = true, currentSkin = 'lambo', angle = 0, velocity = 0, lastY = 0;
let wasShaking   = false;
let lastNeedleRot = null;

// ─── SKIN CONFIG ─────────────────────────────────────────────────────────────
const config = {
    lambo:   { base: 45, harmonic: 'sawtooth', rumble: 'triangle', img: 'https://images.unsplash.com/photo-1511919884226-fd3cad34687c?auto=format&fit=crop&q=80&w=800' },
    mustang: { base: 35, harmonic: 'square',   rumble: 'sawtooth', img: 'https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&q=80&w=800' },
    harley:  { base: 22, harmonic: 'sawtooth', rumble: 'square',   img: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?auto=format&fit=crop&q=80&w=800' },
    jet:     { base: 85, harmonic: 'sine',     rumble: 'sine',     img: 'https://images.unsplash.com/photo-1540962351504-03099e0a754b?auto=format&fit=crop&q=80&w=800' }
};

// ─── TIER HELPERS ────────────────────────────────────────────────────────────
function getRpmCap() {
    if (vibeTier === 'free') return 50000;
    if (vibeTier === 'pro')  return 150000;
    return Infinity;
}

function getOverheatThreshold() { return vibeTier === 'free' ? Infinity : 125000; }

function isSkinAccessible(skin) {
    if (vibeTier === 'free') return skin === 'lambo';
    return true;
}

function isPhotoEnabled() { return vibeTier !== 'free'; }

// ─── AUDIO ───────────────────────────────────────────────────────────────────
function initAudio() {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function handlePowerClick() {
    initAudio();
    isMuted = !isMuted;
    const btn = document.getElementById('power-toggle');
    if (!isMuted) { audioCtx.resume(); startEngine(); btn.innerText = '\uD83D\uDD0A'; }
    else          { stopEngine();                      btn.innerText = '\uD83D\uDD07'; }
}

function startEngine() {
    if (mainEngine) return;
    mainEngine = audioCtx.createOscillator();
    subEngine  = audioCtx.createOscillator();
    modulator  = audioCtx.createOscillator();
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
        try { mainEngine.stop(); subEngine.stop(); modulator.stop(); } catch(e) {}
        mainEngine = null; subEngine = null; modulator = null; gainNode = null;
    }
    if (audioCtx) audioCtx.suspend();
}

function hardStop() {
    velocity = 0;
    angle    = 0;
    lastNeedleRot = null;
    stopEngine();
    isMuted = true;
    document.getElementById('power-toggle').innerText                = '\uD83D\uDD07';
    document.getElementById('spinner').style.transform               = 'rotate(0deg)';
    document.getElementById('spinner').style.filter                  = 'blur(0px)';
    document.getElementById('spinner').style.setProperty('--glint', 0);
    document.getElementById('needle').style.transform                = 'rotate(-90deg)';
    document.getElementById('stats').innerText                       = '0';
    document.getElementById('stats').classList.remove('overheat');
    document.getElementById('header-bar').style.transform            = 'translate(0,0)';
    document.getElementById('menu').style.transform                  = 'translate(0,0)';
}

// ─── SKINS ───────────────────────────────────────────────────────────────────
function handleSkinClick(skin) {
    if (!isSkinAccessible(skin)) {
        showUpgradeModal();
        return;
    }
    setSkin(skin);
}

function setSkin(skin) {
    currentSkin = skin;
    document.getElementById('spinner').style.backgroundImage = `url('${config[skin].img}')`;
    if (mainEngine) { mainEngine.type = config[skin].harmonic; subEngine.type = config[skin].rumble; }
}

function handlePhotoClick() {
    if (!isPhotoEnabled()) { showUpgradeModal(); return; }
    document.getElementById('photo-input').click();
}

function loadPhoto(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => { document.getElementById('spinner').style.backgroundImage = `url('${e.target.result}')`; };
    reader.readAsDataURL(file);
}

// ─── MODALS ──────────────────────────────────────────────────────────────────
function showUpgradeModal() {
    document.getElementById('modal-icon').textContent  = '\uD83D\uDD12';
    document.getElementById('modal-title').textContent = 'Unlock Vibe Pro';
    document.getElementById('modal-price').textContent = 'One-time $1.99';
    document.getElementById('modal-desc').textContent  = 'All skins + 150,000 RPM + overheat FX + photo upload.';
    document.getElementById('modal-btn').href          = 'https://buy.stripe.com/placeholder';
    document.getElementById('modal-btn').textContent   = 'Unlock Pro \u2014 $1.99';
    document.getElementById('paywall-modal').style.display = 'flex';
}

function showPaywall() { showUpgradeModal(); }

function closePaywall(e) {
    if (!e || e.target === document.getElementById('paywall-modal')) {
        document.getElementById('paywall-modal').style.display = 'none';
    }
}

function showMaxModal() {
    document.getElementById('max-modal').style.display = 'flex';
}

function closeMaxModal(e) {
    if (!e || e.target === document.getElementById('max-modal')) {
        document.getElementById('max-modal').style.display = 'none';
    }
}

// ─── UPGRADE BANNER ──────────────────────────────────────────────────────────
let bannerTimeout         = null;
let bannerShownThisRound  = false;

function showUpgradeBanner() {
    const banner = document.getElementById('upgrade-banner');
    banner.classList.add('visible');
    if (bannerTimeout) clearTimeout(bannerTimeout);
    bannerTimeout = setTimeout(() => banner.classList.remove('visible'), 4000);
}

// ─── DEV MODE ────────────────────────────────────────────────────────────────
function devCycleTier() {
    const tiers = ['free', 'pro', 'max'];
    vibeTier = tiers[(tiers.indexOf(vibeTier) + 1) % 3];
    localStorage.setItem('vibeTier', vibeTier);
    if (!isSkinAccessible(currentSkin)) setSkin('lambo');
    updateSkinUI();
}

// ─── SKIN UI UPDATE ───────────────────────────────────────────────────────────
function updateSkinUI() {
    document.querySelectorAll('[data-skin]').forEach(el => {
        const ok    = isSkinAccessible(el.dataset.skin);
        const badge = el.querySelector('.lock-badge');
        el.classList.toggle('locked', !ok);
        if (badge) badge.style.display = ok ? 'none' : '';
    });

    const photoBtn   = document.getElementById('photo-btn');
    const photoBadge = photoBtn ? photoBtn.querySelector('.lock-badge') : null;
    const photoOk    = isPhotoEnabled();
    if (photoBtn)   photoBtn.classList.toggle('locked', !photoOk);
    if (photoBadge) photoBadge.style.display = photoOk ? 'none' : '';

    const tierBadge = document.getElementById('tier-badge');
    const devDisp   = document.getElementById('dev-tier-display');
    if (tierBadge) tierBadge.textContent = vibeTier.toUpperCase();
    if (devDisp)   devDisp.textContent   = vibeTier.toUpperCase();
}

// ─── TOUCH INPUT ─────────────────────────────────────────────────────────────
window.addEventListener('touchstart', (e) => {
    lastY = e.touches[0].clientY;
    if (audioCtx && !isMuted) audioCtx.resume();
}, { passive: false });

window.addEventListener('touchmove', (e) => {
    const currentY = e.touches[0].clientY;
    const delta    = currentY - lastY;
    if (Math.abs(delta) < 2) velocity *= 0.95;
    else                     velocity += delta * 0.8;
    lastY = currentY;
}, { passive: false });

// ─── ANIMATION LOOP ───────────────────────────────────────────────────────────
function animate() {
    velocity *= 0.997;

    // Clamp to RPM cap
    const velCap = getRpmCap() / 18;
    if (Math.abs(velocity) > velCap) velocity = Math.sign(velocity) * velCap;

    angle += velocity;
    const rpm     = Math.abs(velocity * 18);
    const spinner = document.getElementById('spinner');

    spinner.style.transform = `rotate(${angle}deg)`;
    spinner.style.filter    = `blur(${Math.min(rpm / 9000, 15)}px)`;
    spinner.style.setProperty('--glint', Math.min(rpm / 150000, 0.8));

    const needleRot = Math.round(Math.min((rpm / 200000) * 180 - 90, 105) * 10) / 10;
    if (needleRot !== lastNeedleRot) {
        document.getElementById('needle').style.transform = `rotate(${needleRot}deg)`;
        lastNeedleRot = needleRot;
    }

    const shouldShake = (vibeTier === 'pro' || vibeTier === 'max') && rpm > 125000;
    if (shouldShake) {
        wasShaking = true;
        const shake = (rpm - 125000) / 10000;
        document.getElementById('header-bar').style.transform =
            `translate(${(Math.random()-0.5)*shake}px,${(Math.random()-0.5)*shake}px)`;
        document.getElementById('menu').style.transform =
            `translate(${(Math.random()-0.5)*shake}px,${(Math.random()-0.5)*shake}px)`;
    } else if (wasShaking) {
        wasShaking = false;
        document.getElementById('header-bar').style.transform = '';
        document.getElementById('menu').style.transform = '';
    }

    if (mainEngine && gainNode && !isMuted) {
        const speed = Math.abs(velocity);
        mainEngine.frequency.setTargetAtTime(Math.min((speed * 6) + config[currentSkin].base, 1100), audioCtx.currentTime, 0.05);
        subEngine.frequency.setTargetAtTime((speed * 1.8) + (config[currentSkin].base / 2), audioCtx.currentTime, 0.05);
        gainNode.gain.setTargetAtTime(Math.min(speed / 35, 0.6), audioCtx.currentTime, 0.1);
    }

    const statsEl = document.getElementById('stats');
    const rpmDisplay = Math.round(rpm).toLocaleString();
    if (statsEl.innerText !== rpmDisplay) statsEl.innerText = rpmDisplay;
    if (rpm > getOverheatThreshold()) statsEl.classList.add('overheat');
    else                              statsEl.classList.remove('overheat');

    // Free-tier upgrade banner at 50K
    if (vibeTier === 'free' && rpm >= 49000 && !bannerShownThisRound) {
        bannerShownThisRound = true;
        showUpgradeBanner();
    }
    if (rpm < 45000) bannerShownThisRound = false;

    requestAnimationFrame(animate);
}

// ─── APP LIFECYCLE ────────────────────────────────────────────────────────────
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        velocity   = 0;
        wasShaking = false;
        document.getElementById('header-bar').style.transform = '';
        document.getElementById('menu').style.transform       = '';
        if (!isMuted) {
            stopEngine();
            isMuted = true;
            document.getElementById('power-toggle').innerText = '\uD83D\uDD07';
        }
    }
});

// ─── INIT ─────────────────────────────────────────────────────────────────────
setSkin('lambo');
updateSkinUI();
animate();
