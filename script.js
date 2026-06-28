/**
 * Gowtham Raj Kalepu — Portfolio JavaScript
 * Handles: Loader, Cursor, Navbar, Typing, Particles, Scroll Reveal,
 *           Animated Counters, Skill Tabs, Contact Form, Back To Top
 */

'use strict';

/* ============================================================
   LOADER
   ============================================================ */
(function initLoader() {
  const loader = document.getElementById('loader');
  if (!loader) return;

  document.body.classList.add('loading');

  window.addEventListener('load', () => {
    setTimeout(() => {
      loader.classList.add('hidden');
      document.body.classList.remove('loading');
      // Kick off hero animations after load
      triggerHeroReveal();
    }, 1500);
  });
})();

function triggerHeroReveal() {
  const heroEls = document.querySelectorAll('.hero .reveal-up, .hero .reveal-right');
  heroEls.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 130);
  });
}

/* ============================================================
   CUSTOM CURSOR
   ============================================================ */
(function initCursor() {
  const cursor   = document.getElementById('cursor');
  const follower = document.getElementById('cursor-follower');
  if (!cursor || !follower) return;
  if (window.matchMedia('(hover: none)').matches) return;

  let mx = 0, my = 0, fx = 0, fy = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  (function animateFollower() {
    fx += (mx - fx) * 0.12;
    fy += (my - fy) * 0.12;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    requestAnimationFrame(animateFollower);
  })();

  // Hover effect on interactive elements
  const hoverTargets = 'a, button, .skill-chip, .service-card, .stat-card, .skill-tab';
  document.addEventListener('mouseover', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.add('active');
      follower.classList.add('active');
    }
  });
  document.addEventListener('mouseout', e => {
    if (e.target.closest(hoverTargets)) {
      cursor.classList.remove('active');
      follower.classList.remove('active');
    }
  });

  document.addEventListener('mouseleave', () => {
    cursor.style.opacity   = '0';
    follower.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    cursor.style.opacity   = '1';
    follower.style.opacity = '1';
  });
})();

/* ============================================================
   SCROLL PROGRESS BAR
   ============================================================ */
(function initScrollProgress() {
  const bar = document.getElementById('scroll-progress');
  if (!bar) return;

  window.addEventListener('scroll', () => {
    const total    = document.documentElement.scrollHeight - window.innerHeight;
    const progress = total > 0 ? (window.scrollY / total) * 100 : 0;
    bar.style.width = progress + '%';
  }, { passive: true });
})();

/* ============================================================
   NAVBAR — shrink on scroll, active link highlighting
   ============================================================ */
(function initNavbar() {
  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileMenu= document.getElementById('mobile-menu');
  const navLinks  = document.querySelectorAll('.nav-link');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  if (!navbar) return;

  // Scroll behaviour
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);

    // Highlight active section link
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      if (window.scrollY >= top) current = sec.getAttribute('id');
    });
    navLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + current);
      link.setAttribute('aria-current', link.getAttribute('href') === '#' + current ? 'page' : '');
    });
  }, { passive: true });

  // Hamburger toggle
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      const isOpen = hamburger.classList.toggle('open');
      hamburger.setAttribute('aria-expanded', isOpen);
      mobileMenu.classList.toggle('open', isOpen);
      mobileMenu.setAttribute('aria-hidden', !isOpen);
    });

    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
        mobileMenu.classList.remove('open');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
  }
})();

/* ============================================================
   TYPING ANIMATION
   ============================================================ */
(function initTyping() {
  const el = document.getElementById('typed-text');
  if (!el) return;

  const words   = ['Python Developer', 'Django Developer', 'Backend Developer', 'AI Engineer'];
  let wordIdx   = 0;
  let charIdx   = 0;
  let deleting  = false;
  let pauseMs   = 0;

  function type() {
    const current = words[wordIdx];

    if (!deleting) {
      el.textContent = current.slice(0, ++charIdx);
      if (charIdx === current.length) {
        deleting = true;
        pauseMs = 1800;
      }
    } else {
      el.textContent = current.slice(0, --charIdx);
      if (charIdx === 0) {
        deleting = false;
        wordIdx  = (wordIdx + 1) % words.length;
        pauseMs  = 400;
      }
    }

    const speed = deleting ? 60 : 95;
    setTimeout(type, pauseMs || speed);
    pauseMs = 0;
  }

  // Start after loader animation (~1.6s)
  setTimeout(type, 2000);
})();

/* ============================================================
   PARTICLE CANVAS
   ============================================================ */
