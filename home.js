/* ---- comparaison des boutons : ?btn=1…6 pose html[data-btn] ---- */
(function () {
  var m = /[?&]btn=([1-6])/.exec(location.search);
  if (m) document.documentElement.setAttribute('data-btn', m[1]);
})();

(function () {
  /* ---- liens centralisés (config.js) ---- */
  var S = window.SITE || {};
  /* ---- l'adresse e-mail : posée par script (absente du HTML) ---- */
  if (S.courriel) {
    document.querySelectorAll('[data-courriel]').forEach(function (el) {
      if (el.hasAttribute('data-copier')) { el.setAttribute('data-copier', S.courriel); }
      else { el.textContent = S.courriel; }
    });
  }
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var href = S[el.getAttribute('data-link')];
    if (href) el.setAttribute('href', href);
    /* les liens externes s'ouvrent à côté : on ne perd jamais la page */
    if (/^https?:/.test(href || '')) {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* ---- menu-terminal : l'entrée active suit la section visible ---- */
  var liens = Array.prototype.slice.call(document.querySelectorAll('.term a[data-cible]'));
  var zones = Array.prototype.slice.call(document.querySelectorAll('[data-zone]'));
  if ('IntersectionObserver' in window && zones.length) {
    var visibles = {};
    var suivre = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visibles[e.target.getAttribute('data-zone')] = e.isIntersecting; });
      var courante = '';
      zones.forEach(function (z) { var n = z.getAttribute('data-zone'); if (visibles[n]) courante = n; });
      liens.forEach(function (a) { a.classList.toggle('actif', a.getAttribute('data-cible') === courante); });
    }, { rootMargin: '-45% 0px -45% 0px', threshold: 0 });
    zones.forEach(function (z) { suivre.observe(z); });
  }

  /* ---- projets dépliables : une seule box ouverte à la fois ---- */
  function fermerTout(instantane) {
    document.querySelectorAll('.depliable.ouverte').forEach(function (a) {
      var d = a.querySelector('.box-detail');
      if (instantane) { d.style.transition = 'none'; }
      if (d.style.maxHeight === 'none') { d.style.maxHeight = d.scrollHeight + 'px'; void d.offsetHeight; }
      d.style.maxHeight = '0px';
      if (instantane) { void d.offsetHeight; d.style.transition = ''; }
      a.classList.remove('ouverte');
      a.querySelector('.box-tete').setAttribute('aria-expanded', 'false');
      d.setAttribute('aria-hidden', 'true');
    });
  }
  function ouvrir(art) {
    /* la box s'ouvre LÀ où on a cliqué : on ferme les autres sans
       animation, puis on compense le déplacement de la tête — aucun
       défilement automatique, la page reste sous la main */
    var tete = art.querySelector('.box-tete');
    var avant = tete.getBoundingClientRect().top;
    fermerTout(true);
    art.classList.add('ouverte');
    tete.setAttribute('aria-expanded', 'true');
    var d = art.querySelector('.box-detail');
    d.setAttribute('aria-hidden', 'false');
    d.style.maxHeight = d.scrollHeight + 'px';
    d.addEventListener('transitionend', function fin(e) {
      if (e.propertyName === 'max-height' && art.classList.contains('ouverte')) {
        d.style.maxHeight = 'none'; /* le contenu peut respirer si la fenêtre change */
      }
      d.removeEventListener('transitionend', fin);
    });
    var delta = tete.getBoundingClientRect().top - avant;
    if (delta) { window.scrollBy({ top: delta, left: 0, behavior: 'instant' }); }
  }
  /* toute la surface de la bento bascule : un clic ouvre, le suivant
     referme — les liens gardent leur rôle, et un glisser (sélection de
     texte) n'est pas un clic. La garde se fait sur le DÉPLACEMENT du
     pointeur : fiable, contrairement à getSelection() qui avalait des
     clics légitimes. */
  document.querySelectorAll('.depliable').forEach(function (art) {
    var px = 0, py = 0;
    art.addEventListener('pointerdown', function (e) { px = e.clientX; py = e.clientY; });
    art.addEventListener('click', function (e) {
      if (e.target.closest('a')) { return; }
      if (e.target.closest('.fermer-btn')) { return; } /* il a son propre handler */
      var clavier = e.detail === 0; /* Enter/Espace sur la tête */
      if (!clavier && (Math.abs(e.clientX - px) > 8 || Math.abs(e.clientY - py) > 8)) { return; }
      if (art.classList.contains('ouverte')) { fermerTout(); } else { ouvrir(art); }
    });
  });
  document.querySelectorAll('.fermer-btn').forEach(function (b) {
    b.addEventListener('click', fermerTout);
  });
  /* Échap referme le projet ouvert */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { fermerTout(); }
  });
  var cible = location.hash && document.querySelector(location.hash + '.depliable');
  if (cible) { ouvrir(cible); cible.scrollIntoView({ block: 'start' }); }

  /* ---- fil de lecture : une fine ligne de progression en haut ---- */
  var fil = document.querySelector('.progression');
  if (fil) {
    var majFil = function () {
      var max = document.documentElement.scrollHeight - window.innerHeight;
      fil.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + '%';
    };
    window.addEventListener('scroll', function () { window.requestAnimationFrame(majFil); }, { passive: true });
    majFil();
  }

  /* ---- copier l'adresse e-mail en un clic ---- */
  document.querySelectorAll('.copier').forEach(function (b) {
    b.addEventListener('click', function () {
      var v = b.getAttribute('data-copier');
      var fini = function () {
        var t = b.textContent;
        b.textContent = b.getAttribute('data-copie') || 'Copié ✓';
        setTimeout(function () { b.textContent = t; }, 2000);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(v).then(fini, fini);
      } else { fini(); }
    });
  });

  /* ---- apparition au scroll ---- */
  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var els = document.querySelectorAll('.rv');
  if (reduced || !('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('vu'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('vu'); io.unobserve(e.target); }
    });
  }, { rootMargin: '0px 0px -10% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();

/* ---- venn : survoler ou taper un mode affiche sa phrase sous le diagramme ---- */
(function () {
  var phrases = document.querySelectorAll('.venn-phrase');
  if (!phrases.length) return;
  document.querySelectorAll('.venn-titre[data-venn]').forEach(function (t) {
    var montrer = function () {
      phrases.forEach(function (p) { p.hidden = p.getAttribute('data-venn') !== t.getAttribute('data-venn'); });
    };
    t.addEventListener('pointerenter', montrer);
    t.addEventListener('click', montrer);
  });
})();

/* ---- la pastille du menu change la couleur du site :
   bleu Klein → rose framboise → jaune Monocle → bleu… (mémorisé) ---- */
(function () {
  var dot = document.querySelector('.term .dot');
  if (!dot) return;
  var teintes = ['bleu', 'rose', 'jaune'];
  var html = document.documentElement;
  /* la bulle au survol taquine la couleur du moment */
  var bulles = {
    fr: { bleu: 'Pas fan du bleu ?', rose: 'Pas fan du rose ?', jaune: 'Pas fan du jaune ?' },
    de: { bleu: 'Kein Fan von Blau?', rose: 'Kein Fan von Pink?', jaune: 'Kein Fan von Gelb?' },
    en: { bleu: 'Not a fan of blue?', rose: 'Not a fan of pink?', jaune: 'Not a fan of yellow?' }
  };
  var langue = (html.getAttribute('lang') || 'fr').slice(0, 2);
  var textes = bulles[langue] || bulles.fr;
  function actuelle() { return html.getAttribute('data-teinte') || 'bleu'; }
  function majBulle() { dot.setAttribute('data-bulle', textes[actuelle()] || textes.bleu); }
  majBulle();
  dot.addEventListener('click', function () {
    var i = teintes.indexOf(actuelle());
    var suivante = teintes[(i + 1) % teintes.length];
    if (suivante === 'bleu') { html.removeAttribute('data-teinte'); } else { html.setAttribute('data-teinte', suivante); }
    try { localStorage.setItem('teinte', suivante); } catch (e) {}
    majBulle();
  });
})();

/* ---- le marketing accéléré : toute la carte ouvre et referme ---- */
(function () {
  var carte = document.querySelector('.ia-carte');
  if (!carte) return;
  var bouton = carte.querySelector('.ia-tete');
  var x0 = 0, y0 = 0;
  carte.addEventListener('pointerdown', function (e) { x0 = e.clientX; y0 = e.clientY; });
  carte.addEventListener('click', function (e) {
    /* un glisser pour sélectionner du texte n'est pas un clic */
    if (e.detail && Math.abs(e.clientX - x0) + Math.abs(e.clientY - y0) > 8) return;
    if (e.target.closest('a')) return;
    var ouverte = carte.classList.toggle('ouverte');
    bouton.setAttribute('aria-expanded', ouverte ? 'true' : 'false');
  });
})();

/* ---- références du hero : elles défilent seulement si, à leur
   vraie taille, elles ne tiennent pas sur une ligne ---- */
(function () {
  var bande = document.querySelector('.hero-logos');
  if (!bande) return;
  var logos = Array.prototype.slice.call(bande.children);
  var calme = window.matchMedia('(prefers-reduced-motion: reduce)');
  var uneLigne = window.matchMedia('(min-width: 900px) and (min-aspect-ratio: 1/1)');

  function remettre() {
    bande.classList.remove('defile');
    bande.innerHTML = '';
    logos.forEach(function (l) { bande.appendChild(l); });
  }
  function regler() {
    remettre();
    if (calme.matches || !uneLigne.matches) return;
    bande.classList.add('mesure');
    var deborde = bande.scrollWidth > bande.clientWidth + 1;
    bande.classList.remove('mesure');
    if (!deborde) return;
    var piste = document.createElement('div');
    piste.className = 'piste';
    logos.forEach(function (l) { piste.appendChild(l); });
    logos.forEach(function (l) {
      var copie = l.cloneNode(true);
      copie.removeAttribute('role');
      copie.setAttribute('alt', '');
      copie.setAttribute('aria-hidden', 'true');
      piste.appendChild(copie);
    });
    bande.appendChild(piste);
    bande.classList.add('defile');
  }
  var t;
  window.addEventListener('resize', function () { clearTimeout(t); t = setTimeout(regler, 150); });
  if (calme.addEventListener) { calme.addEventListener('change', regler); uneLigne.addEventListener('change', regler); }
  if (document.readyState === 'complete') regler(); else window.addEventListener('load', regler);
})();
