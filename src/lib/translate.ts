/**
 * Translation Service — Auto-translates content via DeepL API.
 *
 * Called after every admin content save. Translates to 13 target locales
 * and caches results in the Translation table.
 *
 * Requires DEEPL_API_KEY in .env.local.
 * Without a key, translations are skipped (English-only mode).
 */

import { prisma } from "@/lib/db";
import { locales, deeplLocaleMap, type Locale } from "@/lib/i18n";

// Target locales (everything except English)
const targetLocales = locales.filter((l) => l !== "en") as Locale[];

// ─── DeepL Client ────────────────────────────────────────

let deeplTranslate: ((text: string, targetLang: string) => Promise<string>) | null = null;

async function initDeepL() {
  if (deeplTranslate) return;
  const apiKey = process.env.DEEPL_API_KEY;
  if (!apiKey) {
    console.log("[translate] No DEEPL_API_KEY — translations disabled");
    return;
  }

  const { Translator } = await import("deepl-node");
  const translator = new Translator(apiKey);

  deeplTranslate = async (text: string, targetLang: string) => {
    const result = await translator.translateText(
      text,
      "en" as "en",
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      targetLang as any
    );
    if (Array.isArray(result)) return result[0].text;
    return result.text;
  };
}

// ─── Public API ──────────────────────────────────────────

/**
 * Translate multiple fields for an entity into all target locales.
 * Stores results in the Translation table.
 *
 * Called asynchronously after admin saves — does not block the save.
 *
 * @param entityType - "framework", "system", "section", "statement", "industry", "changelog"
 * @param entityId - The database ID of the entity
 * @param fields - Object of { fieldName: englishText } to translate
 */
export async function translateContent(
  entityType: string,
  entityId: string,
  fields: Record<string, string>
) {
  await initDeepL();

  if (!deeplTranslate) {
    // No API key — skip translation silently
    return;
  }

  // Filter out empty fields
  const nonEmpty = Object.entries(fields).filter(([, v]) => v && v.trim().length > 0);
  if (nonEmpty.length === 0) return;

  console.log(`[translate] Translating ${nonEmpty.length} fields for ${entityType}/${entityId} into ${targetLocales.length} locales...`);

  for (const locale of targetLocales) {
    const deeplLang = deeplLocaleMap[locale];

    for (const [field, text] of nonEmpty) {
      try {
        const translated = await deeplTranslate(text, deeplLang);

        await prisma.translation.upsert({
          where: {
            entityType_entityId_locale_field: {
              entityType,
              entityId,
              locale,
              field,
            },
          },
          update: { value: translated },
          create: { entityType, entityId, locale, field, value: translated },
        });
      } catch (error) {
        console.error(`[translate] Failed: ${entityType}/${entityId}/${locale}/${field}:`, error);
        // Continue with other translations — don't fail the whole batch
      }
    }
  }

  console.log(`[translate] Done: ${entityType}/${entityId}`);
}

/**
 * Delete all translations for an entity (called when entity is deleted).
 */
export async function deleteTranslations(entityType: string, entityId: string) {
  await prisma.translation.deleteMany({
    where: { entityType, entityId },
  });
}
