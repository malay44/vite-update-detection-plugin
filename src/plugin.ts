import type { Plugin } from "vite";
import fs from "fs";
import path from "path";

export type VitePluginVersionOptions = {
  version: string;
};

function vitePluginVersion({ version }: VitePluginVersionOptions): Plugin {
  return {
    name: "vite-plugin-version",
    version: "1.0.0",
    apply(config, env) {
      return env.command === "build" && !config.build?.ssr;
    },
    writeBundle: {
      sequential: true,
      order: "post",
      handler({ dir }) {
        if (!dir) return;
        const file = path.resolve(dir, "version.json");
        const serializedVersion = JSON.stringify({ version });
        fs.writeFileSync(file, serializedVersion);
      },
    },
  };
}

export default vitePluginVersion;
