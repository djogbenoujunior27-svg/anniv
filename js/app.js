(function () {
  'use strict';

  var screens = Array.prototype.slice.call(document.querySelectorAll('.screen'));
  var letters = [];
  var currentScreen = 'screen-welcome';
  var albumIndex = -1;
  var fragmentOpened = 0;
  var memoryIndex = 0;
  var finalCascadeTimer = null;
  var finalCascadeWave = 0;
  var introCascadeTimer = null;
  var introCascadeWave = 0;
  var fragmentCascadeTimer = null;
  var fragmentCascadeWave = 0;
  var memories = [
    { title: 'ma petite memmmmm', date: 'portrait fourni', text: 'Une respiration visuelle, différente, comme une parenthèse dans le fil des souvenirs.', type: 'image', image: MEDIA.photos.daniela[2] },
    { title: 'regarde toiiii', date: 'portrait fourni', text: 'Un autre regard, conservé ici sans chercher à lui imposer une histoire.', type: 'image', image: MEDIA.photos.daniela[4] },
    { title: 'ma bosse ladieeeeees', date: 'moment fourni', text: 'Un instant vivant, à regarder quand tu en as envie.', type: 'video', video: MEDIA.videos.memories[0] },
    { title: 'tu joue tros les badies meme', date: 'moment fourni', text: 'La suite se découvre lentement, sans défilement automatique.', type: 'video', video: MEDIA.videos.memories[1] },
    { title: 'regarde son ventre', date: 'moment fourni', text: 'Quelques secondes en mouvement, simplement posées dans le parcours.', type: 'video', video: MEDIA.videos.memories[2] },
    { title: 'sourire parfois aussi', date: 'moment fourni', text: 'Un fragment vidéo à ouvrir au moment où tu le souhaites.', type: 'video', video: MEDIA.videos.memories[3] },
    { title: 'Une silhouette, une lumière', date: 'moment fourni', text: 'Un souvenir visuel qui prend son temps.', type: 'video', video: MEDIA.videos.memories[4] },
    { title: 'waiiiii je suis fannn mm', date: 'moment fourni', text: 'Une petite découverte en mouvement, sans commentaire ajouté.', type: 'video', video: MEDIA.videos.memories[5] },
    { title: 'Une dernière image avant le mot', date: 'portrait fourni', text: 'Une présence gardée juste avant la conclusion.', type: 'image', image: MEDIA.photos.daniela[6] },
    { title: 'encore elle', date: 'moment fourni', text: 'Un dernier moment à regarder avant de garder le dernier mot.', type: 'video', video: MEDIA.videos.memories[6] },
    { title: 'oui cest toi laaa', date: 'moment fourni', text: 'La mémoire ne se presse pas.', type: 'video', video: MEDIA.videos.memories[7] },
    { title: 'Avant la fin', date: 'moment fourni', text: 'Une dernière respiration en mouvement avant l’écran final.', type: 'video', video: MEDIA.videos.memories[8] },
    { title: 'un coeur noir', date: 'pour toi', text: 'Un petit cœur noir, gardé juste à la fin.', type: 'image', image: 'assets/decorative/black-heart.svg' }
  ];

  function trackFor(screenId) {
    var tracks = {
      'screen-intro': MEDIA.audio.intro,
      'screen-album': MEDIA.audio.album,
      'screen-fragments': MEDIA.audio.fragments,
      'screen-roses': MEDIA.audio.roses,
      'screen-memories': MEDIA.audio.memories,
      'screen-final': MEDIA.audio.final
    };
    return tracks[screenId] || '';
  }

  function show(id) {
    screens.forEach(function (screen) {
      var active = screen.id === id;
      screen.hidden = !active;
      screen.classList.toggle('is-active', active);
    });
    currentScreen = id;
    if (id === 'screen-final') startFinalCascade();
    else stopFinalCascade();
    if (id === 'screen-intro') startIntroCascade();
    else stopIntroCascade();
    if (id === 'screen-fragments') startFragmentCascade();
    else stopFragmentCascade();
    var state = STATE.get();
    state.lastScreen = id.replace('screen-', '');
    STATE.save();
    document.querySelectorAll('video').forEach(function (video) {
      if (!video.classList.contains('intro-background-video')) video.pause();
    });
    var introVideo = document.querySelector('.intro-background-video');
    if (introVideo) {
      introVideo.muted = true;
      introVideo.volume = 0;
      if (id === 'screen-intro') {
        var playAttempt = introVideo.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(function (error) { console.warn('La vidéo d’introduction ne peut pas démarrer automatiquement.', error); });
        }
      } else {
        introVideo.pause();
      }
    }
    if (window.AudioManager && AudioManager.isEnabled()) AudioManager.changeTrack(trackFor(id), 900);
    window.scrollTo(0, 0);
  }

  function startFinalCascade() {
    var container = document.getElementById('final-birthday-cascade');
    if (!container) return;
    stopFinalCascade();
    finalCascadeTimer = setInterval(function () {
      if (currentScreen !== 'screen-final') return;
      finalCascadeWave += 1;
      for (var i = 0; i < 6; i++) {
        var item = document.createElement('img');
        item.className = 'final-birthday-float';
        item.src = MEDIA.finalDecorative.birthdayReference;
        item.alt = '';
        item.style.setProperty('--left', (4 + ((finalCascadeWave * 29 + i * 17) % 92)) + '%');
        item.style.setProperty('--size', (34 + ((i * 11 + finalCascadeWave * 7) % 24)) + 'px');
        item.style.setProperty('--rotate', (((i % 2 ? 1 : -1) * (8 + (i * 5) % 18))) + 'deg');
        item.style.setProperty('--duration', (5.5 + (i % 3) * 0.7) + 's');
        item.style.animationDelay = (i * 0.22) + 's';
        item.addEventListener('animationend', function () { this.remove(); });
        container.appendChild(item);
      }
    }, 10000);
  }

  function stopFinalCascade() {
    if (finalCascadeTimer) {
      clearInterval(finalCascadeTimer);
      finalCascadeTimer = null;
    }
    var container = document.getElementById('final-birthday-cascade');
    if (container) container.innerHTML = '';
  }

  function startIntroCascade() {
    var container = document.getElementById('intro-flower-cascade');
    if (!container) return;
    stopIntroCascade();
    introCascadeTimer = setInterval(function () {
      if (currentScreen !== 'screen-intro') return;
      introCascadeWave += 1;
      for (var i = 0; i < 6; i++) {
        var item = document.createElement('img');
        item.className = 'intro-flower-float';
        item.src = MEDIA.decorative.flower;
        item.alt = '';
        item.style.setProperty('--left', (7 + ((introCascadeWave * 31 + i * 17) % 87)) + '%');
        item.style.setProperty('--size', (24 + ((i * 9 + introCascadeWave * 5) % 18)) + 'px');
        item.style.setProperty('--rotate', (((i % 2 ? 1 : -1) * (10 + (i * 7) % 24))) + 'deg');
        item.style.setProperty('--duration', (6 + (i % 3) * .8) + 's');
        item.style.animationDelay = (i * .3) + 's';
        item.addEventListener('animationend', function () { this.remove(); });
        container.appendChild(item);
      }
    }, 15000);
  }

  function stopIntroCascade() {
    if (introCascadeTimer) {
      clearInterval(introCascadeTimer);
      introCascadeTimer = null;
    }
    var container = document.getElementById('intro-flower-cascade');
    if (container) container.innerHTML = '';
  }

  function startFragmentCascade() {
    var container = document.getElementById('fragment-flower-cascade');
    if (!container) return;
    stopFragmentCascade();
    emitFragmentFlowerWave(container);
    fragmentCascadeTimer = setInterval(function () {
      if (currentScreen === 'screen-fragments') emitFragmentFlowerWave(container);
    }, 15000);
  }

  function emitFragmentFlowerWave(container) {
    fragmentCascadeWave += 1;
    var flowerCount = 7;
    for (var i = 0; i < flowerCount; i++) {
      var item = document.createElement('img');
      var size = 22 + Math.floor(Math.random() * 22);
      var rotation = -28 + Math.floor(Math.random() * 57);
      var left = 3 + Math.floor(Math.random() * 94);
      var drift = -34 + Math.floor(Math.random() * 69);
      item.className = 'fragment-flower-float';
      item.src = MEDIA.decorative.flower;
      item.alt = '';
      item.style.setProperty('--left', left + '%');
      item.style.setProperty('--size', size + 'px');
      item.style.setProperty('--rotate', rotation + 'deg');
      item.style.setProperty('--drift', drift + 'px');
      item.style.setProperty('--duration', (7 + Math.random() * 4).toFixed(2) + 's');
      item.style.animationDelay = (i * .16) + 's';
      item.dataset.wave = fragmentCascadeWave;
      item.addEventListener('animationend', function () { this.remove(); });
      container.appendChild(item);
    }
  }

  function stopFragmentCascade() {
    if (fragmentCascadeTimer) {
      clearInterval(fragmentCascadeTimer);
      fragmentCascadeTimer = null;
    }
    var container = document.getElementById('fragment-flower-cascade');
    if (container) container.innerHTML = '';
  }

  function imageMarkup(src, alt) {
    if (!src || src.indexOf('PLACEHOLDER') === 0) return '<div class="photo-placeholder"><span>ta photo<br>ici</span></div>';
    return '<img loading="lazy" src="' + src + '" alt="' + alt + '" onerror="this.hidden=true;this.nextElementSibling.hidden=false"><div class="photo-placeholder" hidden><span>ta photo<br>ici</span></div>';
  }

  function videoMarkup(src, label) {
    return '<video class="memory-video" autoplay playsinline preload="metadata" aria-label="' + label + '"><source src="' + src + '" type="video/mp4"></video>';
  }

  function setupOpening() {
    var introVideo = document.querySelector('.intro-background-video');
    if (introVideo) {
      introVideo.src = MEDIA.videos.introBackground;
      introVideo.muted = true;
      introVideo.defaultMuted = true;
      introVideo.volume = 0;
    }
    var canvas = document.getElementById('welcome-petals');
    if (window.ANIM && canvas) ANIM.startPetals(canvas, { count: 22, speeds: [0.15, 0.45], petalSize: [2, 5], sway: 0.5 });
    var reveal = document.querySelectorAll('#screen-welcome .intro-reveal');
    Array.prototype.forEach.call(reveal, function (element, index) {
      setTimeout(function () { element.classList.add('is-visible'); }, 500 + (index * 900));
    });
    setTimeout(function () {
      var action = document.getElementById('btn-start');
      if (action) {
        action.hidden = false;
        action.classList.add('is-visible');
      }
    }, 4100);
    var saved = STATE.get();
    var startButton = document.getElementById('btn-start');
    if (saved.started && saved.lastScreen && saved.lastScreen !== 'welcome' && document.getElementById('screen-' + saved.lastScreen)) {
      startButton.innerHTML = 'Reprendre doucement <span>↗</span>';
    }
    startButton.addEventListener('click', function () {
      var resumeScreen = saved.started && saved.lastScreen && saved.lastScreen !== 'welcome'
        ? 'screen-' + saved.lastScreen
        : 'screen-intro';
      STATE.get().started = true;
      STATE.get().welcomeSeen = true;
      STATE.save();
      if (window.AudioManager) AudioManager.start(trackFor(resumeScreen));
      if (resumeScreen === 'screen-roses') showRoses();
      else show(resumeScreen);
    });
    document.getElementById('btn-discover').addEventListener('click', function () { show('screen-album'); });
  }

  function loadData() {
    return fetch('data/letters.json').then(function (response) {
      if (!response.ok) throw new Error('Impossible de charger les fragments.');
      return response.json();
    }).then(function (data) {
      letters = data.slice(0, 21);
      if (letters.length !== 21) throw new Error('Les fragments doivent être exactement au nombre de 21.');
      renderFragments();
    }).catch(function (error) {
      console.error(error);
      letters = Array.from({ length: 21 }, function (_, i) {
        return { id: i + 1, title: 'Fragment ' + (i + 1), text: '[PRIVATE_MESSAGE]', photo: 'PLACEHOLDER' };
      });
      renderFragments();
    });
  }

  function setupAlbum() {
    var album = document.getElementById('album');
    var pages = document.querySelector('.album-pages');
    var progress = document.getElementById('album-progress');
    var photos = MEDIA.photos.album;
    function render() {
      album.classList.toggle('is-open', albumIndex >= 0);
      if (albumIndex < 0) {
        pages.innerHTML = '';
        progress.textContent = 'couverture';
        return;
      }
      var src = photos[albumIndex % photos.length];
      pages.innerHTML = '<article class="album-page">' + imageMarkup(src, 'Photo de Daniela') + '<p>page ' + (albumIndex + 1) + '<br><em>un espace pour un vrai souvenir</em></p></article>';
      progress.textContent = (albumIndex + 1) + ' / ' + photos.length;
      document.getElementById('btn-fragments').hidden = albumIndex < photos.length - 1;
    }
    album.addEventListener('click', function () { if (albumIndex < photos.length - 1) { albumIndex++; render(); } });
    document.getElementById('album-next').addEventListener('click', function () { if (albumIndex < photos.length - 1) { albumIndex++; render(); } });
    document.getElementById('album-prev').addEventListener('click', function () { if (albumIndex > 0) { albumIndex--; render(); } });
    document.getElementById('btn-fragments').addEventListener('click', function () { show('screen-fragments'); });
    album.addEventListener('keydown', function (event) {
      if (event.key === 'ArrowRight') document.getElementById('album-next').click();
      if (event.key === 'ArrowLeft') document.getElementById('album-prev').click();
    });
    render();
  }

  function renderFragments() {
    var grid = document.getElementById('fragment-grid');
    var progress = document.getElementById('fragment-progress');
    var completion = document.getElementById('fragment-complete');
    var hearts = document.querySelector('.fragment-hearts');
    if (hearts && !hearts.children.length) {
      for (var heartIndex = 0; heartIndex < 14; heartIndex++) {
        var heart = document.createElement('span');
        heart.textContent = '♥';
        heart.style.setProperty('--heart-index', heartIndex);
        hearts.appendChild(heart);
      }
    }
    grid.innerHTML = letters.map(function (letter, index) {
      return '<button class="fragment-card" data-index="' + index + '" aria-label="Ouvrir le fragment ' + (index + 1) + '">' +
        '<span class="fragment-index">' + String(index + 1).padStart(2, '0') + '</span><span class="fragment-title">' +
        (letter.title || 'Une pensée') + '</span><span class="fragment-open">ouvrir ↗</span></button>';
    }).join('');
    grid.addEventListener('click', function (event) {
      var card = event.target.closest('.fragment-card');
      if (!card) return;
      var index = Number(card.dataset.index);
      var letter = letters[index];
      card.classList.add('is-read');
      card.innerHTML = '<span class="fragment-index">' + String(index + 1).padStart(2, '0') + '</span><span class="fragment-title">' + letter.title + '</span><span class="fragment-copy">' + letter.text + '</span>';
      fragmentOpened = Math.max(fragmentOpened, document.querySelectorAll('.fragment-card.is-read').length);
      STATE.markRead(letter.id);
      if (progress) progress.textContent = fragmentOpened + ' / 21 pensées découvertes';
      if (fragmentOpened >= 21 && completion) completion.hidden = false;
    });
    document.getElementById('btn-roses').addEventListener('click', function () { showRoses(); });
  }

  function showRoses() {
    show('screen-roses');
    var container = document.getElementById('bouquet-container');
    ROSES.renderBouquet(container);
    var count = document.getElementById('roses-count');
    ROSES.bloomWaves(container, function (value) {
      count.innerHTML = value + ' <span>/ 56</span>';
      STATE.get().rosesCollected = value;
      STATE.save();
    }, function () { document.getElementById('btn-memories').hidden = false; });
  }

  function setupMemories() {
    var viewer = document.getElementById('memory-viewer');
    var dots = document.getElementById('memory-dots');
    var cards = document.getElementById('memory-cards');
    var reaction = document.getElementById('memory-reaction');
    var cardIndexes = memories.map(function (_, index) { return index; });
    function resumeMemoryMusic() {
      if (window.AudioManager && AudioManager.isEnabled()) {
        AudioManager.changeTrack(MEDIA.audio.memories, 500);
      }
    }
    function pauseMemoryMusic() {
      if (window.AudioManager && AudioManager.isEnabled()) AudioManager.pause();
    }
    function advance() {
      memoryIndex = (memoryIndex + 1) % memories.length;
      render();
    }
    function renderCards() {
      if (!cards) return;
      cards.innerHTML = cardIndexes.map(function (index) {
        var memory = memories[index];
        var visual = memory.type === 'image'
          ? '<img src="' + memory.image + '" alt="" loading="lazy">'
          : '<span class="memory-card-motion" aria-hidden="true">▶</span>';
        return '<button type="button" class="memory-card ' + (index === memoryIndex ? 'is-active' : '') + '" data-index="' + index + '" role="tab" aria-selected="' + (index === memoryIndex) + '">' +
          visual + '<span>' + memory.title + '</span></button>';
      }).join('');
    }
    function render() {
      var memory = memories[memoryIndex];
      var mediaMarkup = memory.type === 'video'
        ? videoMarkup(memory.video, memory.title)
        : imageMarkup(memory.image, memory.title);
      viewer.innerHTML = '<div class="memory-photo">' + mediaMarkup + '</div><div class="memory-copy"><p class="eyebrow">' + memory.date + '</p><h3>' + memory.title + '</h3><p>' + memory.text + '</p></div>';
      dots.innerHTML = memories.map(function (_, index) { return '<button class="memory-dot ' + (index === memoryIndex ? 'is-active' : '') + '" data-index="' + index + '" aria-label="Souvenir ' + (index + 1) + '"></button>'; }).join('');
      renderCards();
      var livingCopy = document.getElementById('memory-living-copy');
      if (livingCopy) {
        livingCopy.textContent = memory.type === 'video'
          ? 'Un instant vivant, conservé ici pour que tu puisses simplement le regarder.'
          : 'Une image gardée à part. Prends quelques secondes, puis continue quand tu veux.';
      }
      var media = viewer.querySelector('.memory-photo');
      var video = viewer.querySelector('.memory-video');
      media.addEventListener('click', function () {
        advance();
      });
      if (video) {
        pauseMemoryMusic();
        video.muted = false;
        video.volume = 1;
        video.addEventListener('ended', resumeMemoryMusic);
        var playAttempt = video.play();
        if (playAttempt && typeof playAttempt.catch === 'function') {
          playAttempt.catch(function (error) {
            video.muted = true;
            video.play().catch(function () { console.warn('La vidéo souvenir ne peut pas démarrer automatiquement.', error); });
          });
        }
      } else {
        resumeMemoryMusic();
      }
    }
    dots.addEventListener('click', function (event) {
      if (event.target.dataset.index) {
        memoryIndex = Number(event.target.dataset.index);
        render();
      }
    });
    if (cards) {
      cards.addEventListener('click', function (event) {
        var card = event.target.closest('.memory-card');
        if (card) {
          memoryIndex = Number(card.dataset.index);
          render();
        }
      });
    }
    document.querySelectorAll('.memory-choices button').forEach(function (button) {
      button.addEventListener('click', function () {
        if (reaction) {
          reaction.hidden = false;
          reaction.textContent = button.dataset.choice === 'video'
            ? 'Alors commence par le mouvement. Le reste viendra doucement.'
            : 'Alors commence par une image. Elle ouvre la suite sans bruit.';
        }
      });
    });
    render();
    document.getElementById('btn-memories').addEventListener('click', function () {
      show('screen-memories');
      render();
    });
    document.getElementById('btn-final').addEventListener('click', function () { STATE.unlockFinal(); show('screen-final'); });
  }

  document.getElementById('final-photo').innerHTML = imageMarkup(MEDIA.photos.final, 'Photo finale de Daniela');
  document.getElementById('audio-toggle').addEventListener('click', function () {
    var muted = AudioManager.toggleMute();
    this.textContent = muted ? 'OFF 🔇' : 'ON 🔊';
    this.setAttribute('aria-pressed', String(!muted));
  });
  document.getElementById('btn-reset').addEventListener('click', function () {
    if (window.confirm('Recommencer l’expérience depuis le début ?')) { STATE.reset(); window.location.reload(); }
  });
  setupOpening();
  setupAlbum();
  setupMemories();
  loadData();
})();
