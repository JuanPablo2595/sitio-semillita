import { spawnSync } from "node:child_process";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const astroCli = resolve(projectRoot, "node_modules", "astro", "astro.js");

const result = spawnSync(process.execPath, [astroCli, ...process.argv.slice(2)], {
  cwd: projectRoot,
  env: {
    ...process.env,
    ASTRO_TELEMETRY_DISABLED: "1",
    NO_UPDATE_NOTIFIER: "1",
  },
  stdio: "inherit",
});

process.exit(result.status ?? 1);
