import json
import os
import re

print('=== AUDIT DU PROJET DANIELA 21 ===')
print()

# 1. Vérifier letters.json
with open('data/letters.json') as f:
    letters = json.load(f)
print('1. LETTERS: {} lettres'.format(len(letters)))
roses_sum = sum(l['rose'] for l in letters)
print('   - Total roses: {} (attendu: 56)'.format(roses_sum))
print('   - Validation: OK' if roses_sum == 56 else '   - Validation: FAIL')
print()

# 2. Vérifier memories.json
try:
    with open('data/memories.json') as f:
        mems = json.load(f)
    print('2. MEMORIES: {} souvenirs (vide: {})'.format(len(mems), len(mems) == 0))
except:
    print('2. MEMORIES: fichier introuvable ou vide')
print()

# 3. Vérifier les interactions dans textGenerator.js
with open('js/textGenerator.js') as f:
    tg = f.read()
interactions = set()
for m in re.finditer(r'interaction: (\w+)', tg):
    interactions.add(m.group(1))
print('3. INTERACTIONS ({} types): {}'.format(len(interactions), sorted(interactions)))
print()

# 4. État global
with open('js/state.js') as f:
    state = f.read()
print('4. STATE: lastScreen present = {}'.format('lastScreen' in state))
print()

# 5. Fichiers JS existants
js_dir = 'js'
files = sorted([f for f in os.listdir(js_dir) if f.endswith('.js')])
print('5. FICHIERS JS ({}): {}'.format(len(files), files))
print()

# 6. CSS existants
css_dir = 'css'
css_files = sorted([f for f in os.listdir(css_dir) if f.endswith('.css')])
print('CSS ({}): {}'.format(len(css_files), css_files))
print()

# 7. Vérifier app.js pour resume
with open('js/app.js') as f:
    app = f.read()
print('7. app.js: lastScreen referenced = {}'.format('lastScreen' in app))
print('   STATE.save() present = {}'.format('STATE.save()' in app))
print()

# 8. Vérifier config.js
with open('js/config.js') as f:
    cfg = f.read()
print('8. config.js: herName present = {}'.format('herName' in cfg))
print()

print('=== FIN AUDIT ===')