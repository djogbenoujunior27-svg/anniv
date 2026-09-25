/* ============================================================
   Randomisation légère basée sur un seed de session.
   N'altère JAMAIS la progression narrative (ordre des lettres),
   mais fait varier les détails décoratifs : pétales, roses,
   positions des particules, vibrations de polices, etc.
   ============================================================ */

window.RANDOMIZER = (function () {
  const KEY = 'bday21_seed_v1';
  let seed;

  function mulberry32(a) {
    return function () {
      a |= 0; a = (a + 0x6D2B79F5) | 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  function loadOrCreate() {
    let s = localStorage.getItem(KEY);
    if (!s) {
      s = String(Math.floor(Math.random() * 1e9));
      localStorage.setItem(KEY, s);
    }
    seed = parseInt(s, 10) || Math.floor(Math.random() * 1e9);
    return seed;
  }

  function forceReset() {
    seed = Math.floor(Math.random() * 1e9);
    localStorage.setItem(KEY, String(seed));
    return seed;
  }

  function rng() {
    return mulberry32(seed)();
  }

  function range(min, max) {
    return min + rng() * (max - min);
  }

  function int(min, max) {
    return Math.floor(range(min, max + 1));
  }

  function pick(arr) {
    return arr[Math.floor(rng() * arr.length)];
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  return {
    loadOrCreate: loadOrCreate,
    forceReset: forceReset,
    rng: rng,
    range: range,
    int: int,
    pick: pick,
    shuffle: shuffle,
    seed: function () { return seed; }
  };
})();