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
  pollInterval = 60000, // default poll interval to 60 seconds
}: VitePluginVersionOptions): PluginOption {
  return {
    name: "vite-plugin-update-detection",
    version: "0.0.1",
    config(config, env) {
      if (env.command === "build" && !config.build?.ssr) {
        process.env.VITE_APP_VERSION = version;
        process.env.VITE_APP_VERSION_FILE = versionFile;
        process.env.VITE_APP_VERSION_POLL_INTERVAL = pollInterval.toString();
      }
    },
    generateBundle: {
      order: "post",
      handler({ dir }) {
        if (!dir) {
          console.error(
            "vite-plugin-update-detection: output directory not found"
          );
          return;
        }

        const filePath = path.join(dir, versionFile);
        const versionData = JSON.stringify({ version });
        fs.writeFileSync(filePath, versionData);
      },
    },
  };
}

export default vitePluginVersion;
