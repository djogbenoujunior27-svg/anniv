/* ============================================================
   Interactions — chaque lettre est une petite expérience à soi.
   Types implémentés :
   peel-envelope · tap-rose · tap-flowers · hold-pulse · tap-photo
   collect-petals · drag-light · tap-points · trace-reveal
   rotate-dial · discover-tap · gate-rose
   ============================================================ */

window.INTERACTIONS = (function () {

  const prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  const emphasis = function (s) {
    return "<em>" + s + "</em>";
  };

  function rand(min, max) { return min + Math.random() * (max - min); }

  function button(label, onclick) {
    const b = document.createElement('button');
    b.className = 'ix-button';
    b.textContent = label;
    b.addEventListener('click', onclick);
    return b;
  }

  /* Peint chaque type d'interaction dans un container. */
  function render(type, container, onComplete) {
    const hint = document.createElement('p');
    hint.className = 'ix-hint';
    const stage = document.createElement('div');
    stage.className = 'ix-stage is-' + type;

    container.innerHTML = '';
    container.appendChild(hint);
    container.appendChild(stage);

    const done = function () {
      if (prefersReduced) { completeNow(container, onComplete); return; }
      container.classList.add('is-complete');
      setTimeout(function () { completeNow(container, onComplete); }, 500);
    };

    const delegates = {
      'peel-envelope': envPeel,
      'tap-rose': tapRose,
      'tap-flowers': tapFlowers,
      'hold-pulse': holdPulse,
      'tap-photo': tapPhoto,
      'collect-petals': collectPetals,
      'drag-light': dragLight,
      'tap-points': tapPoints,
      'trace-reveal': traceReveal,
      'rotate-dial': rotateDial,
      'discover-tap': discoverTap,
      'gate-rose': gateRose
    };

    const factory = delegates[type];
    if (!factory) {
      hint.textContent = 'Touche pour continuer.';
      stage.appendChild(button('Continuer', done));
      return;
    }
    factory(stage, hint, done);
  }

  function completeNow(container, onComplete) {
    if (container.dataset.done) return;
    container.dataset.done = '1';
    if (typeof onComplete === 'function') onComplete();
  }

  /* ── 1. Enveloppe : on la soulève pour l'ouvrir ─────────────── */
  function envPeel(stage, hint, done) {
    hint.innerHTML = emphasis('Soulève l\'enveloppe') + ' pour l\'ouvrir';
    stage.classList.add('env');
    stage.innerHTML =
      '<div class="env__feather"></div>' +
      '<div class="env__body">' +
      '  <div class="env__flap"></div>' +
      '  <div class="env__seal"></div>' +
      '</div>';

    const body = stage.querySelector('.env__body');
    const flap = stage.querySelector('.env__flap');
    const seal = stage.querySelector('.env__seal');
    let dragging = false;
    let startY = 0;
    let pulled = 0;
    const THRESHOLD = 110;

    body.addEventListener('pointerdown', function (e) {
      dragging = true;
      startY = e.clientY;
      body.setPointerCapture(e.pointerId);
    });
    body.addEventListener('pointermove', function (e) {
      if (!dragging) return;
      pulled = Math.max(0, Math.min(THRESHOLD, startY - e.clientY));
      body.style.transform = 'translateY(' + (-pulled * 0.65) + 'px)';
      flap.style.transform = 'rotateX(' + (-pulled * 1.4) + 'deg)';
    });
    ['pointerup', 'pointercancel'].forEach(function (ev) {
      body.addEventListener(ev, function () {
        if (!dragging) return;
        dragging = false;
        if (pulled >= THRESHOLD) {
          body.style.transform = 'translateY(-80px)';
          flap.style.transform = 'rotateX(-160deg)';
          seal.classList.add('is-open');
          stage.classList.add('is-open');
          done();
        } else {
          body.style.transform = '';
          flap.style.transform = '';
        }
        pulled = 0;
      });
    });
  }

  /* ── 2. Rose : on la touche pour qu'elle s'épanouisse ───────── */
  function tapRose(stage, hint, done) {
    hint.innerHTML = emphasis('Touche la rose');
    stage.classList.add('one-rose');
    stage.innerHTML = '<button class="rose-button" aria-label="toucher la rose"></button>';
    const btn = stage.querySelector('.rose-button');
    btn.addEventListener('click', function () {
      btn.classList.add('is-bloomed');
      setTimeout(done, 350);
    });
  }

  /* ── 3. Fleurs éparses à toucher ────────────────────────────── */
  function tapFlowers(stage, hint, done) {
    const n = 3;
    hint.innerHTML = emphasis('Touche les ' + n + ' fleurs');
    stage.classList.add('flower-field');
    for (let i = 0; i < n; i++) {
      const f = document.createElement('button');
      f.className = 'flower i' + (i + 1);
      f.setAttribute('aria-label', 'fleur');
      f.style.left = rand(8, 82) + '%';
      f.style.top = rand(12, 82) + '%';
      f.style.animationDelay = rand(0, 0.8) + 's';
      f.addEventListener('click', function () {
        if (f.classList.contains('picked')) return;
        f.classList.add('picked');
        const left = stage.querySelectorAll('.flower:not(.picked)').length;
        if (left === 0) setTimeout(done, 350);
      }, { once: false });
      stage.appendChild(f);
    }
  }

  /* ── 4. Presser et tenir jusqu'à pleine lueur ───────────────── */
  function holdPulse(stage, hint, done) {
    hint.innerHTML = emphasis('Maintiens le doigt sur la fleur') + ' jusqu\'au bout';
    stage.classList.add('pulse');
    stage.innerHTML =
      '<div class="pulse__ring"></div>' +
      '<button class="pulse__core" aria-label="maintenir"></button>';
    const ring = stage.querySelector('.pulse__ring');
    const core = stage.querySelector('.pulse__core');
    let t = 0;
    let raf = null;
    const DURATION = 1700;

    function tick(start) {
      t = performance.now() - start;
      const p = Math.min(1, t / DURATION);
      ring.style.transform = 'scale(' + (0.2 + p * 0.8) + ')';
      ring.style.opacity = '1';
      core.classList.toggle('is-full', p >= 1);
      if (p >= 1) {
        cancelAnimationFrame(raf); raf = null;
        stage.classList.add('is-full');
        setTimeout(done, 250);
        return;
      }
      raf = requestAnimationFrame(function () { tick(start); });
    }

    core.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      const start = performance.now();
      tick(start);
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      core.addEventListener(ev, function () {
        if (raf) { cancelAnimationFrame(raf); raf = null; }
        ring.style.opacity = '0';
        core.classList.remove('is-full');
      });
    });
  }

  /* ── 5. Photo : un toucher suffit ───────────────────────────── */
  function tapPhoto(stage, hint, done) {
    hint.innerHTML = emphasis('Touche la photo');
    stage.classList.add('tap-photo');
    const p = document.createElement('button');
    p.className = 'tap-photo__frame';
    const imgLoader = document.createElement('img');
    applyPhoto(imgLoader, 'PLACEHOLDER_PHOTO_05').then(function (img) {
      p.appendChild(img);
    });
    p.appendChild(document.createElement('span')).className = 'tap-photo__veil';
    p.addEventListener('click', function () {
      p.classList.add('is-touched');
      done();
    });
    stage.appendChild(p);
    hint.insertAdjacentHTML('afterend', '<div class="tap-photo__wrap"></div>');
    stage.parentNode.querySelector('.tap-photo__wrap').appendChild(p);
  }

  /* ── 6. Attraper 5 pétales qui tombent ──────────────────────── */
  function collectPetals(stage, hint, done) {
    const need = 5;
    hint.innerHTML = emphasis('Attrape ' + need + ' pétales') + ' qui tombent';
    stage.classList.add('petal-catch');
    let caught = 0;
    const counter = document.createElement('div');
    counter.className = 'ix-counter';
    counter.textContent = '0 / ' + need;
    stage.appendChild(counter);

    function spawn() {
      const p = document.createElement('button');
      p.className = 'falling-petal';
      p.setAttribute('aria-label', 'pétale');
      const dur = rand(3.4, 6) + 's';
      p.style.left = rand(4, 92) + '%';
      p.style.animationDuration = dur;
      p.style.animationDelay = rand(-1.5, 0) + 's';
      p.style.setProperty('--sway', rand(20, 60) + 'px');
      p.style.setProperty('--petal-rotate', rand(180, 540) + 'deg');
      p.addEventListener('click', function () {
        if (p.classList.contains('caught')) return;
        p.classList.add('caught');
        caught++;
        counter.textContent = caught + ' / ' + need;
        if (caught >= need) setTimeout(done, 250);
      });
      stage.appendChild(p);
      setTimeout(function () { if (p.isConnected) p.remove(); }, (parseFloat(dur) + 1.6) * 1000);
    }
    for (let i = 0; i < 9; i++) spawn();
    setInterval(function () {
      if (stage.isConnected && !stage.classList.contains('is-complete')) spawn();
    }, 1200);
  }

  /* ── 7. Glisser la lumière sur la fleur ─────────────────────── */
  function dragLight(stage, hint, done) {
    hint.innerHTML = emphasis('Glisse la lumière') + ' sur la fleur';
    stage.classList.add('light-drag');
    stage.innerHTML =
      '<div class="light__target"></div>' +
      '<button class="light__orb" aria-label="lumière"></button>';
    const orb = stage.querySelector('.light__orb');
    const target = stage.querySelector('.light__target');
    let ox = 0, oy = 0;

    function center() {
      const r = orb.getBoundingClientRect();
      ox = r.left + r.width / 2;
      oy = r.top + r.height / 2;
    }

    orb.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      orb.setPointerCapture(e.pointerId);
      orb.classList.add('is-dragging');
      center();
      const onMove = function (e) {
        const x = e.clientX - ox;
        const y = e.clientY - oy;
        orb.style.transform = 'translate(' + x + 'px,' + y + 'px)';
        center();
        const t = target.getBoundingClientRect();
        const tx = t.left + t.width / 2;
        const ty = t.top + t.height / 2;
        const dist = Math.hypot(tx - ox, ty - oy);
        if (dist < 70) {
          orb.style.transform = '';
          orb.classList.remove('is-dragging');
          target.classList.add('is-lit');
          stage.classList.add('is-complete');
          setTimeout(done, 400);
        }
      };
      const onUp = function () {
        if (orb.classList.contains('is-dragging')) {
          orb.style.transform = '';
          orb.classList.remove('is-dragging');
        }
        orb.removeEventListener('pointermove', onMove);
        orb.removeEventListener('pointerup', onUp);
        orb.removeEventListener('pointercancel', onUp);
      };
      orb.addEventListener('pointermove', onMove);
      orb.addEventListener('pointerup', onUp);
      orb.addEventListener('pointercancel', onUp);
    });
  }

  /* ── 8. Toucher les points dans l'ordre ─────────────────────── */
  function tapPoints(stage, hint, done) {
    hint.innerHTML = emphasis('Touche les points') + ' dans l\'ordre';
    stage.classList.add('points');
    const n = 4;
    let current = 0;
    for (let i = 0; i < n; i++) {
      const pt = document.createElement('button');
      pt.className = 'point';
      pt.dataset.n = i + 1;
      pt.style.left = rand(12, 82) + '%';
      pt.style.top = rand(14, 78) + '%';
      pt.style.animationDelay = (i * 0.25) + 's';
      pt.addEventListener('click', function () {
        if (parseInt(pt.dataset.n, 10) === current + 1) {
          pt.classList.add('lit');
          current++;
          if (current >= n) setTimeout(done, 300);
        } else {
          pt.classList.add('shiver');
          setTimeout(function () { pt.classList.remove('shiver'); }, 400);
        }
      });
      stage.appendChild(pt);
    }
  }

  /* ── 9. Tracer le long du chemin ────────────────────────────── */
  function traceReveal(stage, hint, done) {
    hint.innerHTML = emphasis('Suis le chemin') + ' du bout du doigt';
    stage.classList.add('trace');
    stage.innerHTML =
      '<svg class="trace__svg" viewBox="0 0 260 60" preserveAspectRatio="none">' +
      '  <path class="trace__base" d="M6 30 C 50 -10, 90 70, 130 32 S 210 10, 254 30" />' +
      '  <path class="trace__line" d="M6 30 C 50 -10, 90 70, 130 32 S 210 10, 254 30" />' +
      '</svg>' +
      '<div class="trace__brush"></div>';
    const line = stage.querySelector('.trace__line');
    const brush = stage.querySelector('.trace__brush');
    let pathLength = 300;
    let doneProg = 0;

    function drawProgress() {
      line.style.strokeDasharray = pathLength;
      line.style.strokeDashoffset = pathLength * (1 - doneProg);
      const pt = line.getPointAtLength(Math.max(0.001, doneProg * pathLength));
      const rect = line.getBoundingClientRect();
      const s = rect.width / 260;
      brush.style.transform = 'translate(' + (pt.x * s) + 'px,' + (pt.y * s) + 'px)';
    }

    stage.addEventListener('pointerdown', function () {
      stage.classList.add('is-tracing');
    });
    stage.addEventListener('pointermove', function (e) {
      if (!stage.classList.contains('is-tracing')) return;
      let progressed = false;
      const rect = line.getBoundingClientRect();
      const s = rect.width / 260;
      for (let i = 0; i < 8; i++) {
        const t = doneProg + (i + 1) * 0.04;
        if (t > 1) break;
        const pt = line.getPointAtLength(t * pathLength);
        const px = pt.x * s + rect.left;
        const py = pt.y * s + rect.top;
        const dist = Math.hypot(px - e.clientX, py - e.clientY);
        if (dist < 38) { doneProg = t; progressed = true; }
      }
      if (progressed && doneProg >= 0.96) {
        doneProg = 1;
        stage.classList.remove('is-tracing');
        drawProgress();
        setTimeout(done, 250);
        return;
      }
      drawProgress();
    });
    ['pointerup', 'pointercancel', 'pointerleave'].forEach(function (ev) {
      stage.addEventListener(ev, function () { stage.classList.remove('is-tracing'); });
    });
    stage.addEventListener('pointerdown', function () {
      try { pathLength = line.getTotalLength() || 300; } catch (e) { pathLength = 300; }
      drawProgress();
    });
    try { pathLength = line.getTotalLength() || 300; } catch (e) { pathLength = 300; }
    drawProgress();
  }

  /* ── 10. Faire tourner le disque ────────────────────────────── */
  function rotateDial(stage, hint, done) {
    hint.innerHTML = emphasis('Fais tourner le disque');
    stage.classList.add('dial');
    stage.innerHTML =
      '<div class="dial__meter"><span></span></div>' +
      '<div class="dial__disc" role="slider" aria-label="disque"></div>';
    const disc = stage.querySelector('.dial__disc');
    const meter = stage.querySelector('.dial__meter span');
    let total = 0;
    let lastAngle = null;
    const NEED = 260;

    function angleOf(e) {
      const r = disc.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      return Math.atan2(e.clientY - cy, e.clientX - cx) * 180 / Math.PI;
    }

    disc.addEventListener('pointerdown', function (e) {
      e.preventDefault();
      disc.setPointerCapture(e.pointerId);
      lastAngle = angleOf(e);
      const onMove = function (e) {
        const a = angleOf(e);
        let d = a - lastAngle;
        if (d > 180) d -= 360;
        if (d < -180) d += 360;
        total += d;
        lastAngle = a;
        disc.style.transform = 'rotate(' + total + 'deg)';
        const p = Math.min(1, total / NEED);
        meter.style.transform = 'scaleY(' + p + ')';
        if (total >= NEED) {
          disc.setPointerCapture(e.pointerId);
          disc.removeEventListener('pointermove', onMove);
          stage.classList.add('is-complete');
          setTimeout(done, 350);
        }
      };
      const onUp = function () {
        disc.removeEventListener('pointermove', onMove);
        disc.removeEventListener('pointerup', onUp);
        disc.removeEventListener('pointercancel', onUp);
      };
      disc.addEventListener('pointermove', onMove);
      disc.addEventListener('pointerup', onUp);
      disc.addEventListener('pointercancel', onUp);
    });
  }

  /* ── 11. Trouver la fleur qui brille ────────────────────────── */
  function discoverTap(stage, hint, done) {
    hint.innerHTML = emphasis('Trouve la fleur qui brille') + ' un peu';
    stage.classList.add('discover');
    const n = 6;
    const good = Math.floor(Math.random() * n);
    for (let i = 0; i < n; i++) {
      const f = document.createElement('button');
      f.className = 'flower discover-flower' + (i === good ? ' is-good' : '');
      f.setAttribute('aria-label', 'fleur');
      f.style.left = (8 + (i % 3) * 30) + '%';
      f.style.top = (15 + Math.floor(i / 3) * 42) + '%';
      f.addEventListener('click', function () {
        if (i === good) {
          f.classList.add('is-found');
          setTimeout(done, 350);
        } else {
          f.classList.add('is-wrong');
          setTimeout(function () { f.classList.remove('is-wrong'); }, 400);
        }
      });
      stage.appendChild(f);
    }
  }

  /* ── 12. La porte des roses (dernière lettre) ───────────────── */
  function gateRose(stage, hint, done) {
    hint.innerHTML = emphasis('Touche la rose') + ' pour ouvrir la suite';
    stage.classList.add('gate');
    stage.innerHTML =
      '<div class="gate__halo"></div>' +
      '<button class="rose-button rose-button--large" aria-label="ouvrir"></button>';
    const btn = stage.querySelector('.rose-button');
    btn.addEventListener('click', function () {
      btn.classList.add('is-bloomed');
      stage.classList.add('is-open');
      setTimeout(done, 650);
    });
  }

  /* ── Utilitaire photo avec fallback élégant ─────────────────── */
  function applyPhoto(img, name) {
    let src = '';
    if (name && name.indexOf('PLACEHOLDER') !== 0) {
      src = (window.MEDIA && MEDIA.photos.byName && MEDIA.photos.byName[name]) || '';
    }
    if (src) {
      return new Promise(function (resolve) {
        img.onload = function () { img.classList.add('is-loaded'); resolve(img); };
        img.onerror = function () { img.classList.add('is-fallback'); resolve(img); };
        img.src = src;
      });
    }
    img.classList.add('is-fallback');
    return Promise.resolve(img);
  }

  return {
    render: render,
    applyPhoto: applyPhoto
  };
})();