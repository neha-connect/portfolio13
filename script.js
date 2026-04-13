/* ============================================================
   NEHA HK — PORTFOLIO JAVASCRIPT
   Features: Bubble cursor, typed text, scroll reveal,
             sticky navbar, project filter, form validation
   ============================================================ */

'use strict';

/* ─── 1. BUBBLE CURSOR ───────────────────────────────────── */
(function initBubbleCursor() {
  const canvas = document.getElementById('bubbleCanvas');
  const ctx    = canvas.getContext('2d');
  let W = canvas.width  = window.innerWidth;
  let H = canvas.height = window.innerHeight;

  const bubbles = [];
  const MAX     = 60;
  let mouseX = W / 2, mouseY = H / 2;

  const COLORS = [
    'rgba(74, 222, 128,',
    'rgba(45, 212, 191,',
    'rgba(163,230,  53,',
    'rgba(232,220,200,',
    'rgba(251,191, 36,',
  ];

  class Bubble {
    constructor(x, y) {
      this.x    = x + (Math.random() - 0.5) * 60;
      this.y    = y + (Math.random() - 0.5) * 60;
      this.r    = Math.random() * 14 + 4;
      this.life = 1;
      this.decay= Math.random() * 0.012 + 0.008;
      this.vx   = (Math.random() - 0.5) * 1.2;
      this.vy   = (Math.random() - 0.5) * 1.2 - 0.5;
      this.color= COLORS[Math.floor(Math.random() * COLORS.length)];
    }
    update() {
      this.x    += this.vx;
      this.y    += this.vy;
      this.life -= this.decay;
      this.r    += 0.08;
    }
    draw() {
      if (this.life <= 0) return;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
      ctx.strokeStyle = `${this.color}${(this.life * 0.6).toFixed(2)})`;
      ctx.lineWidth   = 1.2;
      ctx.stroke();
      // inner fill
      ctx.fillStyle   = `${this.color}${(this.life * 0.08).toFixed(2)})`;
      ctx.fill();
    }
  }

  let lastSpawn = 0;
  function spawnBubble(x, y) {
    if (bubbles.length < MAX) {
      bubbles.push(new Bubble(x, y));
    }
  }

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    const now = Date.now();
    if (now - lastSpawn > 40) {
      spawnBubble(mouseX, mouseY);
      lastSpawn = now;
    }
  });

  function loop() {
    ctx.clearRect(0, 0, W, H);
    for (let i = bubbles.length - 1; i >= 0; i--) {
      bubbles[i].update();
      bubbles[i].draw();
      if (bubbles[i].life <= 0) bubbles.splice(i, 1);
    }
    requestAnimationFrame(loop);
  }
  loop();

  window.addEventListener('resize', () => {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  });
})();

/* ─── 2. CUSTOM CURSOR ───────────────────────────────────── */
(function initCursor() {
  const dot  = document.getElementById('cursorDot');
  const ring = document.getElementById('cursorRing');
  if (!dot || !ring) return;

  let rx = 0, ry = 0;
  let mx = 0, my = 0;

  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    dot.style.left = mx + 'px';
    dot.style.top  = my + 'px';
  });

  function animateRing() {
    rx += (mx - rx) * 0.12;
    ry += (my - ry) * 0.12;
    ring.style.left = rx + 'px';
    ring.style.top  = ry + 'px';
    requestAnimationFrame(animateRing);
  }
  animateRing();

  const hoverTargets = document.querySelectorAll(
    'a, button, .skill-tag, .filter-btn, .project-card, .stat-card, .achievement-card, input, textarea'
  );
  hoverTargets.forEach(el => {
    el.addEventListener('mouseenter', () => ring.classList.add('hovered'));
    el.addEventListener('mouseleave', () => ring.classList.remove('hovered'));
  });

  document.addEventListener('mouseleave', () => {
    dot.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', () => {
    dot.style.opacity  = '1';
    ring.style.opacity = '1';
  });
})();

/* ─── 3. TYPED TEXT ──────────────────────────────────────── */
(function initTyped() {
  const el = document.getElementById('typedText');
  if (!el) return;

  const phrases = [
    'ISE Student @ VVCE',
    'Web Developer',
    'Python Enthusiast',
    'Problem Solver',
    'Hackathon Participant',
    'Full-Stack Explorer',
  ];

  let pi = 0, ci = 0, deleting = false;

  function type() {
    const phrase = phrases[pi];

    if (!deleting) {
      el.textContent = phrase.substring(0, ++ci);
      if (ci === phrase.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 75);
    } else {
      el.textContent = phrase.substring(0, --ci);
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 40);
    }
  }
  type();
})();

