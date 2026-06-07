/* ====================================================
   InAmigos Foundation – script.js
   Premium Interactions & Animations
   ==================================================== */

'use strict';

/* ========== LOADER ========== */
window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => {
    loader.classList.add('hidden');
  }, 2200);
});

/* ========== HERO PARTICLES ========== */
function initParticles() {
  const container = document.getElementById('heroParticles');
  if (!container) return;
  const count = 22;
  for (let i = 0; i < count; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = Math.random() * 6 + 2;
    p.style.cssText = `
      width:${size}px; height:${size}px;
      left:${Math.random() * 100}%;
      animation-duration:${Math.random() * 12 + 8}s;
      animation-delay:${Math.random() * 10}s;
      opacity:${Math.random() * 0.4 + 0.1};
    `;
    container.appendChild(p);
  }
}
initParticles();

/* ========== NAVBAR ========== */
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('nav-links');
const allNavLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('section[id]');

// Scroll: sticky + active link highlight
window.addEventListener('scroll', () => {
  // Navbar scroll class
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  // Active nav link
  let current = '';
  sections.forEach(sec => {
    const top = sec.offsetTop - navbar.offsetHeight - 100;
    if (window.scrollY >= top) current = sec.getAttribute('id');
  });
  allNavLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) link.classList.add('active');
  });

  // Back-to-top
  updateBackToTop();

  // Counters
  triggerCountersIfVisible();

  // Impact bars
  triggerImpactBarsIfVisible();
});

// Hamburger menu
hamburger.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('open');
  hamburger.classList.toggle('open', isOpen);
  hamburger.setAttribute('aria-expanded', isOpen);
  document.body.classList.toggle('menu-open', isOpen);
});

// Close menu on link click
allNavLinks.forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', false);
    document.body.classList.remove('menu-open');
  });
});

// Smooth scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ========== HERO STAT COUNTERS (inline) ========== */
function animateHeroStats() {
  const items = document.querySelectorAll('.hero-stat-number');
  items.forEach(item => {
    const target = parseInt(item.dataset.target, 10);
    let current = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    const update = () => {
      current = Math.min(current + increment, target);
      item.textContent = formatNumber(Math.floor(current));
      if (current < target) requestAnimationFrame(update);
    };
    setTimeout(update, 800);
  });
}
animateHeroStats();

/* ========== SECTION REVEAL (Intersection Observer) ========== */
const revealElements = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealElements.forEach(el => revealObserver.observe(el));

/* ========== IMPACT COUNTERS ========== */
let countersTriggered = false;

function triggerCountersIfVisible() {
  if (countersTriggered) return;
  const section = document.getElementById('counters');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    countersTriggered = true;
    animateCounters();
  }
}

function animateCounters() {
  const items = document.querySelectorAll('.counter-number');
  items.forEach((item, i) => {
    const target = parseInt(item.dataset.target, 10);
    const suffix = item.dataset.suffix || '';
    let current = 0;
    const duration = 2200;
    const delay = i * 120;
    const step = (timestamp) => {
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutCubic(progress);
      current = Math.floor(eased * target);
      item.textContent = formatNumber(current) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    };
    let startTime;
    setTimeout(() => {
      startTime = performance.now();
      requestAnimationFrame(step);
    }, delay);
  });
}

/* ========== IMPACT BARS ========== */
let impactBarsTriggered = false;

function triggerImpactBarsIfVisible() {
  if (impactBarsTriggered) return;
  const section = document.getElementById('impact');
  if (!section) return;
  const rect = section.getBoundingClientRect();
  if (rect.top < window.innerHeight * 0.85) {
    impactBarsTriggered = true;
    document.querySelectorAll('.impact-fill').forEach(fill => {
      const width = fill.dataset.width;
      setTimeout(() => { fill.style.width = width + '%'; }, 200);
    });
  }
}

/* ========== BACK TO TOP ========== */
const backToTop = document.getElementById('backToTop');

function updateBackToTop() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
}

backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ========== GALLERY LIGHTBOX ========== */
(function initLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create overlay
  const overlay = document.createElement('div');
  overlay.id = 'lightbox';
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:9000;
    background:rgba(0,0,0,0.92);
    display:flex; align-items:center; justify-content:center;
    opacity:0; visibility:hidden;
    transition:all 0.3s ease;
    cursor:zoom-out;
    padding:24px;
  `;
  const lightboxImg = document.createElement('img');
  lightboxImg.style.cssText = `
    max-width:90vw; max-height:85vh;
    border-radius:16px;
    box-shadow:0 20px 60px rgba(0,0,0,0.7);
    transform:scale(0.9);
    transition:transform 0.3s ease;
    object-fit:contain;
  `;
  const closeBtn = document.createElement('button');
  closeBtn.innerHTML = '<i class="fas fa-times"></i>';
  closeBtn.style.cssText = `
    position:absolute; top:24px; right:24px;
    width:48px; height:48px; border-radius:50%;
    background:rgba(255,255,255,0.1);
    color:#fff; font-size:1.2rem;
    display:flex; align-items:center; justify-content:center;
    cursor:pointer; border:none;
    transition:background 0.2s ease;
  `;
  closeBtn.setAttribute('aria-label', 'Close lightbox');
  closeBtn.onmouseover = () => closeBtn.style.background = 'rgba(255,255,255,0.2)';
  closeBtn.onmouseout = () => closeBtn.style.background = 'rgba(255,255,255,0.1)';

  overlay.appendChild(lightboxImg);
  overlay.appendChild(closeBtn);
  document.body.appendChild(overlay);

  function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    overlay.style.opacity = '1';
    overlay.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
    requestAnimationFrame(() => { lightboxImg.style.transform = 'scale(1)'; });
  }

  function closeLightbox() {
    lightboxImg.style.transform = 'scale(0.9)';
    overlay.style.opacity = '0';
    overlay.style.visibility = 'hidden';
    document.body.style.overflow = '';
  }

  items.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img) openLightbox(img.src, img.alt);
    });
  });

  overlay.addEventListener('click', (e) => {
    if (e.target === overlay || e.target === closeBtn || closeBtn.contains(e.target)) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });
})();

/* ========== PROJECT CARD TILT EFFECT ========== */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotX = ((y - cy) / cy) * -5;
    const rotY = ((x - cx) / cx) * 5;
    card.style.transform = `translateY(-10px) perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

/* ========== VOLUNTEER CARD HOVER GLOW ========== */
document.querySelectorAll('.volunteer-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    card.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(232,93,106,0.08) 0%, var(--bg-card) 60%)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.background = '';
  });
});

/* ========== TYPING ANIMATION IN HERO ========== */
(function heroTyping() {
  const highlight = document.querySelector('.hero-highlight');
  if (!highlight) return;
  const texts = ['Lasting Change', 'Brighter Futures', 'Stronger Communities', 'A Better India'];
  let idx = 0;
  let charIdx = 0;
  let deleting = false;

  function type() {
    const current = texts[idx];
    if (!deleting) {
      highlight.textContent = current.substring(0, charIdx + 1);
      charIdx++;
      if (charIdx === current.length) {
        deleting = true;
        setTimeout(type, 2200);
        return;
      }
    } else {
      highlight.textContent = current.substring(0, charIdx - 1);
      charIdx--;
      if (charIdx === 0) {
        deleting = false;
        idx = (idx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 60 : 95);
  }
  setTimeout(type, 2500);
})();

/* ========== NAVBAR SCROLL-SPY INDICATOR ========== */
(function initScrollProgress() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position:fixed; top:0; left:0; z-index:1001;
    height:3px; width:0%;
    background:linear-gradient(90deg, #e85d6a, #ff9f43);
    transition:width 0.1s linear;
    pointer-events:none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = ((scrolled / total) * 100) + '%';
  });
})();

/* ========== UTILITY FUNCTIONS ========== */
function formatNumber(n) {
  if (n >= 1000) return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 0) + 'K';
  return n.toString();
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/* ========== INIT ON DOM READY ========== */
document.addEventListener('DOMContentLoaded', () => {
  // Initial scroll check
  triggerCountersIfVisible();
  triggerImpactBarsIfVisible();
  updateBackToTop();

  // Add hover cursor effect to project cards
  document.querySelectorAll('.project-card').forEach(card => {
    card.style.cursor = 'pointer';
  });

  console.log(
    '%c🌍 InAmigos Foundation %c| Humanity Beyond Boundaries',
    'color:#e85d6a; font-size:1.2rem; font-weight:bold;',
    'color:#9ca3af; font-size:0.9rem;'
  );
});

/* ========== ANNOUNCEMENT RIBBON (optional subtle entrance) ========== */
window.addEventListener('load', () => {
  setTimeout(() => {
    // Trigger a subtle entrance animation re-check for elements in viewport
    const inViewport = document.querySelectorAll('.reveal-up:not(.revealed), .reveal-left:not(.revealed), .reveal-right:not(.revealed)');
    inViewport.forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight) {
        el.classList.add('revealed');
      }
    });
  }, 2300);
});
