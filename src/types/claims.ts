export interface ClaimRow {
  id: string;
  field: string;
  value: string;
  evidenceQuote: string;
  confidence: string;
  verifiedAt: string | null;
  stale: boolean;
  source: { url: string; label: string; tier: number } | null;
}

// Maps system field names → claim prefix stored in the DB
export const FIELD_TO_CLAIM_PREFIX: Record<string, string> = {
  certifications:  "certifications",
  dpaDetails:      "dpa",
  subprocessors:   "subprocessors",
  trainingDataUse: "trainingDataUse",
  euResidency:     "euResidency",
  dataStorage:     "euResidency",
  dataProcessing:  "euResidency",
  encryptionInfo:  "encryption",
  accessControls:  "accessControls",
  aiActStatus:     "aiActStatus",
  gdprStatus:      "gdprStatus",
  dataPortability: "dataPortability",
  exitTerms:       "exitTerms",
};
