const music = document.getElementById('bg-music');
const musicBtn = document.getElementById('music-control');
const openBookBtn = document.getElementById('open-book-btn');
const bookModal = document.getElementById('bookModal');
const closeBookBtn = document.getElementById('closeBookBtn');
const prevPageBtn = document.getElementById('prev-page');
const nextPageBtn = document.getElementById('next-page');
const pageLeft = document.getElementById('pageLeft');
const pageRight = document.getElementById('pageRight');
const pageSong = document.getElementById('pagina-song');
const doradoSong = document.getElementById('dorado-song');

let currentIndex = 0;
let goldenChanceTriggered = false;
let goldEffectInterval = null;

const bookImages = [];
for (let i = 1; i <= 36; i++) {
    bookImages.push(`Imagenes/img${i}.jpeg`);
}

window.addEventListener('DOMContentLoaded', () => {
    if (Math.random() < 0.07) document.getElementById('first-zigzag').src = "Imagenes/Secret.jpeg";
    if (Math.random() < 0.05) document.getElementById('main-title').innerText = "Cupón para un Pingüino";
    generateBackgroundHearts();
});

music.volume = 0.5;
function playMusic() { music.play().then(() => musicBtn.innerHTML = '⏸️').catch(() => {}); }
musicBtn.addEventListener('click', () => { if (music.paused) playMusic(); else { music.pause(); musicBtn.innerHTML = '🎵'; } });
document.addEventListener('click', playMusic, { once: true });

function spawnGoldParticles() {
    const btn = document.getElementById('next-page');
    const rect = btn.getBoundingClientRect();
    for(let i = 0; i < 5; i++) {
        const p = document.createElement('div');
        p.className = 'gold-particle';
        p.style.left = (rect.left + rect.width / 2) + 'px';
        p.style.top = (rect.top + rect.height / 2) + 'px';
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        p.style.setProperty('--x', Math.cos(angle) * velocity + 'px');
        p.style.setProperty('--y', Math.sin(angle) * velocity + 'px');
        document.body.appendChild(p);
        setTimeout(() => p.remove(), 1500);
    }
}

function updatePages(triggerSound = true) {
    if (triggerSound) {
        pageSong.currentTime = 0;
        pageSong.play().catch(() => {});
    }

    pageLeft.classList.add('page-turn');
    pageRight.classList.add('page-turn');

    setTimeout(() => {
        const isSecret = currentIndex >= 34;
        const glowClass = isSecret ? 'class="secret-glow"' : '';

        pageLeft.innerHTML = `
            <img src="${bookImages[currentIndex]}" ${glowClass}>
            <div class="page-number">${currentIndex + 1}</div>
        `;
        
        if (bookImages[currentIndex + 1]) {
            pageRight.innerHTML = `
                <img src="${bookImages[currentIndex + 1]}" ${glowClass}>
                <div class="page-number">${currentIndex + 2}</div>
            `;
            pageRight.style.visibility = 'visible';
        } else {
            pageRight.innerHTML = "";
            pageRight.style.visibility = 'hidden';
        }
        
        pageLeft.classList.remove('page-turn');
        pageRight.classList.remove('page-turn');
    }, 300);

    prevPageBtn.disabled = currentIndex === 0;
    
    if (currentIndex === 32) {
        if (!goldenChanceTriggered) {
            if (Math.random() < 0.03) {
                goldenChanceTriggered = true;
                doradoSong.play().catch(() => {});
                if (!goldEffectInterval) goldEffectInterval = setInterval(spawnGoldParticles, 200);
            }
        }
        if (goldenChanceTriggered) {
            nextPageBtn.classList.add('golden-btn');
            nextPageBtn.disabled = false;
        } else {
            nextPageBtn.disabled = true;
        }
    } else {
        nextPageBtn.classList.remove('golden-btn');
        nextPageBtn.disabled = currentIndex + 2 >= 34 && !goldenChanceTriggered;
        if (goldEffectInterval && currentIndex !== 32) {
            clearInterval(goldEffectInterval);
            goldEffectInterval = null;
        }
        if (currentIndex >= 34) nextPageBtn.disabled = true;
    }
}

openBookBtn.addEventListener('click', () => { bookModal.classList.add('show'); updatePages(true); });
closeBookBtn.addEventListener('click', () => { bookModal.classList.remove('show'); });
nextPageBtn.addEventListener('click', () => { if (currentIndex + 2 < bookImages.length) { currentIndex += 2; updatePages(true); } });
prevPageBtn.addEventListener('click', () => { if (currentIndex > 0) { currentIndex -= 2; updatePages(true); } });

document.addEventListener('keydown', (e) => {
    if (bookModal.classList.contains('show')) {
        if (e.key === "ArrowRight" && !nextPageBtn.disabled) nextPageBtn.click();
        if (e.key === "ArrowLeft" && !prevPageBtn.disabled) prevPageBtn.click();
        if (e.key === "Escape") closeBookBtn.click();
    }
});

function generateBackgroundHearts() {
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'bg-heart-static';
        heart.innerHTML = '❤';
        heart.style.left = Math.random() * 95 + 'vw';
        heart.style.top = Math.random() * 95 + '%';
        heart.style.fontSize = (Math.random() * 20 + 10) + 'px';
        document.body.appendChild(heart);
    }
}

setInterval(() => {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.innerHTML = '♥';
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.setProperty('--random', Math.random());
    document.body.appendChild(heart);
    setTimeout(() => heart.remove(), 5000);
}, 500);