/* ─── 4. SCROLL REVEAL ───────────────────────────────────── */
(function initScrollReveal() {
  const items = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(entries => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        // stagger children within a parent
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, (entry.target.dataset.delay || 0));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  // add staggered delays to sibling groups
  const groups = [
    '.about-stats .stat-card',
    '.skills-grid .skill-category',
    '.projects-grid .project-card',
    '.achievements-grid .achievement-card',
    '.contact-links .contact-item',
    '.hero-content .reveal',
  ];

  groups.forEach(selector => {
    document.querySelectorAll(selector).forEach((el, i) => {
      if (!el.classList.contains('reveal')) el.classList.add('reveal');
      el.dataset.delay = i * 100;
    });
  });

  items.forEach(el => observer.observe(el));

  // also observe newly marked ones
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();

/* ─── 5. STICKY NAVBAR ───────────────────────────────────── */
(function initNavbar() {
  const navbar  = document.getElementById('navbar');
  const links   = document.querySelectorAll('.nav-link');
  const sections= document.querySelectorAll('section[id]');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    // active link highlight
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      if (window.scrollY >= top) current = sec.id;
    });
    links.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // smooth close on link click
  links.forEach(link => {
    link.addEventListener('click', () => {
      document.getElementById('navLinks').classList.remove('open');
      document.getElementById('hamburger').classList.remove('open');
    });
  });
})();

/* ─── 6. HAMBURGER MENU ──────────────────────────────────── */
(function initHamburger() {
  const btn   = document.getElementById('hamburger');
  const menu  = document.getElementById('navLinks');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    btn.classList.toggle('open');
    menu.classList.toggle('open');
  });

  // close on outside click
  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      btn.classList.remove('open');
      menu.classList.remove('open');
    }
  });
})();

