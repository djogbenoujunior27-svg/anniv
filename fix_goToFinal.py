with open(r'C:\Users\DJOGBENOU Jean\OneDrive\Bureau\anniv\js\app.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('async function goToFinal() {')
end = content.find("if (document.readyState === 'loading')")

print('Start:', start, 'End:', end)

if start != -1 and end != -1:
    # Find the closing brace of goToFinal
    brace_count = 0
    func_end = start
    in_string = False
    string_char = ''
    for i in range(start, end):
        c = content[i]
        if c in '"\\' and not in_string:
            in_string = True
            string_char = c
        elif c == string_char and in_string:
            in_string = False
        elif not in_string and c == '{':
            brace_count += 1
        elif not in_string and c == '}':
            brace_count -= 1
            if brace_count == 0:
                func_end = i + 1
                break

    print('Function end:', func_end)

    new_func = """  // ─── Final ──────────────────────────────────────────
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
  }"""

    new_content = content[:start] + new_func + "\n\n" + content[end:]
    with open(r'C:\Users\DJOGBENOU Jean\OneDrive\Bureau\anniv\js\app.js', 'w', encoding='utf-8') as f:
        f.write(new_content)
    print('goToFinal replaced successfully')
else:
    print('Markers not found')