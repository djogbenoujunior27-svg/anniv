/* ============================================================
   Les 21 lettres — le cœur émotionnel de l'expérience.
   Chaque lettre est une petite expérience interactive.
   ============================================================ */

window.TEXT_GENERATOR = (function () {

  const LETTERS = [
    {
      id: 1,
      title: 'Le début',
      theme: 'debut',
      text: 'Je me souviens encore du moment où je t\'ai vue la première fois. Je n\'ai rien osé dire — j\'étais bien trop occupé à ne pas laisser paraître que tu venais de tout changer. Tu n\'as jamais su. C\'est là que tout a commencé, sans bruit.',
      photo: 'PLACEHOLDER_PHOTO_01',
      interaction: 'peel-envelope',
      rose: 3,
      atmosphere: 'doux'
    },
    {
      id: 2,
      title: 'Une toute petite chose',
      theme: 'detail-quotidien',
      text: 'Tu ne t\'en rends pas compte, mais quand tu manges quelque chose qui te plaît vraiment, tu fermes les yeux une demi-seconde. Juste une demi-seconde. Je te regarde à chaque fois. C\'est peut-être idiot, mais je trouve ça adorable.',
      photo: 'PLACEHOLDER_PHOTO_02',
      interaction: 'tap-rose',
      rose: 3,
      atmosphere: 'tendre'
    },
    {
      id: 3,
      title: 'Ton rire',
      theme: 'rire',
      text: 'Quand tu ris pour de vrai, tu oublies tout le monde autour. Tu te plies en deux, tu perds la tête, et moi je ris avec toi — pas parce que c\'est drôle, mais parce que toi tu rigoles. Personne ne rit comme toi.',
      photo: 'PLACEHOLDER_PHOTO_03',
      interaction: 'tap-flowers',
      rose: 3,
      atmosphere: 'lumineux'
    },
    {
      id: 4,
      title: 'Ta façon de bouder',
      theme: 'personnalite',
      text: 'Personne ne boude comme toi. Vingt minutes, parfois une heure, les bras croisés. Et puis tu n\'y penses plus, comme si rien n\'était arrivé. J\'adore ça, d\'ailleurs. Tu gardes les tempêtes pour les vraies raisons.',
      photo: 'PLACEHOLDER_PHOTO_04',
      interaction: 'hold-pulse',
      rose: 3,
      atmosphere: 'espiegle'
    },
    {
      id: 5,
      title: 'Ce qui me fait sourire chaque fois',
      theme: 'expression',
      text: 'Tu as un sourire que tu n\'utilises que quand tu es fière de toi, sans vouloir le montrer. Le menton un peu relevé, les yeux plissés, comme si tu disais « j\'ai réussi, on n\'en parle pas ». J\'espère ne jamais rater celui-là.',
      photo: 'PLACEHOLDER_PHOTO_05',
      interaction: 'tap-photo',
      rose: 2,
      atmosphere: 'doux'
    },
    {
      id: 6,
      title: 'Ce que tu changes',
      theme: 'presence',
      text: 'Les journées ordinaires — les courses, la pluie, le métro — sont moins ordinaires quand tu es à côté. Je n\'ai pas de grande explication. Je sais juste que le silence avec toi ne pèse rien, et que je ne l\'ai compris qu\'après.',
      photo: 'PLACEHOLDER_PHOTO_06',
      interaction: 'collect-petals',
      rose: 2,
      atmosphere: 'calme'
    },
    {
      id: 7,
      title: 'Quand tu te concentres',
      theme: 'detail-remarque',
      text: 'Quand tu travailles, tu fronces les sourcils et tu oublies que j\'existe. Je te regarde faire et je me dis : c\'est ça, voir quelqu\'un que tu aimes faire ce qu\'elle aime. Je ne te dérange jamais à ces moments-là. Presque jamais.',
      photo: 'PLACEHOLDER_PHOTO_07',
      interaction: 'drag-light',
      rose: 3,
      atmosphere: 'concentre'
    },
    {
      id: 8,
      title: 'Ce que j\'admire',
      theme: 'admiration',
      text: 'Tu es tombée, plusieurs fois. Et à chaque fois tu t\'es relevée sans en faire une mise en scène. Tu traites tes blessures comme des formalités. C\'est peut-être ce que j\'admire le plus chez toi : tu ne te plains pas, tu avances.',
      photo: 'PLACEHOLDER_PHOTO_08',
      interaction: 'tap-flowers',
      rose: 2,
      atmosphere: 'serieux'
    },
    {
      id: 9,
      title: 'Un souvenir',
      theme: 'souvenir',
      text: 'Je repense toujours à ce jour de pluie où on est restés beaucoup trop longtemps chez toi. On avait prévu des choses, on n\'a rien fait. Je ne me souviens même plus de ce qu\'on s\'est dit. Je me souviens juste m\'être dit : je ne veux pas que ce jour finisse.',
      photo: 'PLACEHOLDER_PHOTO_09',
      interaction: 'peel-envelope',
      rose: 3,
      atmosphere: 'nostalgique'
    },
    {
      id: 10,
      title: 'Une dispute',
      theme: 'difficulte',
      text: 'On s\'est déjà disputés pour des bêtises, et il m\'est arrivé de dire des choses que je ne pensais pas. Merci d\'être restée. Merci d\'avoir eu raison quand j\'avais tort. On apprend, tous les deux, et à chaque fois ça nous ressemble un peu plus.',
      photo: 'PLACEHOLDER_PHOTO_10',
      interaction: 'tap-points',
      rose: 3,
      atmosphere: 'grave'
    },
    {
      id: 11,
      title: 'Ce que tu m\'as appris',
      theme: 'apprentissage',
      text: 'Avant toi, je pensais que l\'important c\'était les grandes choses, les plans, les prochaines étapes. Tu m\'as appris à aimer les petites : un café qui refroidit, une playlist partagée, un dimanche sans rien. Ma vie est plus lente. Elle va mieux.',
      photo: 'PLACEHOLDER_PHOTO_11',
      interaction: 'trace-reveal',
      rose: 3,
      atmosphere: 'doux'
    },
    {
      id: 12,
      title: 'Ta sincérité',
      theme: 'qualite',
      text: 'Tu dis ce que tu penses, même quand ce n\'est pas confortable. Même à moi. Surtout à moi. Je n\'ai jamais besoin de deviner avec toi, et c\'est rare, et c\'est précieux. Ne change jamais cette façon que tu as de me parler droit dans les yeux.',
      photo: 'PLACEHOLDER_PHOTO_12',
      interaction: 'tap-rose',
      rose: 3,
      atmosphere: 'sincere'
    },
    {
      id: 13,
      title: 'Ce que je te souhaite',
      theme: 'souhait',
      text: 'Arrête d\'être si dure avec toi-même. Tu découpes tes réussites en tranches plus petites que ce qu\'elles valent. Je te souhaite de te voir comme je te vois. Un peu plus de confiance. Et un peu plus de croissants au lit, tant qu\'on y est.',
      photo: 'PLACEHOLDER_PHOTO_13',
      interaction: 'discover-tap',
      rose: 2,
      atmosphere: 'legere'
    },
    {
      id: 14,
      title: 'Tes rêves',
      theme: 'reves',
      text: 'Hier soir, quand tu me racontais tes projets, tu t\'es allumée. Tu parlais vite, tes mains bougeaient, tu étais déjà partie dans ta tête. Je ne faisais qu\'écouter en me disant : elle ne voit pas à quel point elle est belle en parlant de ses rêves.',
      photo: 'PLACEHOLDER_PHOTO_14',
      interaction: 'rotate-dial',
      rose: 2,
      atmosphere: 'reve'
    },
    {
      id: 15,
      title: 'Tes 21 ans',
      theme: 'vingt-et-un',
      text: '21 ans, c\'est un âge étrange : ni tout à fait la première vie, ni tout à fait la suivante. Je ne sais pas ce que tes vingt et un ans vont te donner. Mais je sais déjà ce que tu y apportes : cette énergie, cette tête, ce cœur. J\'ai très envie de regarder ça.',
      photo: 'PLACEHOLDER_PHOTO_15',
      interaction: 'tap-flowers',
      rose: 3,
      atmosphere: 'grandi'
    },
    {
      id: 16,
      title: 'Le temps',
      theme: 'temps',
      text: 'Je ne vais pas te dire « toujours », parce que je n\'aime pas les mots que je ne suis pas sûr de savoir tenir. Mais je sais ceci : chaque jour passé avec toi, arrivé au soir, je n\'ai jamais eu envie d\'être ailleurs.',
      photo: 'PLACEHOLDER_PHOTO_16',
      interaction: 'hold-pulse',
      rose: 3,
      atmosphere: 'posé'
    },
    {
      id: 17,
      title: 'Aujourd\'hui',
      theme: 'present',
      text: 'Aujourd\'hui, tu as 21 ans. Je suis là, devant des écrans, à écrire des mots pour toi, à fabriquer des roses en pixels. Et je me dis que j\'aimerais que ce jour soit vraiment à la hauteur de ce que tu es. Alors voilà. J\'essaie.',
      photo: 'PLACEHOLDER_PHOTO_17',
      interaction: 'peel-envelope',
      rose: 3,
      atmosphere: 'present'
    },
    {
      id: 18,
      title: 'Une promesse',
      theme: 'promesse',
      text: 'Je ne te promets pas la lune. Je te promets d\'arrêter de regarder mon téléphone quand tu me parles. De t\'écouter jusqu\'au bout, même quand je crois déjà avoir compris. De te montrer que je t\'aime, plutôt que de croire que tu le devines tout seul.',
      photo: 'PLACEHOLDER_PHOTO_18',
      interaction: 'discover-tap',
      rose: 2,
      atmosphere: 'sincere'
    },
    {
      id: 19,
      title: 'Ce que j\'attends',
      theme: 'avenir',
      text: 'Je n\'ai pas besoin de grandes choses pour nous deux. Un matin sans réveil. Un café qui traîne. Un film qu\'on regarde trois fois parce que tu t\'endors dessus. Et ce jour où on aura le temps, vraiment. J\'ai hâte de tous ces jours-là.',
      photo: 'PLACEHOLDER_PHOTO_19',
      interaction: 'drag-light',
      rose: 2,
      atmosphere: 'espoir'
    },
    {
      id: 20,
      title: 'Le fond de moi',
      theme: 'intime',
      text: 'Je ne sais pas toujours dire ce que je ressens, alors j\'écris. Ces vingt lettres, c\'est ma façon de faire avec ma bouche ce que je fais mal : te dire, simplement, que tu comptes d\'une manière que je n\'ai pas les mots pour porter.',
      photo: 'PLACEHOLDER_PHOTO_20',
      interaction: 'hold-pulse',
      rose: 3,
      atmosphere: 'intime'
    },
    {
      id: 21,
      title: 'La dernière',
      theme: 'derniere',
      text: 'Voilà, c\'est la dernière. Vingt et une fois j\'ai essayé de te dire des choses simples, et je crois que j\'ai encore raté la moitié. Alors je garde le plus simple pour la fin. Joyeux anniversaire. Et maintenant : les roses.',
      photo: 'PLACEHOLDER_PHOTO_21',
      interaction: 'gate-rose',
      rose: 3,
      atmosphere: 'final'
    }
  ];

  const sum = LETTERS.reduce(function (a, l) { return a + l.rose; }, 0);
  // Sécurité strict : il faut EXACTEMENT 21 lettres et 56 roses
  if (LETTERS.length !== 21) {
    console.error('IL FAUT EXACTEMENT 21 LETTRES (actuellement: ' + LETTERS.length + ')');
  }
  if (sum !== 56) {
    console.error('LE TOTAL DES ROSES DOIT ÊTRE 56 (actuellement: ' + sum + ')');
  }

  // ── Validation qualité des textes ─────────────────────────────
  function validate() {
    const problems = [];
    const texts = LETTERS.map(function (l) { return l.text; });

    if (texts.length !== 21) problems.push('pas 21 textes');

    // doublons exacts
    const seen = {};
    texts.forEach(function (t, i) {
      if (seen[t] !== undefined) problems.push('lettre ' + (i + 1) + ' identique à ' + seen[t]);
      seen[t] = i + 1;
    });

    // similarité excessive (paires de mots partagés)
    const stop = new Set(['et', 'je', 'tu', 'te', 'toi', 'moi', 'de', 'des', 'la', 'le', 'les', 'un', 'une', 'que', 'qui',
      'pas', 'plus', 'dans', 'pour', 'avec', 'tout', 'tous', 'c\'est', 'mais', 'comme', 'tes', 'ton', 'ta', 'toi',
      'encore', 'vraiment', 'juste', 'quelque', 'quelqu\'un', 'rien', 'sans', 'après', 'avant', 'toujours', 'peut', 'peux', 'faire', 'ici']);
    for (let i = 0; i < texts.length; i++) {
      for (let j = i + 1; j < texts.length; j++) {
        const a = texts[i].toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüç\s']/g, '').split(/\s+/);
        const b = new Set(texts[j].toLowerCase().replace(/[^a-zàâäéèêëîïôöùûüç\s']/g, '').split(/\s+/));
        const shared = a.filter(function (w) { return b.has(w) && !stop.has(w); });
        const score = shared.length / Math.max(1, new Set(a).size);
        if (score > 0.22) {
          problems.push('lettres ' + (i + 1) + ' et ' + (j + 1) + ' trop similaires (' + shared.slice(0, 4).join(', ') + ')');
        }
      }
    }

    // variations de longueur
    const lens = texts.map(function (t) { return t.length; });
    const avg = lens.reduce(function (a, b) { return a + b; }, 0) / lens.length;
    lens.forEach(function (l, i) {
      if (l > avg * 1.6 || l < avg * 0.5) problems.push('lettre ' + (i + 1) + ' longueur hors plage (' + l + ')');
    });

    return problems;
  }

  return {
    letters: LETTERS,
    byId: function (id) {
      return LETTERS.find(function (l) { return l.id === id; });
    },
    count: LETTERS.length,
    totalRoses: sum,
    validate: validate
  };
})();