// ===================== PARTICLES =====================
(function initParticles() {
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const PARTICLE_COUNT = 80;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    function createParticle() {
        return {
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            size: Math.random() * 2 + 0.5,
            speedX: (Math.random() - 0.5) * 0.4,
            speedY: (Math.random() - 0.5) * 0.4,
            opacity: Math.random() * 0.5 + 0.1,
            color: ['#10b981', '#34d399', '#06b6d4', '#8b5cf6'][Math.floor(Math.random() * 4)]
        };
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) {
        particles.push(createParticle());
    }

    function draw() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.speedX;
            p.y += p.speedY;
            if (p.x < 0) p.x = canvas.width;
            if (p.x > canvas.width) p.x = 0;
            if (p.y < 0) p.y = canvas.height;
            if (p.y > canvas.height) p.y = 0;

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.globalAlpha = p.opacity;
            ctx.fill();
        });

        // Draw connections
        ctx.globalAlpha = 1;
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(16, 185, 129, ${0.08 * (1 - dist / 120)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(draw);
    }
    draw();
})();

// ===================== TAB SWITCHING =====================
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

function switchTab(tabName) {
    tabBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.tab === tabName));
    tabContents.forEach(content => {
        const isActive = content.id === `tab-${tabName}`;
        content.classList.toggle('active', isActive);
    });
    // Re-trigger reveal animations for the new tab
    setTimeout(observeReveals, 50);
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
});

// ===================== COPY IP =====================
function copyIP() {
    const ip = document.getElementById('server-ip').textContent;
    const btn = document.getElementById('copy-btn');
    navigator.clipboard.writeText(ip).then(() => {
        btn.classList.add('copied');
        btn.querySelector('.copy-text').textContent = 'Kopyalandı!';
        btn.querySelector('.copy-icon').textContent = '✅';
        setTimeout(() => {
            btn.classList.remove('copied');
            btn.querySelector('.copy-text').textContent = 'Kopyala';
            btn.querySelector('.copy-icon').textContent = '📋';
        }, 2500);
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = ip;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        btn.querySelector('.copy-text').textContent = 'Kopyalandı!';
        setTimeout(() => {
            btn.querySelector('.copy-text').textContent = 'Kopyala';
        }, 2500);
    });
}

// ===================== HEADER SCROLL =====================
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
    header.classList.toggle('scrolled', window.scrollY > 40);
});

// ===================== REVEAL ON SCROLL =====================
function observeReveals() {
    const reveals = document.querySelectorAll('.tab-content.active .reveal:not(.visible)');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    reveals.forEach(el => observer.observe(el));
}
observeReveals();

// ===================== MOUSE GLOW EFFECT =====================
document.addEventListener('mousemove', (e) => {
    const cards = document.querySelectorAll('.feature-card, .server-card, .version-card, .requirements-card, .team-card, .discord-card, .mod-detail-card');
    cards.forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// ===================== LIGHTBOX GALLERY =====================
const galleryImages = [
    'media/screenshot_1.png',
    'media/gameplay_2.gif',
    'media/gameplay_3.gif',
    'media/gameplay_4.gif',
    'media/gameplay_5.gif',
    'media/gameplay_6.gif',
    'media/gameplay_7.gif',
    'media/gameplay_8.gif',
    'media/gameplay_9.gif',
    'media/gameplay_10.gif'
];

let currentLightboxIndex = 0;

function openLightbox(index) {
    currentLightboxIndex = index;
    const lightbox = document.getElementById('lightbox');
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    img.src = galleryImages[index];
    counter.textContent = `${index + 1} / ${galleryImages.length}`;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox(event) {
    if (event && event.target !== event.currentTarget && !event.target.classList.contains('lightbox-close')) return;
    const lightbox = document.getElementById('lightbox');
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
}

function changeLightbox(direction, event) {
    if (event) event.stopPropagation();
    currentLightboxIndex += direction;
    if (currentLightboxIndex < 0) currentLightboxIndex = galleryImages.length - 1;
    if (currentLightboxIndex >= galleryImages.length) currentLightboxIndex = 0;
    const img = document.getElementById('lightbox-img');
    const counter = document.getElementById('lightbox-counter');
    img.src = galleryImages[currentLightboxIndex];
    counter.textContent = `${currentLightboxIndex + 1} / ${galleryImages.length}`;
}

// Keyboard navigation for lightbox
document.addEventListener('keydown', (e) => {
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') changeLightbox(-1);
    if (e.key === 'ArrowRight') changeLightbox(1);
});
