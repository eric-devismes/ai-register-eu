/** Change types for changelog entries */
export const CHANGE_TYPES = [
  "update", "amendment", "jurisprudence", "new_version",
  "incident", "certification", "correction",
] as const;

export const TYPE_LABELS: Record<string, string> = {
  update: "Update \u2014 General content update",
  amendment: "Amendment \u2014 Official regulation change",
  jurisprudence: "Jurisprudence \u2014 Court ruling or interpretation",
  new_version: "New Version \u2014 Vendor product update",
  incident: "Incident \u2014 Security breach or compliance issue",
  certification: "Certification \u2014 New certification obtained/lost",
  correction: "Correction \u2014 Fix to previous assessment",
};
