/* ============================================================
   Hervé Peitrequin — configuration centrale
   Nom, coordonnées, liens et données partagées :
   à modifier UNIQUEMENT ici.
   ============================================================ */
window.SITE = {
  /* identité — le nom seul, très discret dans le header et le footer.
     L'offre est exprimée dans le hero, pas dans un nom de marque. */
  nameLines: ["Hervé Peitrequin"],
  name: "Hervé Peitrequin",
  founder: "Hervé Peitrequin",
  location: "1006 Lausanne, Suisse",
  city: "1006 Lausanne, Suisse",

  /* TODO: URL de production définitive (domaine à venir) */
  url: "",

  /* l'adresse est assemblée ici et posée par script dans la page :
     elle n'apparaît en clair nulle part dans le HTML (robots) */
  courriel: ["herve", "hervepeitrequin.ch"].join("@"),

  calendlyUrl: "https://calendly.com/hervepeitrequin/30min",

  /* TODO: numéro WhatsApp Business (numéro fictif en attendant ; format
     international sans +). Sert aussi aux pages DE et EN. */
  whatsappNumero: "41000000000",
  whatsapp: "https://wa.me/41000000000?text=" + encodeURIComponent("Bonjour, je souhaiterais discuter d'un projet marketing pour notre organisation."),

  linkedinUrl: "https://www.linkedin.com/in/hervepeitrequin/",

  /* logos clients — source unique pour la home et la page À propos */
  logos: [
    { src: "images/logos/swisscom.svg", alt: "Swisscom" },
    { src: "images/logos/fischer.svg", alt: "Fischer Connectors" },
    { src: "images/logos/loreal.svg", alt: "L'Oréal" },
    { src: "images/logos/coople.svg", alt: "Coople" },
    { src: "images/logos/bulgari.svg", alt: "Bulgari" },
    { src: "images/logos/isl.png", alt: "International School of Lausanne", haut: true },
    { src: "images/logos/oxfam.svg", alt: "Oxfam", haut: true }
  ]
};

/* alias rétrocompatibles pour les attributs data-link existants */
window.SITE.email = "mailto:" + window.SITE.courriel;
window.SITE.booking = window.SITE.calendlyUrl;
window.SITE.linkedin = window.SITE.linkedinUrl;
