/**
 * Generate dictionary files for all non-English locales.
 * Uses hardcoded translations for key languages, English fallback for others.
 * Run: node scripts/generate-dictionaries.js
 *
 * Once DeepL is configured, these can be regenerated with proper translations.
 */

const fs = require("fs");
const path = require("path");

const en = require("../src/dictionaries/en.json");

// Key translations for major languages (manual, high quality)
const translations = {
  de: {
    "common.home": "Startseite", "common.database": "KI-Datenbank", "common.regulations": "Vorschriften",
    "common.industries": "Branchen", "common.pricing": "Preise", "common.about": "\u00dcber uns",
    "common.methodology": "Methodik", "common.privacy": "Datenschutzerkl\u00e4rung",
    "common.signIn": "Anmelden", "common.myAccount": "Mein Konto", "common.signUp": "Kostenlos registrieren",
    "common.search": "Suchen", "common.all": "Alle", "common.back": "Zur\u00fcck",
    "common.lastUpdated": "Zuletzt aktualisiert", "common.systems": "Systeme", "common.criteria": "Kriterien",
    "hero.badge": "Unabh\u00e4ngig und herstellerneutral",
    "hero.title": "Die europ\u00e4ische Referenzdatenbank f\u00fcr",
    "hero.titleHighlight": "KI-Tool-Intelligenz",
    "hero.subtitle": "Umfassende, unabh\u00e4ngige Bewertungen von KI-Systemen in der Europ\u00e4ischen Union \u2014 abgebildet auf den AI Act, die DSGVO, DORA und sektorspezifische Vorschriften.",
    "hero.ctaDatabase": "KI-Datenbank erkunden", "hero.ctaMethodology": "Methodik ansehen",
    "hero.searchPlaceholder": "KI-Systeme, Anbieter oder Vorschriften suchen...", "hero.searchButton": "Datenbank durchsuchen",
    "stats.aiToolsRated": "bewertete KI-Tools", "stats.regulatoryFrameworks": "regulatorische Rahmenwerke",
    "stats.industriesCovered": "abgedeckte Branchen", "stats.euMemberStates": "kartierte EU-Mitgliedstaaten",
    "featured.title": "Ausgew\u00e4hlte KI-Systeme",
    "featured.subtitle": "Unabh\u00e4ngige Bewertungen f\u00fchrender KI-Plattformen in europ\u00e4ischen Unternehmen.",
    "featured.complianceScores": "Compliance-Bewertungen", "featured.overall": "Gesamt",
    "featured.fullAssessment": "Vollst\u00e4ndige Bewertung", "featured.browseAll": "Alle KI-Systeme durchsuchen",
    "frameworks.title": "Regulatorische Rahmenwerke",
    "frameworks.subtitle": "Wir bewerten KI-Systeme anhand der wichtigsten europ\u00e4ischen Vorschriften.",
    "browseIndustry.title": "Nach Branche durchsuchen",
    "browseIndustry.subtitle": "Entdecken Sie branchenrelevante KI-Systeme mit ma\u00dfgeschneiderten Compliance-Analysen.",
    "database.title": "KI-Systeme suchen und vergleichen",
    "database.searchPlaceholder": "Nach Name, Anbieter oder Typ suchen...",
    "assessment.complianceAssessment": "Compliance-Bewertung", "assessment.overallScore": "Gesamtbewertung",
    "assessment.dataHandling": "Datenverarbeitung", "assessment.security": "Sicherheit",
    "assessment.transparency": "KI-Transparenz", "assessment.euCompliance": "EU-Compliance-Status",
  },
  es: {
    "common.home": "Inicio", "common.database": "Base de datos IA", "common.regulations": "Regulaciones",
    "common.industries": "Sectores", "common.pricing": "Precios", "common.about": "Acerca de",
    "common.signIn": "Iniciar sesi\u00f3n", "common.myAccount": "Mi cuenta", "common.signUp": "Reg\u00edstrese gratis",
    "common.search": "Buscar", "common.all": "Todos", "common.lastUpdated": "\u00daltima actualizaci\u00f3n",
    "hero.badge": "Independiente y neutral",
    "hero.title": "La referencia europea para",
    "hero.titleHighlight": "la inteligencia de herramientas IA",
    "hero.subtitle": "Evaluaciones completas e independientes de sistemas de IA en la Uni\u00f3n Europea \u2014 alineadas con el AI Act, el RGPD, DORA y regulaciones sectoriales.",
    "hero.ctaDatabase": "Explorar base de datos IA", "hero.ctaMethodology": "Ver metodolog\u00eda",
    "stats.aiToolsRated": "herramientas IA evaluadas", "stats.regulatoryFrameworks": "marcos regulatorios",
    "featured.title": "Sistemas IA destacados",
    "featured.subtitle": "Evaluaciones independientes de las principales plataformas IA utilizadas en empresas europeas.",
    "frameworks.title": "Marcos regulatorios",
    "browseIndustry.title": "Explorar por sector",
    "database.title": "Buscar y comparar sistemas IA",
  },
  it: {
    "common.home": "Home", "common.database": "Database IA", "common.regulations": "Regolamenti",
    "common.industries": "Settori", "common.pricing": "Prezzi", "common.about": "Chi siamo",
    "common.signIn": "Accedi", "common.myAccount": "Il mio account", "common.signUp": "Registrati gratis",
    "common.search": "Cerca", "common.all": "Tutti", "common.lastUpdated": "Ultimo aggiornamento",
    "hero.badge": "Indipendente e neutrale",
    "hero.title": "Il riferimento europeo per",
    "hero.titleHighlight": "l'intelligence degli strumenti IA",
    "hero.subtitle": "Valutazioni complete e indipendenti dei sistemi IA nell'Unione Europea \u2014 in conformit\u00e0 con l'AI Act, il GDPR, DORA e le normative settoriali.",
    "hero.ctaDatabase": "Esplora il database IA", "hero.ctaMethodology": "Vedi metodologia",
    "stats.aiToolsRated": "strumenti IA valutati", "stats.regulatoryFrameworks": "quadri normativi",
    "featured.title": "Sistemi IA in evidenza",
    "frameworks.title": "Quadri normativi",
    "browseIndustry.title": "Esplora per settore",
    "database.title": "Cerca e confronta sistemi IA",
  },
};

// Generate a dictionary for a locale by overlaying translations on English
function generateDict(locale) {
  const overrides = translations[locale] || {};
  const result = JSON.parse(JSON.stringify(en)); // deep clone

  for (const [key, value] of Object.entries(overrides)) {
    const [section, field] = key.split(".");
    if (result[section] && field) {
      result[section][field] = value;
    }
  }

  return result;
}

const locales = ["de", "es", "it", "nl", "pl", "ro", "pt", "cs", "el", "hu", "sv", "bg"];
const dictDir = path.join(__dirname, "..", "src", "dictionaries");

for (const locale of locales) {
  const dict = generateDict(locale);
  const filePath = path.join(dictDir, `${locale}.json`);
  fs.writeFileSync(filePath, JSON.stringify(dict, null, 2));
  console.log(`Generated ${locale}.json (${Object.keys(translations[locale] || {}).length} overrides)`);
}

console.log("\nDone! Generated dictionaries for", locales.length, "locales.");
console.log("Languages with full translations: de, es, it, fr");
console.log("Languages with English fallback: nl, pl, ro, pt, cs, el, hu, sv, bg");
console.log("(These will be properly translated when DeepL API key is added)");
