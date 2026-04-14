/**
 * CLI runner for the evidence fetcher pipeline.
 *
 *   npm run evidence:fetch                   # all active sources
 *   npm run evidence:fetch -- --system <id>  # one system only
 *
 * Logs a structured JSON summary suitable for piping into jq.
 * Useful while developing the fetcher locally without going through
 * the cron/HTTP path. The cron in production calls the same
 * runEvidenceFetcher() via /api/admin/evidence-fetch.
 */

// Env is loaded via tsx's --env-file flag in the npm script. Loading dotenv
// here at top of file would be too late: ESM hoists imports, and the chain
// (evidence-fetcher → @/lib/db → createPrismaClient) reads DATABASE_URL at
// module-load time, before any code in this file has a chance to run.

import { runEvidenceFetcher } from "../src/lib/evidence-fetcher.ts";

function parseArgs(): { systemId?: string } {
  const out: { systemId?: string } = {};
  const argv = process.argv.slice(2);
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--system" || argv[i] === "--systemId") {
      out.systemId = argv[i + 1];
      i++;
    }
  }
  return out;
}

async function main() {
  const { systemId } = parseArgs();
  if (systemId) {
    console.log(`🔎 Evidence fetcher — scoped to systemId=${systemId}`);
  } else {
    console.log("🔎 Evidence fetcher — full sweep over all active sources");
  }

  const stats = await runEvidenceFetcher(systemId ? { systemId } : undefined);

  console.log("\n📊 Stats");
  console.log(`   Sources checked:     ${stats.sourcesChecked}`);
  console.log(`   Snapshots written:   ${stats.snapshotsWritten}`);
  console.log(`   Unchanged:           ${stats.unchanged}`);
  console.log(`   Changed:             ${stats.changed}`);
  console.log(`   Fetch errors:        ${stats.fetchErrors}`);
  console.log(`   Review tasks opened: ${stats.reviewTasksCreated}`);
  console.log(`   Duration:            ${stats.durationMs}ms`);

  console.log("\n📑 Per-source");
  for (const row of stats.perSource) {
    const tag =
      row.status === "unchanged" ? "·" :
      row.status === "first-snapshot" ? "✚" :
      row.status === "changed" ? "Δ" :
      "✗";
    const err = row.error ? `  — ${row.error}` : "";
    console.log(`   ${tag} [${row.status.padEnd(15)}] ${row.url}${err}`);
  }

  console.log("\n✅ Done");
}

main()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
