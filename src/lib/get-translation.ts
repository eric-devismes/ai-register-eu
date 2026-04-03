/**
 * Translation Retrieval — Get translated content from the database.
 *
 * Falls back to the English source field if no translation exists.
 * Used by all public pages to serve content in the user's language.
 */

import { prisma } from "@/lib/db";
import type { Locale } from "@/lib/i18n";

/**
 * Get a single translated field value.
 * Returns the translation if available, otherwise the English fallback.
 */
export async function getTranslatedField(
  entityType: string,
  entityId: string,
  locale: Locale,
  field: string,
  englishFallback: string
): Promise<string> {
  if (locale === "en") return englishFallback;

  const translation = await prisma.translation.findUnique({
    where: {
      entityType_entityId_locale_field: {
        entityType,
        entityId,
        locale,
        field,
      },
    },
  });

  return translation?.value || englishFallback;
}

/**
 * Get multiple translated fields for an entity at once.
 * Returns an object with field names as keys and translated values.
 * Falls back to English for missing translations.
 */
export async function getTranslatedFields(
  entityType: string,
  entityId: string,
  locale: Locale,
  englishFields: Record<string, string>
): Promise<Record<string, string>> {
  if (locale === "en") return englishFields;

  const fieldNames = Object.keys(englishFields);

  const translations = await prisma.translation.findMany({
    where: {
      entityType,
      entityId,
      locale,
      field: { in: fieldNames },
    },
  });

  // Build result: use translation if available, else English
  const result: Record<string, string> = {};
  for (const field of fieldNames) {
    const found = translations.find((t) => t.field === field);
    result[field] = found?.value || englishFields[field];
  }

  return result;
}

/**
 * Batch-translate multiple entities of the same type.
 * Useful for list pages where you need translations for many items at once.
 */
export async function getTranslatedBatch(
  entityType: string,
  entityIds: string[],
  locale: Locale,
  fields: string[]
): Promise<Map<string, Record<string, string>>> {
  if (locale === "en") return new Map();

  const translations = await prisma.translation.findMany({
    where: {
      entityType,
      entityId: { in: entityIds },
      locale,
      field: { in: fields },
    },
  });

  // Group by entityId
  const map = new Map<string, Record<string, string>>();
  for (const t of translations) {
    if (!map.has(t.entityId)) map.set(t.entityId, {});
    map.get(t.entityId)![t.field] = t.value;
  }

  return map;
}