/* ─── 7. PROJECT FILTER ──────────────────────────────────── */
(function initFilter() {
  const btns  = document.querySelectorAll('.filter-btn');
  const cards = document.querySelectorAll('.project-card');

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        const cat = card.dataset.category;
        const show = filter === 'all' || cat === filter;
        if (show) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeInCard 0.4s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // inject fade-in keyframes dynamically
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInCard {
      from { opacity: 0; transform: translateY(16px) scale(0.97); }
      to   { opacity: 1; transform: translateY(0) scale(1); }
    }
  `;
  document.head.appendChild(style);
})();

/* ─── 8. CONTACT FORM VALIDATION ────────────────────────── */
(function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  const submitBtn = document.getElementById('submitBtn');
  if (!form) return;

  function getField(id) { return document.getElementById(id); }
  function getError(id) { return document.getElementById(id + 'Error'); }

  function showError(id, msg) {
    const err = getError(id);
    if (err) {
      err.textContent = msg;
      err.style.opacity = '0';
      requestAnimationFrame(() => {
        err.style.transition = 'opacity 0.2s';
        err.style.opacity    = '1';
      });
    }
    const field = getField(id);
    if (field) {
      field.style.borderColor = 'var(--neon-red)';
      field.style.boxShadow   = '0 0 0 3px rgba(248,113,113,0.1)';
    }
  }

  function clearError(id) {
    const err = getError(id);
    if (err) err.textContent = '';
    const field = getField(id);
    if (field) {
      field.style.borderColor = '';
      field.style.boxShadow   = '';
    }
  }

  function validate() {
    let valid = true;

    // Name
    const name = getField('name').value.trim();
    if (!name) {
      showError('name', 'Please enter your name.'); valid = false;
    } else if (name.length < 2) {
      showError('name', 'Name must be at least 2 characters.'); valid = false;
    } else { clearError('name'); }

    // Email
    const email = getField('email').value.trim();
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) {
      showError('email', 'Please enter your email address.'); valid = false;
    } else if (!emailRe.test(email)) {
      showError('email', 'Please enter a valid email address.'); valid = false;
    } else { clearError('email'); }

    // Subject
    const subject = getField('subject').value.trim();
    if (!subject) {
      showError('subject', 'Please enter a subject.'); valid = false;
    } else { clearError('subject'); }

    // Message
    const message = getField('message').value.trim();
    if (!message) {
      showError('message', 'Please write your message.'); valid = false;
    } else if (message.length < 10) {
      showError('message', 'Message must be at least 10 characters.'); valid = false;
    } else { clearError('message'); }

    return valid;
  }

  // Live validation
  ['name','email','subject','message'].forEach(id => {
    const field = getField(id);
    if (field) {
      field.addEventListener('input', () => validate());
      field.addEventListener('blur', () => validate());
    }
  });

  form.addEventListener('submit', e => {
    e.preventDefault();
    if (!validate()) return;

    // simulate send
    submitBtn.disabled = true;
    const original = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';

    setTimeout(() => {
      submitBtn.disabled = false;
      submitBtn.innerHTML = original;
      form.reset();
      ['name','email','subject','message'].forEach(id => clearError(id));
      success.classList.add('show');
      setTimeout(() => success.classList.remove('show'), 5000);
    }, 1600);
  });
})();

/* ─── 9. GPA BAR ANIMATION ──────────────────────────────── */
(function initGpaBar() {
  const bar = document.querySelector('.gpa-fill');
  if (!bar) return;
  const observer = new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) {
      bar.style.animation = 'growBar 1.5s ease-out forwards';
      observer.disconnect();
    }
  }, { threshold: 0.5 });
  observer.observe(bar);
})();

/* ─── 10. CODE WINDOW TILT ON MOUSE MOVE ─────────────────── */
(function initTilt() {
  const win = document.querySelector('.code-window');
  if (!win) return;

  win.addEventListener('mousemove', e => {
    const rect = win.getBoundingClientRect();
    const cx   = rect.left + rect.width  / 2;
    const cy   = rect.top  + rect.height / 2;
    const dx   = (e.clientX - cx) / (rect.width  / 2);
    const dy   = (e.clientY - cy) / (rect.height / 2);
    win.style.transform = `rotateY(${dx * -8}deg) rotateX(${dy * 6}deg) scale(1.02)`;
  });
  win.addEventListener('mouseleave', () => {
    win.style.transform = '';
  });
})();

/* ─── 11. PARTICLE BACKGROUND AMBIENT BUBBLES ───────────── */
(function ambientBubbles() {
  const canvas = document.getElementById('bubbleCanvas');
  if (!canvas) return;

  function spawnAmbient() {
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const evt = new MouseEvent('mousemove', {
      clientX: x, clientY: y, bubbles: true
    });
    // directly add a bubble
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
  }
  // spawn a few ambient bubbles every few seconds
  setInterval(() => {
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        const fakeEvt = new MouseEvent('mousemove', {
          clientX: Math.random() * window.innerWidth,
          clientY: Math.random() * window.innerHeight,
          bubbles: true
        });
        document.dispatchEvent(fakeEvt);
      }, i * 120);
    }
  }, 3000);
})();

/* ─── 12. SMOOTH SCROLL FOR ANCHOR LINKS ─────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      const navH = document.getElementById('navbar').offsetHeight;
      const top  = target.getBoundingClientRect().top + window.scrollY - navH - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

/* ─── 13. COUNTER ANIMATION FOR STATS ──────────────────── */
(function initCounters() {
  const statNums = document.querySelectorAll('.stat-number');

  function animateCounter(el) {
    const raw    = el.textContent.trim();
    const isFloat= raw.includes('.');
    const suffix = raw.replace(/[\d.]/g, '');
    const target = parseFloat(raw);
    const start  = 0;
    const dur    = 1400;
    const step   = 16;
    const steps  = dur / step;
    let current  = start;
    const inc    = target / steps;

    const timer = setInterval(() => {
      current += inc;
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      el.textContent = (isFloat ? current.toFixed(2) : Math.floor(current)) + suffix;
    }, step);
  }

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  statNums.forEach(el => observer.observe(el));
})();

/* ─── 14. NAVBAR PROGRESS BAR ────────────────────────────── */
(function initProgressBar() {
  const bar = document.createElement('div');
  bar.style.cssText = `
    position: fixed;
    top: 0; left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #4ade80, #2dd4bf, #a3e635);
    z-index: 2000;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.appendChild(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docH      = document.body.scrollHeight - window.innerHeight;
    const pct       = docH > 0 ? (scrollTop / docH) * 100 : 0;
    bar.style.width = pct + '%';
  });
})();

console.log(
  '%c✨ Neha HK Portfolio loaded!',
  'color: #4ade80; font-size: 14px; font-weight: bold; background: #0a0f0d; padding: 6px 12px; border-radius: 4px;'
);
