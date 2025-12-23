// ============================================
// MATRIX BACKGROUND EFFECT
// ============================================
const matrixCanvas = document.getElementById('matrix-canvas');
const matrixCtx = matrixCanvas.getContext('2d');
const matrixChars = 'DUOWQ';
const fontSize = 16;
let matrixDrops = [];

function resizeMatrixCanvas() {
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    matrixDrops = Array(Math.floor(matrixCanvas.width / fontSize)).fill(1);
}

function drawMatrix() {
    matrixCtx.fillStyle = 'rgba(0, 0, 0, 0.05)';
    matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
    
    matrixCtx.fillStyle = '#00FF41';
    matrixCtx.font = `${fontSize}px monospace`;
    
    matrixDrops.forEach((yPos, index) => {
        const randomChar = matrixChars[Math.floor(Math.random() * matrixChars.length)];
        const xPos = index * fontSize;
        
        matrixCtx.fillText(randomChar, xPos, yPos * fontSize);
        
        if (yPos * fontSize > matrixCanvas.height && Math.random() > 0.975) {
            matrixDrops[index] = 0;
        }
        
        matrixDrops[index]++;
    });
}

// ============================================
// CURSOR TRAIL EFFECT
// ============================================
const cursorCanvas = document.getElementById('cursor-canvas');
const cursorCtx = cursorCanvas.getContext('2d');
const cursorParticles = [];

function resizeCursorCanvas() {
    cursorCanvas.width = window.innerWidth;
    cursorCanvas.height = window.innerHeight;
}

function createCursorParticle(x, y) {
    if (Math.random() < 0.4) {
        cursorParticles.push({
            x: x,
            y: y,
            velocity: 2 + Math.random() * 2,
            life: 1,
            char: matrixChars[Math.floor(Math.random() * matrixChars.length)]
        });
    }
}

function drawCursorParticles() {
    cursorCtx.clearRect(0, 0, cursorCanvas.width, cursorCanvas.height);
    cursorCtx.font = 'bold 16px monospace';
    cursorCtx.shadowBlur = 8;
    cursorCtx.shadowColor = '#00FF41';
    
    for (let i = cursorParticles.length - 1; i >= 0; i--) {
        const particle = cursorParticles[i];
        
        cursorCtx.globalAlpha = particle.life;
        cursorCtx.fillStyle = '#00FF41';
        cursorCtx.fillText(particle.char, particle.x, particle.y);
        
        particle.y += particle.velocity;
        particle.life -= 0.03;
        
        if (particle.life <= 0) {
            cursorParticles.splice(i, 1);
        }
    }
    
    requestAnimationFrame(drawCursorParticles);
}

// ============================================
// AUDIO CONTROL
// ============================================
const backgroundMusic = document.getElementById('background-music');
const audioStatus = document.getElementById('audio-status');
const audioToggle = document.getElementById('audio-toggle');
let audioInitialized = false;

function initializeAudio() {
    if (audioInitialized) return;
    
    try {
        backgroundMusic.volume = 0.7;
        audioInitialized = true;
        document.body.setAttribute('data-audio-initialized', 'true');
    } catch (error) {
        console.log('Không thể khởi tạo audio:', error);
    }
}

function toggleMusic() {
    if (!audioInitialized) {
        initializeAudio();
    }
    
    if (backgroundMusic.paused) {
        backgroundMusic.play()
            .then(() => {
                audioStatus.textContent = 'ON';
                audioToggle.setAttribute('aria-label', 'Tắt nhạc nền');
            })
            .catch(error => {
                console.log('Lỗi khi phát nhạc:', error);
                audioStatus.textContent = 'ERR';
            });
    } else {
        backgroundMusic.pause();
        audioStatus.textContent = 'OFF';
        audioToggle.setAttribute('aria-label', 'Bật nhạc nền');
    }
}

// ============================================
// FPS COUNTER
// ============================================
let frameCount = 0;
let lastTime = performance.now();
const fpsValue = document.getElementById('fps-value');

function updateFPS(currentTime) {
    frameCount++;
    
    if (currentTime - lastTime > 1000) {
        fpsValue.textContent = frameCount;
        frameCount = 0;
        lastTime = currentTime;
    }
    
    requestAnimationFrame(updateFPS);
}

// ============================================
// TIKTOK FOLLOWER COUNTER (TÙY CHỌN)
// ============================================
// Gợi ý: Nếu muốn hiển thị số follower TikTok
// async function getTikTokFollowers() {
//     try {
//         // Sử dụng Countik API hoặc service tương tự
//         const response = await fetch('https://api.countik.com/v1/user/duowq.official');
//         const data = await response.json();
//         if (data.followers) {
//             const tiktokLink = document.querySelector('a[href*="tiktok"]');
//             tiktokLink.innerHTML = `<i class="fab fa-tiktok"></i> TikTok (${data.followers.toLocaleString()})`;
//         }
//     } catch (error) {
//         console.log('Không thể lấy số follower TikTok:', error);
//     }
// }

// ============================================
// EVENT LISTENERS & INITIALIZATION
// ============================================
resizeMatrixCanvas();
resizeCursorCanvas();

window.addEventListener('resize', () => {
    resizeMatrixCanvas();
    resizeCursorCanvas();
});

document.addEventListener('mousemove', (event) => {
    createCursorParticle(event.clientX, event.clientY);
});

document.body.addEventListener('click', initializeAudio);
document.body.addEventListener('touchstart', initializeAudio);

audioToggle.addEventListener('click', (event) => {
    event.stopPropagation();
    toggleMusic();
});

// Khởi tạo status text animation
const statusText = document.querySelector('.status-text');
const texts = [
    "> Hello Ní...",
    "> Ní cần gì...",
    "> Hãy Kết Nối Với Tôi...",
    "> Đừng Ngại!",
    "> Theo dõi TikTok @duongw85d1"
];

let textIndex = 0;
function changeStatusText() {
    statusText.style.animation = 'none';
    statusText.textContent = texts[textIndex];
    
    setTimeout(() => {
        statusText.style.animation = 'typing 3.5s steps(35, end), blink 0.7s infinite';
        statusText.style.width = '0';
        void statusText.offsetWidth;
        statusText.style.width = '100%';
    }, 10);
    
    textIndex = (textIndex + 1) % texts.length;
}

// Bắt đầu các animation
setInterval(drawMatrix, 90);
requestAnimationFrame(drawCursorParticles);
requestAnimationFrame(updateFPS);
setInterval(changeStatusText, 8000);

// Khởi tạo TikTok follower counter (nếu muốn)
// getTikTokFollowers();

// Console greeting
console.log('%c🎮 DUOWQ Portfolio đã sẵn sàng!', 'color: #00FF41; font-size: 16px; font-weight: bold;');
console.log('%c> Hiệu ứng Matrix: Đang chạy', 'color: #00FF41;');
console.log('%c> TikTok: @duowq.official', 'color: #00FF41;');
console.log('%c> Âm thanh: Sẵn sàng', 'color: #00FF41;');