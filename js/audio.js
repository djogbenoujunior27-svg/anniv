/* ============================================================
   AudioManager — musique douce, respect des autoplay policies.
   L'audio démarre uniquement après le premier geste utilisateur.
   Si un fichier manque, l'expérience continue sans musique.
   ============================================================ */

window.AudioManager = (function () {
  let audio = null;
  let volume = 0.55;
  let currentTrack = null;
  let fading = null;
  let transitionTimer = null;
  let enabled = false;
  let muted = false;
  let transitionId = 0;

  function init() {
    if (audio) return;
    audio = new Audio();
    audio.loop = true;
    audio.preload = 'none';
    if (CONFIG.audio && CONFIG.audio.volume) volume = CONFIG.audio.volume;
    audio.volume = 0;
  }

  // À appeler obligatoirement au premier clic utilisateur
  function start(initialTrack) {
    init();
    enabled = true;
    changeTrack(initialTrack || MEDIA.audio.musicOne, 0);
  }

  function hasRealAsset(src) {
    return typeof src === 'string' && src.length > 0 && src.indexOf('PLACEHOLDER') !== 0;
  }

  function setSource(src) {
    if (!audio) init();
    if (!hasRealAsset(src)) {
      currentTrack = '';
      audio.pause();
      audio.removeAttribute('src');
      audio.load();
      return;
    }
    audio.pause();
    currentTrack = src;
    audio.src = src;
    audio.load();
  }

  function play() {
    init();
    if (!enabled) return;
    audio.play().catch(function () { /* silencieux : pas de musique, pas de casse */ });
  }

  function pause() {
    if (audio) audio.pause();
  }

  function setVolume(v) {
    volume = Math.max(0, Math.min(1, v));
    if (audio) audio.volume = volume;
  }

  function toggleMute() {
    muted = !muted;
    if (audio) audio.volume = muted ? 0 : volume;
    return muted;
  }

  function fadeIn(duration, target, src) {
    if (!audio) init();
    if (fading) clearInterval(fading);
    if (!hasRealAsset(src) && !hasRealAsset(currentTrack)) {
      audio.pause();
      return;
    }
    if (src && src !== currentTrack) setSource(src);
    const targetVol = muted ? 0 : (target !== undefined ? target : volume);
    const steps = 24;
    let i = 0;
    audio.volume = 0;
    audio.play().catch(function () { /* continue sans son */ });
    fading = setInterval(function () {
      i++;
      audio.volume = targetVol * (i / steps);
      if (i >= steps) {
        clearInterval(fading);
        fading = null;
        audio.volume = targetVol;
      }
    }, duration / steps);
  }

  function fadeOut(duration) {
    if (!audio) return;
    if (fading) clearInterval(fading);
    const steps = 24;
    const startVol = audio.volume;
    let i = 0;
    fading = setInterval(function () {
      i++;
      audio.volume = startVol * (1 - i / steps);
      if (i >= steps) {
        clearInterval(fading);
        fading = null;
        audio.pause();
        audio.volume = startVol;
      }
    }, duration / steps);
  }

  function changeTrack(src, fadeDur) {
    init();
    const requestId = ++transitionId;
    if (transitionTimer) {
      clearTimeout(transitionTimer);
      transitionTimer = null;
    }
    if (!hasRealAsset(src)) {
      if (fading) {
        clearInterval(fading);
        fading = null;
      }
      setSource('');
      return Promise.resolve();
    }
    if (currentTrack === src) {
      if (fading) {
        clearInterval(fading);
        fading = null;
      }
      audio.volume = muted ? 0 : volume;
      if (audio.paused) play();
      return Promise.resolve();
    }
    if (fadeDur && audio.currentSrc) {
      fadeOut(fadeDur);
      transitionTimer = setTimeout(function () {
        if (requestId !== transitionId) return;
        transitionTimer = null;
        audio.pause();
        setSource(src);
        fadeIn(fadeDur);
      }, fadeDur);
    } else {
      setSource(src);
      fadeIn(600);
    }
    return Promise.resolve();
  }

  return {
    start: start,
    play: play,
    pause: pause,
    fadeIn: fadeIn,
    fadeOut: fadeOut,
    changeTrack: changeTrack,
    setVolume: setVolume,
    toggleMute: toggleMute,
    getState: function () {
      return {
        track: currentTrack,
      source: audio ? audio.currentSrc : '',
      paused: !audio || audio.paused,
      volume: audio ? audio.volume : 0,
      transitionPending: !!transitionTimer,
      enabled: enabled,
      muted: muted
    };
    },
    isEnabled: function () { return enabled; }
  };
})();