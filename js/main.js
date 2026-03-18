/* ═══════════════════════════════════════════════════════════
   MAIN.JS — Core interactions, energetic cinematic intro
   ═══════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  initCinematicIntro();
  initProfilePhoto();
  initNavbar();
  initScrollReveal();
  initStatCounters();
  initGalleryFallback();
  initCertLightbox();
});


/* ─── CINEMATIC INTRO (ENERGETIC) ────────────────────────── */
function initCinematicIntro() {
  const intro = document.getElementById('cinematic-intro');
  if (!intro) return;

  document.body.classList.add('intro-active');

  // ── Matrix code rain on canvas
  const matrixCanvas = document.getElementById('intro-matrix');
  if (matrixCanvas) {
    const ctx = matrixCanvas.getContext('2d');
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;

    const chars = 'アイウエオカキクケコサシスセソ01{}[]<>/=;:ABCDEFGH'.split('');
    const fontSize = 14;
    const columns = Math.floor(matrixCanvas.width / fontSize);
    const drops = Array(columns).fill(1);

    function drawMatrix() {
      ctx.fillStyle = 'rgba(2, 2, 4, 0.06)';
      ctx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        const hue = 25 + Math.random() * 20;
        const lightness = 40 + Math.random() * 30;
        ctx.fillStyle = `hsl(${hue}, 90%, ${lightness}%)`;
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        if (drops[i] * fontSize > matrixCanvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      }
    }

    const matrixInterval = setInterval(drawMatrix, 40);
    setTimeout(() => clearInterval(matrixInterval), 8500);
  }

  // ── Create floating sparks
  const sparksContainer = document.getElementById('intro-sparks');
  if (sparksContainer) {
    for (let i = 0; i < 40; i++) {
      const spark = document.createElement('div');
      spark.className = 'intro-spark';
      spark.style.left = 50 + (Math.random() - 0.5) * 40 + '%';
      spark.style.top = 50 + (Math.random() - 0.5) * 40 + '%';
      const dx = (Math.random() - 0.5) * 500;
      const dy = -100 - Math.random() * 400;
      spark.style.setProperty('--dx', dx + 'px');
      spark.style.setProperty('--dy', dy + 'px');
      spark.style.setProperty('--dur', (1.5 + Math.random() * 2) + 's');
      spark.style.setProperty('--delay', (Math.random() * 0.5) + 's');
      sparksContainer.appendChild(spark);
    }
  }

  // ── Elements
  const countdown = document.getElementById('intro-countdown');
  const countNum = document.getElementById('countdown-num');
  const aiCore = document.getElementById('intro-ai-core');
  const line1 = document.querySelector('.intro-line--1');
  const line2 = document.querySelector('.intro-line--2');
  const line3 = document.querySelector('.intro-line--3');
  const loader = document.querySelector('.intro-loader');
  const loaderBar = document.querySelector('.intro-loader-bar');
  const shockwave = document.getElementById('intro-shockwave');
  const flash = document.getElementById('intro-flash');
  const content = document.querySelector('.intro-content');

  // ═══ SHOW AI CORE ═══
  setTimeout(() => aiCore && aiCore.classList.add('show'), 100);

  // ═══ FAST COUNTDOWN: 3... 2... 1... ═══
  if (countdown) countdown.classList.add('show');

  // Show "3" at 0.2s
  setTimeout(() => {
    if (countNum) { countNum.textContent = '3'; countNum.classList.add('pulse'); }
  }, 200);

  // Show "2" at 0.9s
  setTimeout(() => {
    if (countNum) { countNum.classList.remove('pulse'); void countNum.offsetWidth; countNum.textContent = '2'; countNum.classList.add('pulse'); }
  }, 900);

  // Show "1" at 1.6s
  setTimeout(() => {
    if (countNum) { countNum.classList.remove('pulse'); void countNum.offsetWidth; countNum.textContent = '1'; countNum.classList.add('pulse'); }
  }, 1600);

  // Hide countdown, show "Welcome to my world" at 2.3s
  setTimeout(() => {
    if (countdown) countdown.classList.add('hide');
    if (line1) line1.classList.add('show');
    if (aiCore) aiCore.style.opacity = '0.3'; // Dim core behind text
  }, 2300);

  // Show subtitle + Loader + Launching all at 2.6s for speed
  setTimeout(() => {
    if (line2) line2.classList.add('show');
    if (loader) loader.classList.add('show');
    if (line3) line3.classList.add('show');
  }, 2600);

  // Fill loader bar almost instantly
  setTimeout(() => loaderBar && loaderBar.classList.add('fill'), 2700);

  // ═══ BOOM at 3.5s ═══
  setTimeout(() => {
    if (aiCore) aiCore.classList.add('boom');
    if (shockwave) shockwave.classList.add('boom');
    if (flash) flash.classList.add('flash');
    if (content) content.classList.add('shake');
    document.querySelectorAll('.intro-spark').forEach(s => s.classList.add('fly'));

    // Gates open + reveal hero
    setTimeout(() => {
      intro.classList.add('intro-exit');
      const navbar = document.getElementById('navbar');
      if (navbar) navbar.classList.add('visible');
      document.querySelectorAll('.hero .reveal').forEach((el, i) => {
        setTimeout(() => el.classList.add('revealed'), i * 150);
      });
    }, 200);
  }, 3500);

  // Remove intro from DOM
  setTimeout(() => {
    document.body.classList.remove('intro-active');
    intro.classList.add('intro-fade');
    setTimeout(() => intro.remove(), 600);
  }, 5000);
}


