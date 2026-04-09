/**
 * Ratings page — redirects to /methodology (content was duplicated).
 */

import { redirect } from "next/navigation";

export default async function RatingsPage({
  params,
}: {
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  redirect(`/${lang}/methodology`);
}
