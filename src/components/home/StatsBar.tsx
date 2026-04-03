/**
 * StatsBar — Homepage statistics banner. All numbers from DB.
 * Uses dictionary for labels.
 */

import { getSiteStats } from "@/lib/queries";
import { StatsBarClient } from "./StatsBarClient";

export default async function StatsBar() {
  const { systemCount, frameworkCount, industryCount } = await getSiteStats();
  return <StatsBarClient systemCount={systemCount} frameworkCount={frameworkCount} industryCount={industryCount} />;
}
