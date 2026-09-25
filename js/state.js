/* ============================================================
   État global de l'expérience — persistance localStorage.
   Permet de reprendre après fermeture/rechargement.
   ============================================================ */

window.STATE = (function () {
  const KEY = 'bday21_state_v1';

  const defaults = {
    started: false,           // l'utilisateur a ouvert le cadeau
    welcomeSeen: false,
    introSeen: false,
    lettersUnlocked: [1],     // lettres accessibles
    lettersRead: [],          // lettres terminées
    rosesCollected: 0,
    discoveries: [],
    memoriesUnlocked: [0],
    finalUnlocked: false,
    lastScreen: 'welcome'     // écran précédent pour resume
  };

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(defaults));
      const parsed = JSON.parse(raw);
      const merged = Object.assign({}, defaults, parsed);
      if (!Array.isArray(merged.lettersUnlocked) || !merged.lettersUnlocked.length) merged.lettersUnlocked = [1];
      return merged;
    } catch (e) {
      return JSON.parse(JSON.stringify(defaults));
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch (e) {
      // stockage indisponible → on continue en mémoire (expérience intacte)
    }
  }

  function api() {
    return state;
  }

  function unlockLetter(id) {
    if (!state.lettersUnlocked.includes(id)) state.lettersUnlocked.push(id);
    state.lettersUnlocked.sort(function (a, b) { return a - b; });
    save();
  }

  function markRead(id) {
    if (!state.lettersRead.includes(id)) state.lettersRead.push(id);
    save();
  }

  function addRoses(n) {
    state.rosesCollected += n;
    save();
  }

  function unlockMemory(i) {
    if (!state.memoriesUnlocked.includes(i)) state.memoriesUnlocked.push(i);
    state.memoriesUnlocked.sort(function (a, b) { return a - b; });
    save();
  }

  function unlockFinal() {
    state.finalUnlocked = true;
    save();
  }

  function reset() {
    state = JSON.parse(JSON.stringify(defaults));
    save();
    if (window.RANDOMIZER) RANDOMIZER.forceReset();
  }

  return {
    get: api,
    unlockLetter: unlockLetter,
    markRead: markRead,
    addRoses: addRoses,
    unlockMemory: unlockMemory,
    unlockFinal: unlockFinal,
    reset: reset,
    save: save
  };
})();