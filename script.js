/* ==========================================================
   script.js — AssisTea Academic Website Interactions
   ========================================================== */

// ─── NAVBAR SCROLL EFFECT ─────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// ─── MOBILE HAMBURGER MENU ────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('.nav-link').forEach(link =>
  link.addEventListener('click', () => navLinks.classList.remove('open'))
);

// ─── HERO PARTICLE SYSTEM ─────────────────────────────────
const particleContainer = document.getElementById('particles');
if (particleContainer) {
  for (let i = 0; i < 25; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 4 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random()*100}%;
      bottom:-10px;
      animation-duration:${Math.random()*15+10}s;
      animation-delay:${Math.random()*10}s;
      opacity:${Math.random()*0.4+0.1};
    `;
    particleContainer.appendChild(p);
  }
}

// ─── HERO ELEMENTS ANIMATE ON LOAD ───────────────────────
const heroEls = document.querySelectorAll('.animate-fade-up');
const heroObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in-view'); });
}, { threshold: 0.1 });
heroEls.forEach(el => heroObserver.observe(el));

// ─── AOS SCROLL ANIMATIONS ───────────────────────────────
const aosEls = document.querySelectorAll('[data-aos]');
const aosObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const delay = parseInt(e.target.dataset.aosDelay || '0');
      setTimeout(() => e.target.classList.add('ao-in'), delay);
      aosObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.05, rootMargin: '0px 0px -20px 0px' });
setTimeout(() => {
  aosEls.forEach(el => {
    if (el.getBoundingClientRect().top < window.innerHeight) el.classList.add('ao-in');
  });
}, 150);
aosEls.forEach(el => aosObserver.observe(el));

// ─── SMOOTH SCROLL FOR NAV LINKS ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const id = this.getAttribute('href');
    if (id === '#') return;
    const target = document.querySelector(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 76;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ─── ACTIVE NAV LINK HIGHLIGHTING ────────────────────────
const sections    = document.querySelectorAll('section[id]');
const navLinkEls  = document.querySelectorAll('.nav-link');
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.id;
      navLinkEls.forEach(link => {
        link.classList.remove('active-link');
        if (link.getAttribute('href') === `#${id}`) link.classList.add('active-link');
      });
    }
  });
}, { threshold: 0.35 });
sections.forEach(s => sectionObserver.observe(s));

// ─── DOMAIN TABS ─────────────────────────────────────────
const tabBtns   = document.querySelectorAll('.tab-btn');
const tabPanels = document.querySelectorAll('.tab-panel');

tabBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.tab;
    tabBtns.forEach(b   => b.classList.remove('active'));
    tabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById(`tab-${target}`);
    if (panel) panel.classList.add('active');
  });
});

// ─── CUSTOM MILESTONE DROPDOWN ───────────────────────────
const milestoneDropdown   = document.getElementById('milestoneDropdown');
const milestoneSelectedEl = document.getElementById('milestoneSelected');
const milestoneSelectedTx = document.getElementById('milestoneSelectedText');
const milestoneOptList    = document.getElementById('milestoneOptions');
const milestonePanels     = document.querySelectorAll('.milestone-panel');

if (milestoneDropdown) {
  // Toggle open / close
  milestoneSelectedEl.addEventListener('click', (e) => {
    e.stopPropagation();
    milestoneDropdown.classList.toggle('open');
  });

  // Pick an option
  milestoneOptList.querySelectorAll('.custom-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const val = opt.dataset.value;
      milestoneSelectedTx.textContent = opt.textContent.trim();
      milestoneOptList.querySelectorAll('.custom-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      milestonePanels.forEach(p => p.classList.remove('active'));
      const panel = document.getElementById(`milestone-${val}`);
      if (panel) panel.classList.add('active');
      milestoneDropdown.classList.remove('open');
    });
  });

  // Close on outside click
  document.addEventListener('click', () => milestoneDropdown.classList.remove('open'));
}

// ─── CONTACT FORM → MAILTO ───────────────────────────────
function handleFormSubmit(e) {
  e.preventDefault();
  const name    = document.getElementById('contactName').value.trim();
  const email   = document.getElementById('contactEmail').value.trim();
  const subject = document.getElementById('contactSubject').value.trim() || 'AssisTea Research Inquiry';
  const message = document.getElementById('contactMessage').value.trim();
  const body    = `From: ${name} (${email})\n\n${message}`;
  window.location.href = `mailto:assistea.official@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}

// ─── CARD HOVER TILT ──────────────────────────────────────
document.querySelectorAll('.doc-card, .slide-card, .team-card, .tech-item').forEach(card => {
  card.addEventListener('mousemove', e => {
    const r = card.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width  - 0.5) * 7;
    const y = ((e.clientY - r.top)  / r.height - 0.5) * -7;
    card.style.transform = `translateY(-4px) rotateX(${y}deg) rotateY(${x}deg)`;
    card.style.transition = 'transform 0.1s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
    card.style.transition = '0.3s cubic-bezier(0.4,0,0.2,1)';
  });
});

console.log('%c🌿 AssisTea Website Loaded', 'color:#73AB2E;font-size:14px;font-weight:bold;');