(function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;

  const ctx     = canvas.getContext('2d');
  const PARTICLE_COUNT = 60;
  let particles = [];
  let W, H;

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
  }

  class Particle {
    constructor() { this.reset(true); }
    reset(init = false) {
      this.x  = Math.random() * W;
      this.y  = init ? Math.random() * H : H + 10;
      this.r  = Math.random() * 1.5 + 0.5;
      this.vx = (Math.random() - 0.5) * 0.25;
      this.vy = -(Math.random() * 0.4 + 0.2);
      this.a  = Math.random() * 0.5 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.y < -10) this.reset();
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${this.a})`;
      ctx.fill();
    }
  }

  function init() {
    resize();
    particles = Array.from({ length: PARTICLE_COUNT }, () => new Particle());
  }

  function animate() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => { p.update(); p.draw(); });
    requestAnimationFrame(animate);
  }

  const ro = new ResizeObserver(resize);
  ro.observe(canvas);

  init();
  animate();
})();

/* ============================================================
   SCROLL REVEAL (IntersectionObserver)
   ============================================================ */
(function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');
  if (!targets.length) return;

  // Hero items handled separately by triggerHeroReveal()
  const nonHeroTargets = [...targets].filter(el => !el.closest('.hero'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });

  nonHeroTargets.forEach(el => observer.observe(el));
})();

/* ============================================================
   ANIMATED COUNTERS
   ============================================================ */
(function initCounters() {
  const counters = document.querySelectorAll('.stat-number[data-target]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el     = entry.target;
      const target = parseInt(el.dataset.target, 10);
      const suffix = target >= 5 ? '+' : '';
      let start    = 0;
      const step   = target / 40;

      const tick = () => {
        start += step;
        if (start >= target) {
          el.textContent = target + suffix;
          return;
        }
        el.textContent = Math.floor(start) + suffix;
        requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
      observer.unobserve(el);
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
})();

/* ============================================================
   SKILL TABS
   ============================================================ */
(function initSkillTabs() {
  const tabs   = document.querySelectorAll('.skill-tab');
  const panels = document.querySelectorAll('.skill-panel');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.tab;

      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      panels.forEach(p => {
        p.classList.remove('active');
        p.setAttribute('hidden', '');
      });

      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      const panel = document.querySelector(`[data-panel="${target}"]`);
      if (panel) {
        panel.classList.add('active');
        panel.removeAttribute('hidden');
      }
    });
  });
})();

/* ============================================================
   CONTACT FORM
   ============================================================ */
(function initContactForm() {
  const form    = document.getElementById('contact-form');
  const feedback = document.getElementById('form-message');
  if (!form || !feedback) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name    = form.name.value.trim();
    const email   = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showFeedback('Please fill in all fields.', 'error');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showFeedback('Please enter a valid email address.', 'error');
      return;
    }

    const btn = form.querySelector('.btn-send');
    const originalHTML = btn.innerHTML;
    btn.innerHTML = '<span class="btn-text">Sending…</span>';
    btn.disabled = true;

    // Simulate send (replace with your backend/FormSpree endpoint)
    await new Promise(resolve => setTimeout(resolve, 1400));

    showFeedback('✓ Message sent! I\'ll get back to you soon.', 'success');
    form.reset();
    btn.innerHTML = originalHTML;
    btn.disabled = false;
  });

  function showFeedback(msg, type) {
    feedback.textContent = msg;
    feedback.className   = 'form-feedback ' + type;
    setTimeout(() => {
      feedback.textContent = '';
      feedback.className   = 'form-feedback';
    }, 5000);
  }
})();

/* ============================================================
   BACK TO TOP
   ============================================================ */
(function initBackToTop() {
  const btn = document.getElementById('back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 500);
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
})();

/* ============================================================
   SMOOTH SCROLL for anchor links
   ============================================================ */
(function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80; // navbar height
        const top    = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
})();

/* ============================================================
   LAZY LOAD IMAGES
   ============================================================ */
(function initLazyImages() {
  const imgs = document.querySelectorAll('img[loading="lazy"]');
  if ('loading' in HTMLImageElement.prototype) return; // native support

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src || img.src;
        io.unobserve(img);
      }
    });
  });
  imgs.forEach(img => io.observe(img));
})();

/* ============================================================
   SKILL CHIP — staggered animation on tab switch
   ============================================================ */
(function initChipStagger() {
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.target.classList.contains('active')) {
        const chips = m.target.querySelectorAll('.skill-chip');
        chips.forEach((chip, i) => {
          chip.style.opacity   = '0';
          chip.style.transform = 'translateY(16px)';
          setTimeout(() => {
            chip.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
            chip.style.opacity    = '1';
            chip.style.transform  = 'translateY(0)';
          }, i * 45);
        });
      }
    });
  });

  document.querySelectorAll('.skill-panel').forEach(panel => {
    observer.observe(panel, { attributes: true, attributeFilter: ['class'] });
  });
})();

/* ============================================================
   NAVBAR KEYBOARD ACCESSIBILITY
   ============================================================ */
(function initNavA11y() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  if (!hamburger || !mobileMenu) return;

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('open')) {
      hamburger.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
      hamburger.focus();
    }
  });
})();
