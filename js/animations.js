/* ============================================================
   Animations — particules / pétales (canvas) + micro-utilitaires.
   Tout est GPU-friendly : transform/opacity.
   ============================================================ */

window.ANIM = (function () {
  const prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  /* ── Champs de pétales ─────────────────────────────────────── */
  class Petals {
    constructor(canvas, opts) {
      this.canvas = canvas;
      this.ctx = canvas.getContext('2d');
      this.opts = Object.assign({
        count: 18,
        color: null,          // null → palette définie plus bas
        speeds: [0.4, 1.1],
        sway: 1,
        petalSize: [6, 14],
        interactive: false
      }, opts || {});
      this.palette = ['#e6a8c0', '#d98ba6', '#f2c6d4', '#c97a94', '#eed9e0'];
      this.particles = [];
      this.running = false;
      this.raf = null;
      this.bind();
      this.resize();
    }

    bind() {
      this.onResize = this.resize.bind(this);
      window.addEventListener('resize', this.onResize);
    }

    resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = this.canvas.clientWidth;
      const h = this.canvas.clientHeight;
      this.canvas.width = w * dpr;
      this.canvas.height = h * dpr;
      this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      this.w = w;
      this.h = h;
    }

    spawn(initial) {
      const n = initial ? this.opts.count : 1;
      for (let i = 0; i < n; i++) {
        this.particles.push({
          x: Math.random() * this.w,
          y: initial ? Math.random() * this.h : -20,
          r: this.opts.petalSize[0] + Math.random() * (this.opts.petalSize[1] - this.opts.petalSize[0]),
          vy: this.opts.speeds[0] + Math.random() * (this.opts.speeds[1] - this.opts.speeds[0]),
          sway: this.opts.sway * (0.5 + Math.random()),
          phase: Math.random() * Math.PI * 2,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.04,
          color: this.opts.color || this.palette[Math.floor(Math.random() * this.palette.length)],
          alpha: 0.4 + Math.random() * 0.5
        });
      }
    }

    step() {
      const list = this.particles;
      for (let i = list.length - 1; i >= 0; i--) {
        const p = list[i];
        p.x += Math.sin(p.phase + p.y * 0.01) * p.sway * 0.6;
        p.y += p.vy;
        p.phase += 0.01;
        p.rot += p.vr;
        if (p.y > this.h + 30 || p.x < -30 || p.x > this.w + 30) {
          list.splice(i, 1);
          this.spawn(false);
        }
      }
    }

    draw() {
      const c = this.ctx;
      c.clearRect(0, 0, this.w, this.h);
      for (const p of this.particles) {
        c.save();
        c.globalAlpha = p.alpha;
        c.translate(p.x, p.y);
        c.rotate(p.rot);
        c.fillStyle = p.color;
        c.beginPath();
        c.ellipse(0, 0, p.r * 0.55, p.r, 0, 0, Math.PI * 2);
        c.fill();
        c.restore();
      }
    }

    loop() {
      if (!this.running) return;
      this.step();
      if (this.particles.length < Math.floor(this.opts.count * 0.8)) this.spawn(false);
      this.draw();
      this.raf = requestAnimationFrame(this.loop.bind(this));
    }

    start() {
      if (prefersReduced) return;
      this.running = true;
      this.resize();
      this.spawn(true);
      if (!this.raf) this.loop();
    }

    stop() {
      this.running = false;
      if (this.raf) { cancelAnimationFrame(this.raf); this.raf = null; }
      this.ctx.clearRect(0, 0, this.w, this.h);
    }

    destroy() {
      this.stop();
      window.removeEventListener('resize', this.onResize);
    }
  }

  /* ── Fenêtre utilisée pour instancier à la demande ─────────── */
  let petalsInstances = [];

  function startPetals(canvas, opts) {
    const p = new Petals(canvas, opts);
    p.start();
    petalsInstances.push(p);
    return p;
  }

  function stopAllPetals() {
    petalsInstances.forEach(function (p) { p.stop(); });
  }

  /* ── Apparition des lettres (reveal progressif) ────────────── */
  function revealText(el, opts) {
    const o = Object.assign({ duration: 900, delay: 0 }, opts || {});
    if (prefersReduced) {
      el.classList.add('is-visible');
      return Promise.resolve();
    }
    return new Promise(function (resolve) {
      el.classList.add('reveal-enter');
      setTimeout(function () {
        el.classList.add('is-visible');
        setTimeout(resolve, o.duration);
      }, o.delay);
    });
  }

  /* ── Fondu de sortie d'un écran ────────────────────────────── */
  function fadeOutScreen(screen, ms) {
    const d = ms || 450;
    return new Promise(function (resolve) {
      if (prefersReduced) { screen.classList.remove('screen-active'); resolve(); return; }
      screen.classList.remove('screen-active');
      setTimeout(resolve, d);
    });
  }

  function fadeInScreen(screen) {
    screen.classList.add('screen-active');
  }

  /* ── Utilitaire : attendre des millisecondes ───────────────── */
  function wait(ms) {
    return new Promise(function (r) { setTimeout(r, ms); });
  }

  return {
    prefersReduced,
    Petals,
    startPetals,
    stopAllPetals,
    revealText,
    fadeOutScreen,
    fadeInScreen,
    wait
  };
})();