(function () {
  /* ---- configuration centrale : nom + liens (config.js) ---- */
  var S = window.SITE || {};
  document.querySelectorAll('[data-city]').forEach(function (el) {
    if (S.city) el.textContent = S.city;
  });

  /* ---- logos clients : composant partagé (home + à propos) ---- */
  document.querySelectorAll('[data-logos]').forEach(function (el) {
    (S.logos || []).forEach(function (l) {
      var img = document.createElement('img');
      img.src = l.src;
      img.alt = l.alt;
      img.loading = 'lazy';
      if (l.haut) img.className = 'lg-haut';
      el.appendChild(img);
    });
  });

  /* ---- liens (e-mail, réservation, WhatsApp, LinkedIn) ---- */
  document.querySelectorAll('[data-link]').forEach(function (el) {
    var key = el.getAttribute('data-link');
    var href = S[key];
    if (href) el.setAttribute('href', href);
    if (key === 'linkedin' || key === 'whatsapp') {
      el.setAttribute('target', '_blank');
      el.setAttribute('rel', 'noopener noreferrer');
    }
  });

  /* ---- footer partagé, dans la langue de la page ---- */
  var LANGS = {
    fr: { home: '/', signature: 'Direction marketing au mandat.', city: 'Suisse',
          legal: '/mentions-legales', legalLabel: 'Mentions légales',
          privacy: '/confidentialite', privacyLabel: 'Confidentialité' },
    de: { home: '/de/', signature: 'Marketingleitung im Mandat.', city: 'Schweiz',
          legal: '/de/impressum', legalLabel: 'Impressum',
          privacy: '/de/datenschutz', privacyLabel: 'Datenschutz' },
    en: { home: '/en/', signature: 'Fractional marketing leadership.', city: 'Switzerland',
          legal: '/en/legal-notice', legalLabel: 'Legal notice',
          privacy: '/en/privacy', privacyLabel: 'Privacy' }
  };
  var L = LANGS[(document.documentElement.lang || 'fr').slice(0, 2)] || LANGS.fr;
  document.querySelectorAll('[data-footer]').forEach(function (el) {
    el.innerHTML =
      '<div class="wrap footer-inner">' +
        '<div class="footer-id">' +
          '<a href="' + L.home + '" class="signature">' + L.signature + '</a>' +
          '<p>' + (S.founder || '') + '</p>' +
          '<p>1006 Lausanne, ' + L.city + '</p>' +
        '</div>' +
        '<div class="footer-links">' +
          '<a href="' + (S.email || '#') + '">E-mail</a>' +
          '<a href="' + (S.whatsapp || '#') + '" target="_blank" rel="noopener noreferrer">WhatsApp</a>' +
          '<a href="' + (S.linkedinUrl || '#') + '" target="_blank" rel="noopener noreferrer">LinkedIn</a>' +
          '<a href="' + L.legal + '">' + L.legalLabel + '</a>' +
          '<a href="' + L.privacy + '">' + L.privacyLabel + '</a>' +
        '</div>' +
      '</div>';
  });

  /* ---- barre collante : sur l'accueil, la signature n'apparaît
         qu'une fois le hero passé (elle y est déjà en grand) ---- */
  var barre = document.querySelector('.barre');
  var haut = document.querySelector('.hero, .page-hero');
  if (barre && haut && 'IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      barre.classList.toggle('barre-active', !entries[0].isIntersecting);
    }, { rootMargin: '-60px 0px 0px 0px', threshold: 0 }).observe(haut);
  } else if (barre) {
    barre.classList.add('barre-active');
  }

  /* ---- révélation au scroll ---- */
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
  }, { rootMargin: '0px 0px -8% 0px' });
  els.forEach(function (el) { io.observe(el); });
})();
