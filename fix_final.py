import re

with open(r'C:\Users\DJOGBENOU Jean\OneDrive\Bureau\anniv\js\app.js', 'r') as f:
    content = f.read()

# Find and replace the goToFinal function
old_pattern = r'''  // ─── Final ──────────────────────────────────────────
  async function goToFinal\(\) \{
    await transitionTo\('final'\);

    // Photo finale
    const finalPhoto = document\.getElementById\('final-photo'\);
    if \(finalPhoto && CONFIG\.finalPhoto\) \{
      finalPhoto\.innerHTML = '';
      const img = document\.createElement\('img'\);
      img\.loading = 'lazy';
      img\.alt = '';
      const src = CONFIG\.finalPhoto\.indexOf\('PLACEHOLDER'\) !== 0 \? CONFIG\.finalPhoto : '';
      if \(src\) \{
        img\.onerror = function \(\) \{ img\.classList\.add\('is-fallback'\); \};
        img\.src = src;
      \} else \{
        img\.classList\.add\('is-fallback'\);
      \}
      finalPhoto\.appendChild\(img\);
    \}

    // Message final
    const msg = document\.getElementById\('final-message'\);
    if \(msg && CONFIG\.finalMessage\) \{
      let text = String\(CONFIG\.finalMessage\);
      text = text\.replace\(/\\\{\\\{herName\\\}\}/g, CONFIG\.herName \|\| 'toi'\);
      text = text\.replace\(/\\\{\\\{weName\\\}\}/g, CONFIG\.weName \|\| 'nous'\);
      msg\.textContent = text;
    \}

    // Pétales finaux
    const canvas = document\.getElementById\('final-petals'\);
    if \(canvas && window\.ANIM\) \{
      ANIM\.startPetals\(canvas, \{ count: 14, speeds: \[0\.2, 0\.6\], petalSize: \[10, 22\] \}\);
    \}

    // Roses finales \(subtiles\)
    const finalRoses = document\.getElementById\('final-roses'\);
    if \(finalRoses && window\.ROSES\) \{
      ROSES\.renderBouquet\(finalRoses\);
      // Juste les faire apparaître doucement
      const roses = finalRoses\.querySelectorAll\('\.bouquet-rose'\);
      roses\.forEach\(function \(r, i\) \{
        r\.style\.transitionDelay = \(i \* 0\.03\) \+ 's';
        r\.classList\.add\('is-visible'\);
      \}\);
    \}

    STATE\.unlockFinal\(\);
  \}'''

new_func = '''  // ─── Final ──────────────────────────────────────────
  async function goToFinal() {
    await transitionTo('final');
    const finalContent = document.querySelector('#screen-final .screen-content');
    if (finalContent) finalContent.classList.add('final-reveal');
    const finalPhoto = document.getElementById('final-photo');
    if (finalPhoto && CONFIG.finalPhoto) {
      finalPhoto.innerHTML = '';
      const img = document.createElement('img');
      img.loading = 'lazy'; img.alt = '';
      const src = CONFIG.finalPhoto.indexOf('PLACEHOLDER') !== 0 ? CONFIG.finalPhoto : '';
      if (src) { img.onerror = function () { img.classList.add('is-fallback'); }; img.src = src; }
      else { img.classList.add('is-fallback'); }
      finalPhoto.appendChild(img);
    }
    const msg = document.getElementById('final-message');
    if (msg && CONFIG.finalMessage) {
      let text = String(CONFIG.finalMessage);
      text = text.replace(/\\{\\{herName\\}\\}/g, CONFIG.herName || 'toi');
      text = text.replace(/\\{\\{weName\\}\\}/g, CONFIG.weName || 'nous');
      msg.textContent = text;
    }
    setTimeout(function () {
      const nameEl = document.createElement('div');
      nameEl.className = 'final-name'; nameEl.textContent = CONFIG.herName || 'Daniela';
      if (finalContent) finalContent.appendChild(nameEl);
    }, 500);
    setTimeout(function () {
      const ageEl = document.createElement('div');
      ageEl.className = 'final-age'; ageEl.textContent = '21.';
      if (finalContent) finalContent.appendChild(ageEl);
    }, 1500);
    setTimeout(function () {
      const msgEl = document.createElement('div');
      msgEl.className = 'final-message'; msgEl.textContent = 'Joyeux anniversaire.';
      if (finalContent) finalContent.appendChild(msgEl);
    }, 2500);
    const canvas = document.getElementById('final-petals');
    if (canvas && window.ANIM) ANIM.startPetals(canvas, { count: 14, speeds: [0.2, 0.6], petalSize: [10, 22] });
    const finalRoses = document.getElementById('final-roses');
    if (finalRoses && window.ROSES) {
      ROSES.renderBouquet(finalRoses);
      finalRoses.querySelectorAll('.bouquet-rose').forEach(function (r, i) {
        r.style.transitionDelay = (i * 0.03) + 's'; r.classList.add('is-visible');
      });
    }
    STATE.unlockFinal();
  }'''

if old_pattern in content:
    # Use a simpler approach - find the function by line numbers
    pass
else:
    print("Pattern not found, trying simpler approach")

# Simpler approach: find by comment marker and replace
start_marker = "// ─── Final ──────────────────────────────────────────"
end_marker = "  // ─── Démarrage"

start_idx = content.find(start_marker)
end_idx = content.find(end_marker)

if start_idx != -1 and end_idx != -1:
    new_content = content[:start_idx] + new_func + "\n\n" + content[end_idx:]
    with open(r'C:\Users\DJOGBENOU Jean\OneDrive\Bureau\anniv\js\app.js', 'w') as f:
        f.write(new_content)
    print("goToFinal replaced successfully")
else:
    print(f"Markers not found: start={start_idx}, end={end_idx}")