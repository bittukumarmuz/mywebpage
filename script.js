/* ============================================
   BITTU KUMAR PORTFOLIO — script.js
   ✅ Yeh file index.html ke bottom mein
   connected hai: <script src="script.js"></script>
   ============================================ */

/* ========== 1. NAVBAR — SCROLL PAR STYLE CHANGE ========== */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ========== 2. HAMBURGER MENU (MOBILE) ========== */
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
});

// Nav link click pe menu band ho
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
  });
});

/* ========== 3. TYPEWRITER EFFECT ========== */
const typeEl = document.getElementById('typewriter');
const typeText = "Learning today, building tomorrow 🚀";
let charIndex = 0;
let isTyping = true;

function typeLoop() {
  if (isTyping) {
    // Type karo
    if (charIndex < typeText.length) {
      typeEl.textContent += typeText[charIndex++];
      setTimeout(typeLoop, 65);
    } else {
      // Poora type ho gaya — 2.5 sec ruko
      isTyping = false;
      setTimeout(typeLoop, 2500);
    }
  } else {
    // Delete karo
    if (charIndex > 0) {
      typeEl.textContent = typeText.slice(0, --charIndex);
      setTimeout(typeLoop, 35);
    } else {
      // Sab delete hua — phir type karo
      isTyping = true;
      setTimeout(typeLoop, 500);
    }
  }
}
typeLoop();

/* ========== 4. PARTICLE ANIMATION ========== */
const canvas = document.getElementById('particleCanvas');
const ctx    = canvas.getContext('2d');
let particles = [];
let animationFrame;

// Canvas size set karo
function resizeCanvas() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', () => {
  resizeCanvas();
  initParticles();
});

// Ek particle class
class Particle {
  constructor() { this.reset(); }

  reset() {
    this.x      = Math.random() * canvas.width;
    this.y      = Math.random() * canvas.height;
    this.size   = Math.random() * 2 + 0.5;
    this.speedX = (Math.random() - 0.5) * 0.4;
    this.speedY = (Math.random() - 0.5) * 0.4;
    this.opacity = Math.random() * 0.5 + 0.1;
    // Random color: green / cyan / white
    const r = Math.random();
    this.color = r > 0.6 ? '#00f5a0' : r > 0.3 ? '#00d9f5' : '#ffffff';
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    // Bahar jaaye toh reset
    if (this.x < 0 || this.x > canvas.width ||
        this.y < 0 || this.y > canvas.height) {
      this.reset();
    }
  }

  draw() {
    ctx.save();
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle   = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// Particles banao (screen size ke hisaab se)
function initParticles() {
  const count = Math.min(90, Math.floor((canvas.width * canvas.height) / 11000));
  particles = Array.from({ length: count }, () => new Particle());
}

// Particles ke beech lines draw karo
function drawConnections() {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx   = particles[i].x - particles[j].x;
      const dy   = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 120) {
        ctx.save();
        ctx.globalAlpha = (1 - dist / 120) * 0.12;
        ctx.strokeStyle = '#00f5a0';
        ctx.lineWidth   = 0.5;
        ctx.beginPath();
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
        ctx.restore();
      }
    }
  }
}

// Animation loop
function animateParticles() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(p => { p.update(); p.draw(); });
  drawConnections();
  animationFrame = requestAnimationFrame(animateParticles);
}

initParticles();
animateParticles();

// Hero section bahar jaaye toh particles band karo (performance)
const heroSection = document.getElementById('hero');
const heroObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {
    animateParticles(); // Wapas start
  } else {
    cancelAnimationFrame(animationFrame); // Band
  }
}, { threshold: 0 });
heroObserver.observe(heroSection);

/* ========== 5. SCROLL REVEAL ANIMATION ========== */
const revealElements = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // Ek baar dikhne ke baad unobserve
    }
  });
}, { threshold: 0.12 });

revealElements.forEach(el => revealObserver.observe(el));

/* ========== 6. SKILL BARS ANIMATION ========== */
const skillsGrid = document.querySelector('.skills-grid');
if (skillsGrid) {
  const skillObserver = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      // Thoda delay ke baad bars fill karein
      entries[0].target.querySelectorAll('.skill-fill').forEach(bar => {
        setTimeout(() => bar.classList.add('animated'), 200);
      });
      skillObserver.unobserve(entries[0].target);
    }
  }, { threshold: 0.2 });

  skillObserver.observe(skillsGrid);
}

/* ========== 7. CONTACT FORM SUBMIT ========== */
const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const submitBtn = this.querySelector('button[type="submit"]');
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    const formData = new FormData(this);

    fetch(this.action, {
      method: 'POST',
      body: formData,
      headers: { 'Accept': 'application/json' }
    })
    .then(res => res.json())
    .then(data => {
      contactForm.reset();
      formSuccess.classList.add('show');
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      submitBtn.disabled = false;
      setTimeout(() => formSuccess.classList.remove('show'), 4000);
    })
    .catch(() => {
      submitBtn.innerHTML = 'Send Message <i class="fas fa-paper-plane"></i>';
      submitBtn.disabled = false;
    });
  });
}

/* ========== 8. ACTIVE NAV LINK HIGHLIGHT ========== */
const allSections = document.querySelectorAll('section[id]');
const allNavLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
  let current = '';
  allSections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 130) {
      current = section.getAttribute('id');
    }
  });

  allNavLinks.forEach(link => {
    link.style.color = '';
    if (link.getAttribute('href') === '#' + current) {
      link.style.color = 'var(--accent)';
    }
  });
});