/* ─── PROFILE PHOTO ──────────────────────────────────────── */
function initProfilePhoto() {
  const photo = document.getElementById('profile-photo');
  const wrapper = document.getElementById('hero-image-wrapper');
  if (!photo || !wrapper) return;

  photo.addEventListener('error', () => {
    wrapper.classList.add('hidden');
  });
}


/* ─── NAVBAR ─────────────────────────────────────────────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('nav-toggle');
  const links = document.getElementById('nav-links');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    const scroll = window.scrollY;
    if (navbar) {
      navbar.classList.toggle('scrolled', scroll > 50);
    }
  });

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      toggle.classList.toggle('active');
      links.classList.toggle('open');
    });
  }

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (toggle) toggle.classList.remove('active');
      if (links) links.classList.remove('open');
    });
  });

  // Active section highlighting
  const sections = document.querySelectorAll('section[id]');
  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
        });
      }
    });
  }, { root: null, rootMargin: '-40% 0px -60% 0px', threshold: 0 });

  sections.forEach(section => sectionObserver.observe(section));
}


/* ─── SCROLL REVEAL ──────────────────────────────────────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal:not(.hero .reveal)');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { root: null, rootMargin: '0px 0px -80px 0px', threshold: 0.1 });

  reveals.forEach(el => observer.observe(el));
}


/* ─── STAT COUNTERS (RE-ANIMATE ON EACH SCROLL) ─────────── */
function initStatCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  const statsGrid = document.querySelector('.stats-grid');
  if (!statsGrid || counters.length === 0) return;

  let isAnimating = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !isAnimating) {
        isAnimating = true;
        animateCounters();
      } else if (!entry.isIntersecting) {
        // Reset counters when scrolled out
        isAnimating = false;
        counters.forEach(counter => {
          counter.textContent = '0';
        });
      }
    });
  }, { threshold: 0.3 });

  observer.observe(statsGrid);

  function animateCounters() {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const duration = 2000;
      const start = performance.now();

      function update(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        counter.textContent = Math.floor(eased * target);

        if (progress < 1) {
          requestAnimationFrame(update);
        } else {
          counter.textContent = target;
        }
      }

      requestAnimationFrame(update);
    });
  }
}


/* ─── GALLERY FALLBACK ───────────────────────────────────── */
function initGalleryFallback() {
  // Hide gallery items whose images failed to load
  document.querySelectorAll('.gallery-img').forEach(img => {
    img.addEventListener('error', () => {
      const item = img.closest('.gallery-item');
      if (item) item.style.display = 'none';
    });
  });

  // ── Photo Lightbox
  const trigger = document.getElementById('hero-photo-trigger');
  const lightbox = document.getElementById('photo-lightbox');
  const lightboxClose = document.getElementById('lightbox-close');

  if (trigger && lightbox) {
    trigger.addEventListener('click', () => {
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });

    const closeLightbox = () => {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    };

    if (lightboxClose) lightboxClose.addEventListener('click', closeLightbox);

    lightbox.querySelector('.lightbox-backdrop')?.addEventListener('click', closeLightbox);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox.classList.contains('active')) closeLightbox();
    });
  }
}


/* ─── CERTIFICATE CINEMATIC LIGHTBOX ─────────────────────── */
function initCertLightbox() {
  const certCards = document.querySelectorAll('.cert-card[data-cert]');
  const certLB = document.getElementById('cert-lightbox');
  const certImg = document.getElementById('cert-lightbox-img');
  const certName = document.getElementById('cert-lightbox-name');
  const certClose = document.getElementById('cert-lightbox-close');

  if (!certLB || certCards.length === 0) return;

  certCards.forEach(card => {
    card.addEventListener('click', () => {
      const src = card.getAttribute('data-cert');
      const name = card.getAttribute('data-name');
      if (certImg) { certImg.src = src; certImg.alt = name; }
      if (certName) certName.textContent = name;
      certLB.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  const closeCert = () => {
    certLB.classList.remove('active');
    document.body.style.overflow = '';
  };

  if (certClose) certClose.addEventListener('click', closeCert);
  certLB.querySelector('.cert-lightbox-backdrop')?.addEventListener('click', closeCert);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && certLB.classList.contains('active')) closeCert();
  });
}
