/**
 * Services page — redirects to /pricing (merged into Plans & Services).
 */

import { redirect } from "next/navigation";

export default async function ServicesPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/pricing`);
}
