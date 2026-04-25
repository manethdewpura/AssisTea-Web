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
const sections   = Array.from(document.querySelectorAll('section[id]'));
const navLinkEls = document.querySelectorAll('.nav-link');

function updateActiveNavLink() {
  const scrollY = window.scrollY;
  const navOffset = 90;
  let activeId = sections[0]?.id;

  sections.forEach(section => {
    const top = section.offsetTop - navOffset;
    if (scrollY >= top) activeId = section.id;
  });

  navLinkEls.forEach(link => {
    link.classList.toggle('active-link', link.getAttribute('href') === `#${activeId}`);
  });
}

window.addEventListener('scroll', updateActiveNavLink, { passive: true });
window.addEventListener('load', updateActiveNavLink);
updateActiveNavLink();

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

// ─── DOCUMENT SEARCH ──────────────────────────────────────
const docSearchInput = document.getElementById('docSearchInput');
const docsMeta = document.getElementById('docsSearchMeta');
const docsEmptyState = document.getElementById('docsEmptyState');
const docsSearchResults = document.getElementById('docsSearchResults');
const docCards = Array.from(document.querySelectorAll('.docs-grid .doc-card'));

if (docSearchInput && docCards.length) {
  const normalize = (value) => value.toLowerCase().trim();
  const indexedDocs = docCards.map((card) => {
    const statusText = normalize(card.querySelector('.doc-status')?.textContent || '');
    const title = (card.querySelector('h3')?.textContent || '').trim();
    const link = card.querySelector('.doc-btn')?.getAttribute('href') || '';
    return {
      card,
      title,
      link,
      isAvailable: statusText.includes('available'),
      // Index the full card text so title, description, status, and button text are all searchable.
      searchableText: normalize(card.textContent || '')
    };
  });

  const getMatches = (query) => {
    return indexedDocs.filter((doc) => doc.isAvailable && (!query || doc.searchableText.includes(query)));
  };

  const renderSearchResults = (matches, query) => {
    if (!docsSearchResults) return;
    if (!query || !matches.length) {
      docsSearchResults.hidden = true;
      docsSearchResults.innerHTML = '';
      return;
    }

    const topMatches = matches.slice(0, 5);
    docsSearchResults.innerHTML = topMatches.map((doc) => `
      <button type="button" class="docs-search-result-item" data-doc-link="${doc.link}">
        <span class="docs-search-result-title">${doc.title || 'Document'}</span>
        <span class="docs-search-result-link">Open matching document</span>
      </button>
    `).join('');
    docsSearchResults.hidden = false;
  };

  const updateDocumentResults = () => {
    const query = normalize(docSearchInput.value);
    const matches = getMatches(query);
    const matchedSet = new Set(matches.map((doc) => doc.card));

    indexedDocs.forEach((doc) => {
      const show = matchedSet.has(doc.card);
      doc.card.hidden = !show;
    });
    const visibleCount = matches.length;
    renderSearchResults(matches, query);

    if (docsMeta) {
      docsMeta.textContent = query
        ? `Showing ${visibleCount} available result${visibleCount === 1 ? '' : 's'} for "${docSearchInput.value.trim()}".`
        : `Showing all available documents (${visibleCount}).`;
    }
    if (docsEmptyState) docsEmptyState.hidden = visibleCount > 0;
  };

  ['input', 'search', 'keyup', 'change'].forEach((eventName) => {
    docSearchInput.addEventListener(eventName, updateDocumentResults);
  });

  docSearchInput.addEventListener('keydown', (event) => {
    if (event.key !== 'Enter') return;
    const query = normalize(docSearchInput.value);
    if (!query) return;
    const firstMatch = getMatches(query)[0];
    if (!firstMatch?.link) return;
    event.preventDefault();
    window.open(firstMatch.link, '_blank', 'noopener');
  });

  if (docsSearchResults) {
    docsSearchResults.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const button = target.closest('.docs-search-result-item');
      if (!(button instanceof HTMLElement)) return;
      const link = button.dataset.docLink;
      if (link) window.open(link, '_blank', 'noopener');
    });

    document.addEventListener('click', (event) => {
      const target = event.target;
      if (!(target instanceof HTMLElement)) return;
      const clickedInsideSearch = target.closest('.docs-search-wrap');
      if (!clickedInsideSearch) docsSearchResults.hidden = true;
    });
  }

  docSearchInput.addEventListener('focus', updateDocumentResults);
  updateDocumentResults();
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

// ─── RESEARCH JOURNEY CLUSTER SLIDERS ─────────────────────
document.querySelectorAll('[data-slider]').forEach(slider => {
  const cards = Array.from(slider.querySelectorAll('.journey-cluster-card'));
  const prevBtn = slider.querySelector('.journey-nav--prev');
  const nextBtn = slider.querySelector('.journey-nav--next');
  const dotsWrap = slider.querySelector('.journey-cluster-dots');
  if (!cards.length || !dotsWrap) return;

  let index = 0;
  let timerId;

  // Build indicator dots based on image count.
  cards.forEach(() => {
    const dot = document.createElement('span');
    dot.className = 'journey-dot';
    dotsWrap.appendChild(dot);
  });
  const dots = Array.from(dotsWrap.querySelectorAll('.journey-dot'));

  const render = () => {
    const total = cards.length;
    const prevIdx = (index - 1 + total) % total;
    const nextIdx = (index + 1) % total;

    cards.forEach((card, idx) => {
      card.classList.remove('is-active', 'is-prev', 'is-next', 'is-hidden');
      if (idx === index) card.classList.add('is-active');
      else if (idx === prevIdx) card.classList.add('is-prev');
      else if (idx === nextIdx) card.classList.add('is-next');
      else card.classList.add('is-hidden');
    });

    dots.forEach((dot, idx) => dot.classList.toggle('is-active', idx === index));
  };

  const goNext = () => {
    index = (index + 1) % cards.length;
    render();
  };

  const goPrev = () => {
    index = (index - 1 + cards.length) % cards.length;
    render();
  };

  const start = () => {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(goNext, 3500);
  };
  const stop = () => { if (timerId) clearInterval(timerId); };

  if (prevBtn) prevBtn.addEventListener('click', () => { goPrev(); stop(); start(); });
  if (nextBtn) nextBtn.addEventListener('click', () => { goNext(); stop(); start(); });

  render();
  start();
});

console.log('%c🌿 AssisTea Website Loaded', 'color:#73AB2E;font-size:14px;font-weight:bold;');
