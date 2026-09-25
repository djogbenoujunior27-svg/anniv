/* ============================================================
   Les 56 roses — apparition progressive, bouquet final.
   Chaque rose est un élément DOM (SVG) animé en CSS.
   ============================================================ */

window.ROSES = (function () {
  const prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Génération des 56 positions du bouquet (polaires → cartésien)
  function generateBouquetPositions() {
    const positions = [];
    // Utilise un seed pour cohérence — mais évite le RANDOMIZER pour ne pas
    // dépendre de l'ordre de chargement. Seed fixe pour reproductibilité.
    let seed = 0xB1A7; // seed simple
    const rand = function () {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return seed / 0x100000000;
    };

    // 56 roses : réparties en couches concentriques +散点
    // Coeurs : 1 centre
    // Anneau 1 : 5 roses (r=0.18)
    // Anneau 2 : 10 roses (r=0.32)
    // Anneau 3 : 16 roses (r=0.48)
    // Anneau 4 : 24 roses (r=0.66) → total = 1+5+10+16+24 = 56
    const rings = [
      { count: 1, r: 0.0 },
      { count: 5, r: 0.18 },
      { count: 10, r: 0.32 },
      { count: 16, r: 0.48 },
      { count: 24, r: 0.66 }
    ];

    rings.forEach(function (ring) {
      for (let i = 0; i < ring.count; i++) {
        const angle = (i / ring.count) * Math.PI * 2 + rand() * 0.12;
        const rad = ring.r * (0.9 + rand() * 0.2);
        const x = Math.cos(angle) * rad;
        const y = Math.sin(angle) * rad;
        positions.push({
          x: x,
          y: y,
          scale: 0.85 + rand() * 0.35,
          rot: rand() * 360,
          z: Math.floor(rand() * 100),
          delay: rand() * 0.3
        });
      }
    });

    // 56 exactement
    if (positions.length !== 56) {
      console.warn('Bouquet positions count:', positions.length);
    }
    return positions;
  }

  const POSITIONS = generateBouquetPositions();

  // Fleur SVG autonome et remplaçable par MEDIA.flowers.sources si des
  // références PNG transparentes sont ajoutées ultérieurement.
  function roseSVG(variant) {
    const palettes = [
      ['#f4c5d2', '#df91ad', '#b96887'],
      ['#f0b4c7', '#d97d9f', '#a95d7d'],
      ['#f7d4dc', '#e7a1b5', '#c77893']
    ];
    const palette = palettes[(variant || 0) % palettes.length];
    return '<svg viewBox="0 0 100 100" class="rose-svg" aria-hidden="true">' +
      '<path d="M48 88 C43 73 45 61 51 52" fill="none" stroke="#78956f" stroke-width="4" stroke-linecap="round"/>' +
      '<path d="M48 70 C37 64 30 67 27 74 C36 79 43 78 48 70Z" fill="#9dbb91"/>' +
      '<path d="M51 58 C62 52 70 55 73 63 C64 67 57 65 51 58Z" fill="#88ab82"/>' +
      '<path d="M50 58 C35 57 25 48 26 36 C27 23 38 14 50 16 C62 14 73 23 74 36 C75 48 65 57 50 58Z" fill="' + palette[0] + '"/>' +
      '<path d="M50 53 C39 52 32 45 33 35 C34 26 41 21 50 23 C59 21 66 26 67 35 C68 45 61 52 50 53Z" fill="' + palette[1] + '"/>' +
      '<path d="M50 47 C43 47 39 42 40 36 C41 30 45 27 50 29 C55 27 59 30 60 36 C61 42 57 47 50 47Z" fill="' + palette[2] + '"/>' +
      '<path d="M50 41 C46 41 44 38 45 35 C46 32 48 31 50 33 C52 31 54 32 55 35 C56 38 54 41 50 41Z" fill="' + palette[0] + '"/>' +
      '<path d="M31 28 C38 22 42 20 47 20 M69 28 C62 22 58 20 53 20" fill="none" stroke="rgba(255,255,255,.45)" stroke-width="2" stroke-linecap="round"/>' +
      '</svg>';
  }

  // Roses individuelles (petites) pour les lettres
  function createLetterRose(index, opts) {
    const el = document.createElement('div');
    el.className = 'letter-rose' + (opts && opts.bloomed ? ' is-bloomed' : '');
    el.innerHTML = roseSVG(index);
    el.style.setProperty('--rot', (opts && opts.rot) || (index * 37) + 'deg');
    el.style.setProperty('--scale', (opts && opts.scale) || (0.7 + (index % 3) * 0.15));
    return el;
  }

  // Étape progressive du bouquet : on révèle par "vagues"
  // Vagues : 1 → 5 → 12 → 21 → 35 → 45 → 56
  const WAVES = [1, 5, 12, 21, 35, 45, 56];

  function renderBouquet(container) {
    container.innerHTML = '';
    container.className = 'bouquet';

    const center = document.createElement('div');
    center.className = 'bouquet__center';
    container.appendChild(center);

    POSITIONS.forEach(function (pos, i) {
      const r = document.createElement('div');
      r.className = 'bouquet-rose';
      // Quelques fleurs seulement tombent en cascade pour garder un rythme
      // naturel, au lieu de faire tomber les 56 roses de façon uniforme.
      if ((i + 1) % 4 === 0 || i === 7 || i === 31 || i === 50) {
        r.classList.add('cascade');
        r.style.setProperty('--fall-x', ((i % 5) - 2) * 18 + 'px');
        r.style.setProperty('--fall-y', (120 + (i % 4) * 35) + 'px');
        r.style.setProperty('--fall-rot', ((i % 2 ? 1 : -1) * (12 + (i % 3) * 8)) + 'deg');
      }
      if (MEDIA.flowers && MEDIA.flowers.sources && MEDIA.flowers.sources.length) {
        const source = MEDIA.flowers.sources[i % MEDIA.flowers.sources.length];
        r.innerHTML = '<img class="rose-asset" src="' + source + '" alt="" aria-hidden="true">';
      } else {
        r.innerHTML = roseSVG(i);
      }
      r.style.setProperty('--tx', (pos.x * 42).toFixed(2) + '%');
      r.style.setProperty('--ty', (pos.y * 42).toFixed(2) + '%');
      r.style.setProperty('--scale', pos.scale.toFixed(2));
      r.style.setProperty('--rot', pos.rot.toFixed(1) + 'deg');
      r.style.setProperty('--z', pos.z);
      r.style.setProperty('--delay', pos.delay.toFixed(2) + 's');
      r.dataset.index = i + 1;
      center.appendChild(r);
    });

    return container;
  }

  // Animation d'apparition par vagues
  function bloomWaves(bouquetEl, onWave, onComplete) {
    const roses = bouquetEl.querySelectorAll('.bouquet-rose');
    if (prefersReduced) {
      roses.forEach(function (r) { r.classList.add('is-visible'); });
      if (onComplete) onComplete();
      return Promise.resolve();
    }

    let waveIdx = 0;
    function nextWave() {
      if (waveIdx >= WAVES.length) {
        if (onComplete) onComplete();
        return;
      }
      const target = WAVES[waveIdx];
      for (let i = 0; i < target; i++) {
        const r = roses[i];
        if (r) {
          const d = (i * 0.04 + parseFloat(r.style.getPropertyValue('--delay') || '0'));
          r.style.transitionDelay = d + 's';
          r.classList.add('is-visible');
        }
      }
      if (onWave) onWave(target);
      waveIdx++;
      // durée de la vague = 0.8s + délai max
      setTimeout(nextWave, 800);
    }
    nextWave();
  }

  // Compteur de roses collectées (affiché pendant les lettres)
  function updateCounter(el, count) {
    if (!el) return;
    el.textContent = count + ' / 56';
    el.classList.add('pulse');
    setTimeout(function () { el.classList.remove('pulse'); }, 300);
  }

  return {
    WAVES: WAVES,
    POSITIONS: POSITIONS,
    createLetterRose: createLetterRose,
    renderBouquet: renderBouquet,
    bloomWaves: bloomWaves,
    updateCounter: updateCounter,
    roseSVG: roseSVG
  };
})();