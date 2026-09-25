/* ============================================================
   Souvenirs — Memory Capsules interactives.
   Photos/vidéos de couple, timeline visuelle, ouverture modale.
   ============================================================ */

window.MEMORIES = (function () {
  const prefersReduced = window.matchMedia
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false;

  // Données de base (sera remplacé par memories.json si disponible)
  const DEFAULT_MEMORIES = [
    {
      id: 1,
      title: 'Notre premier voyage',
      date: 'Mars 2024',
      type: 'photo',
      media: 'PLACEHOLDER_MEMORY_01',
      anecdote: 'On a raté le train, on a ri pendant 20 minutes sur le quai. C\'est là que j\'ai su.'
    },
    {
      id: 2,
      title: 'Le soir où tu as cuisiné',
      date: 'Juillet 2024',
      type: 'photo',
      media: 'PLACEHOLDER_MEMORY_02',
      anecdote: 'Tu as mis le feu aux pâtes. Littéralement. Je n\'avais jamais vu quelqu\'un être aussi fier d\'un désastre.'
    },
    {
      id: 3,
      title: 'Cette vidéo du parc',
      date: 'Octobre 2024',
      type: 'video',
      media: 'PLACEHOLDER_MEMORY_03',
      poster: 'PLACEHOLDER_MEMORY_03_poster',
      anecdote: 'Tu courrais après les pigeons. Tu as trébuché. Je n\'ai pas coupé l\'enregistrement.'
    },
    {
      id: 4,
      title: 'Noël 2024',
      date: 'Décembre 2024',
      type: 'photo',
      media: 'PLACEHOLDER_MEMORY_04',
      anecdote: 'Le pull moche que tu m\'as offert. Je le porte encore quand tu n\'es pas là.'
    },
    {
      id: 5,
      title: 'Le matin de tes 20 ans',
      date: 'Septembre 2025',
      type: 'photo',
      media: 'PLACEHOLDER_MEMORY_05',
      anecdote: 'Tu as ouvert les yeux et ton premier mot a été "ça fait mal". Joyeux anniversaire quand même.'
    },
    {
      id: 6,
      title: 'Notre chanson',
      date: 'Janvier 2025',
      type: 'photo',
      media: 'PLACEHOLDER_MEMORY_06',
      anecdote: 'Celle qu\'on écoute en boucle quand il pleut. Tu connais la suite.'
    }
  ];

  // Tente de charger memories.json, sinon défaut
  async function load() {
    try {
      const res = await fetch('data/memories.json', { cache: 'no-store' });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length) return data;
      }
    } catch (e) {
      // silencieux — on utilise les défauts
    }
    return DEFAULT_MEMORIES;
  }

  // Applique une photo avec fallback élégant
  function applyMedia(imgOrVideo, mem) {
    const isVideo = mem.type === 'video';
    if (isVideo) {
      const video = imgOrVideo;
      video.preload = 'none';
      video.playsInline = true;
      video.controls = true;
      const src = mem.media && mem.media.indexOf('PLACEHOLDER') !== 0
        ? 'assets/photos/memories/' + mem.media + '.mp4'
        : '';
      if (src) {
        video.src = src;
        if (mem.poster) {
          const posterSrc = 'assets/photos/memories/' + mem.poster + '.jpg';
          video.poster = posterSrc;
        }
        video.onerror = function () { showFallback(video, mem); };
      } else {
        showFallback(video, mem);
      }
      return Promise.resolve(video);
    } else {
      const img = imgOrVideo;
      const src = mem.media && mem.media.indexOf('PLACEHOLDER') !== 0
        ? 'assets/photos/memories/' + mem.media + '.jpg'
        : '';
      if (src) {
        return new Promise(function (resolve) {
          img.onload = function () { img.classList.add('is-loaded'); resolve(img); };
          img.onerror = function () { showFallback(img, mem); resolve(img); };
          img.src = src;
        });
      }
      showFallback(img, mem);
      return Promise.resolve(img);
    }
  }

  function showFallback(el, mem) {
    el.classList.add('is-fallback');
    el.style.background = 'linear-gradient(135deg, #2a1f3d 0%, #1a1428 100%)';
    el.innerHTML = '<span class="mem-fallback-label">' + (mem.title || 'Souvenir') + '</span>';
  }

  // Rend la timeline (capsules horizontales scrollables)
  function renderTimeline(container, memories) {
    container.innerHTML = '';
    container.className = 'memories-timeline';

    const track = document.createElement('div');
    track.className = 'memories-track';
    container.appendChild(track);

    memories.forEach(function (mem, idx) {
      const capsule = document.createElement('button');
      capsule.className = 'memory-capsule';
      capsule.dataset.id = mem.id;
      capsule.setAttribute('aria-label', mem.title + ', ' + mem.date);

      // Thumbnail
      const thumb = document.createElement('div');
      thumb.className = 'capsule-thumb';
      if (mem.type === 'video') {
        const v = document.createElement('video');
        v.muted = true;
        v.playsInline = true;
        v.loop = true;
        applyMedia(v, mem).then(function () {
          v.play().catch(function () {});
        });
        thumb.appendChild(v);
      } else {
        const img = document.createElement('img');
        img.loading = 'lazy';
        applyMedia(img, mem);
        thumb.appendChild(img);
      }
      capsule.appendChild(thumb);

      // Badge type
      const badge = document.createElement('span');
      badge.className = 'capsule-badge';
      badge.textContent = mem.type === 'video' ? '▶' : '📷';
      capsule.appendChild(badge);

      // Infos
      const info = document.createElement('div');
      info.className = 'capsule-info';
      info.innerHTML =
        '<time class="capsule-date">' + mem.date + '</time>' +
        '<h3 class="capsule-title">' + mem.title + '</h3>';
      capsule.appendChild(info);

      capsule.addEventListener('click', function () { openCapsule(mem, memories); });
      track.appendChild(capsule);
    });

    // Indicateurs de scroll
    const scrollHint = document.createElement('div');
    scrollHint.className = 'timeline-scroll-hint';
    scrollHint.innerHTML = '<span>← Faites glisser pour explorer →</span>';
    container.appendChild(scrollHint);

    // Auto-hide hint après interaction
    let hintHidden = false;
    container.addEventListener('scroll', function () {
      if (!hintHidden) { scrollHint.classList.add('hidden'); hintHidden = true; }
    }, { passive: true });

    return container;
  }

  // Ouvre la capsule en modal plein écran
  function openCapsule(mem, allMemories) {
    const overlay = document.createElement('div');
    overlay.className = 'memory-modal';
    overlay.innerHTML =
      '<button class="modal-close" aria-label="Fermer">✕</button>' +
      '<div class="modal-content"></div>' +
      '<nav class="modal-nav">' +
      '  <button class="modal-prev" aria-label="Précédent">‹</button>' +
      '  <button class="modal-next" aria-label="Suivant">›</button>' +
      '</nav>' +
      '<div class="modal-anecdote"></div>';

    document.body.appendChild(overlay);
    document.body.style.overflow = 'hidden';

    const content = overlay.querySelector('.modal-content');
    const anecdote = overlay.querySelector('.modal-anecdote');
    let currentIdx = allMemories.findIndex(function (m) { return m.id === mem.id; });

    function renderCurrent() {
      const m = allMemories[currentIdx];
      content.innerHTML = '';
      if (m.type === 'video') {
        const v = document.createElement('video');
        v.controls = true;
        v.playsInline = true;
        applyMedia(v, m);
        content.appendChild(v);
      } else {
        const img = document.createElement('img');
        applyMedia(img, m);
        content.appendChild(img);
      }
      anecdote.textContent = m.anecdote || '';
      overlay.querySelector('.modal-prev').disabled = currentIdx === 0;
      overlay.querySelector('.modal-next').disabled = currentIdx === allMemories.length - 1;
    }

    renderCurrent();

    const close = function () {
      overlay.classList.add('closing');
      setTimeout(function () {
        overlay.remove();
        document.body.style.overflow = '';
      }, prefersReduced ? 0 : 300);
    };

    overlay.querySelector('.modal-close').addEventListener('click', close);
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) close();
    });

    overlay.querySelector('.modal-prev').addEventListener('click', function () {
      if (currentIdx > 0) { currentIdx--; renderCurrent(); }
    });
    overlay.querySelector('.modal-next').addEventListener('click', function () {
      if (currentIdx < allMemories.length - 1) { currentIdx++; renderCurrent(); }
    });

    document.addEventListener('keydown', function onKey(e) {
      if (e.key === 'Escape') { close(); document.removeEventListener('keydown', onKey); }
      if (e.key === 'ArrowLeft' && currentIdx > 0) { currentIdx--; renderCurrent(); }
      if (e.key === 'ArrowRight' && currentIdx < allMemories.length - 1) { currentIdx++; renderCurrent(); }
    });
  }

  return {
    load: load,
    renderTimeline: renderTimeline,
    applyMedia: applyMedia
  };
})();