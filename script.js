/* ==========================================================
   script.js — AssisTea Marketing Website Interactions
   ========================================================== */

// ─── NAVBAR SCROLL EFFECT ────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 40) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// ─── MOBILE HAMBURGER MENU ───────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});
// Close menu on link click
navLinks.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('open'));
});

// ─── HERO PARTICLE SYSTEM ────────────────────────────────
const particleContainer = document.getElementById('particles');
const PARTICLE_COUNT = 30;

function createParticle() {
  const p = document.createElement('div');
  p.className = 'particle';
  const size = Math.random() * 4 + 2;
  const left = Math.random() * 100;
  const duration = Math.random() * 15 + 10;
  const delay = Math.random() * 10;
  const opacity = Math.random() * 0.5 + 0.1;
  p.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -10px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${opacity};
  `;
  particleContainer.appendChild(p);
}

for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

// ─── INTERSECTION OBSERVER — ANIMATE ON SCROLL ──────────
// Hero elements
const heroEls = document.querySelectorAll('.animate-fade-up');
const heroObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('in-view');
  });
}, { threshold: 0.1 });
heroEls.forEach(el => heroObserver.observe(el));

// AOS elements
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const delay = parseInt(entry.target.dataset.aosDelay || '0');
      setTimeout(() => entry.target.classList.add('ao-in'), delay);
      aosObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.04, rootMargin: '0px 0px -20px 0px' });

// Trigger elements already in view on load
setTimeout(() => {
  aosEls.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight) {
      const delay = parseInt(el.dataset.aosDelay || '0');
      setTimeout(() => el.classList.add('ao-in'), delay);
    }
  });
}, 200);
aosEls.forEach(el => aosObserver.observe(el));

// ─── SMOOTH SCROLL FOR NAV LINKS ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    const target = document.querySelector(targetId);
    if (target) {
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── ACTIVE NAV LINK HIGHLIGHTING ───────────────────────
const sections = document.querySelectorAll('section[id]');
const navLinkEls = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinkEls.forEach(link => {
        link.style.color = '';
        link.style.background = '';
        if (link.getAttribute('href') === `#${id}`) {
          link.style.color = 'var(--c-green)';
          link.style.background = 'rgba(115,171,46,0.08)';
        }
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

// ─── STAT COUNTER ANIMATION ──────────────────────────────
function animateCounter(el, target, isNum) {
  if (!isNum) { el.textContent = target; return; }
  const num = parseInt(target.replace(/\D/g, ''));
  const suffix = target.replace(/[0-9]/g, '');
  const duration = 1500;
  const step = duration / Math.max(num, 1);
  let current = 0;
  el.textContent = '0' + suffix;
  const timer = setInterval(() => {
    current += Math.ceil(num / (duration / 30));
    if (current >= num) { current = num; clearInterval(timer); }
    el.textContent = current + suffix;
  }, 30);
}

const heroStats = document.querySelector('.hero-stats');
let statsAnimated = false;
if (heroStats) {
  const statsObs = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !statsAnimated) {
      statsAnimated = true;
      document.querySelectorAll('.stat-number').forEach(el => {
        const val = el.textContent.trim();
        const isNumeric = /^[\d+%]+$/.test(val.replace('AI', ''));
        animateCounter(el, val, isNumeric && val !== 'AI');
      });
    }
  }, { threshold: 0.5 });
  statsObs.observe(heroStats);
}

// ─── CARDS HOVER TILT EFFECT ─────────────────────────────
document.querySelectorAll('.feature-card, .tech-card, .role-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 8;
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * -8;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = 'var(--transition)';
  });
});

// ─── MARQUEE PAUSE ON HOVER ──────────────────────────────
const marqueeTrack = document.querySelector('.marquee-track');
if (marqueeTrack) {
  marqueeTrack.addEventListener('mouseenter', () => {
    marqueeTrack.style.animationPlayState = 'paused';
  });
  marqueeTrack.addEventListener('mouseleave', () => {
    marqueeTrack.style.animationPlayState = 'running';
  });
}

// ─── CTA BUTTON RIPPLE EFFECT ─────────────────────────────
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
    const ripple = document.createElement('span');
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    Object.assign(ripple.style, {
      width: size + 'px',
      height: size + 'px',
      left: x + 'px',
      top: y + 'px',
      position: 'absolute',
      borderRadius: '50%',
      background: 'rgba(255,255,255,0.2)',
      transform: 'scale(0)',
      animation: 'ripple 0.5s ease-out',
      pointerEvents: 'none',
    });
    this.style.position = 'relative';
    this.style.overflow = 'hidden';
    this.appendChild(ripple);
    setTimeout(() => ripple.remove(), 600);
  });
});

// Inject ripple keyframe
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `@keyframes ripple { to { transform: scale(2.5); opacity: 0; } }`;
document.head.appendChild(rippleStyle);

console.log('%c🌿 AssisTea Website Loaded', 'color:#73AB2E;font-size:16px;font-weight:bold;');
