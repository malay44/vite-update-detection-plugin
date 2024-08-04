import type { Plugin } from "vite";
import fs from "node:fs";
import path from "path";

export type VitePluginVersionOptions = {
  version: string;
  pollInterval?: number;
};

function vitePluginVersion({
  version,
  pollInterval,
}: VitePluginVersionOptions): Plugin {
  return {
    name: "vite-plugin-version",
    version: "0.0.0",
    apply(config, env) {
      if (!config.build?.outDir) {
        console.error("vite-plugin-version: No output directory found");
        return false;
      }
      if (env.command === "build" && !config.build?.ssr) {
        process.env.VITE_APP_VERSION = version;
        process.env.VITE_APP_VERSION_FILE = path.resolve(
          config.build.outDir,
          "version.json"
        );
        process.env.VITE_APP_VERSION_POLL_INTERVAL = `${pollInterval}`;
        return true;
      }
      return false;
    },
    writeBundle: {
      sequential: true,
      order: "post",
      handler() {
        const file = process.env.VITE_APP_VERSION_FILE;
        if (!file) {
          console.error("vite-plugin-version: version file path not found");
          return;
        }
        const serializedVersion = JSON.stringify({ version });
        fs.writeFileSync(file, serializedVersion);
      },
    },
  };
}

export default vitePluginVersion;
