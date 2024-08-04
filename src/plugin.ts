import type { PluginOption } from "vite";
import fs from "node:fs";
import path from "path";

export type VitePluginVersionOptions = {
  version: string;
  pollInterval?: number;
};

const versionFile = "version.json";

function vitePluginVersion({
  version,
  pollInterval,
}: VitePluginVersionOptions): PluginOption {
  return {
    name: "vite-plugin-update-detection",
    version: "0.0.1",
    apply(config, env) {
      if (env.command === "build" && !config.build?.ssr) {
        process.env.VITE_APP_VERSION = version;
        process.env.VITE_APP_VERSION_FILE = versionFile;
        process.env.VITE_APP_VERSION_POLL_INTERVAL = `${pollInterval}`;
        return true;
      }
      return false;
    },
    writeBundle: {
      sequential: true,
      order: "post",
      handler({ dir }) {
        if (!dir) {
          console.error(
            "vite-plugin-update-detection: version file path not found"
          );
          return;
        }
        const file = path.join(dir, versionFile);
        const serializedVersion = JSON.stringify({ version });
        fs.writeFileSync(file, serializedVersion);
      },
    },
  };
}

export default vitePluginVersion;
