import { resolve } from "path";
import { loadConfig, getCwd } from "ssr-common-utils";

const { tool } = loadConfig();

export function clientPlugin() {
  const cwd = getCwd();
  const webpackPath = resolve(cwd, "./node_modules/ssr-webpack");
  const vitePath = resolve(cwd, "./node_modules/ssr-vite");
  const rspackPath = resolve(cwd, "./node_modules/ssr-rspack");
  return {
    name: "plugin-react",
    start: async () => {
      if (tool === "vite") {
        const { start } = await import(vitePath);
        await start();
      } else {
        if (tool === "rspack") {
          const { start } = await import(rspackPath);
          await start();
          return;
        }
        const { start } = await import(webpackPath);
        await start();
      }
    },
    build: async () => {
      if (tool === "vite") {
        const { build } = await import(vitePath);
        await build();
      } else {
        if (tool === "rspack") {
          const { build } = await import(rspackPath);
          await build();
          return;
        }
        const { build } = await import(webpackPath);
        await build();
      }
    },
  };
}
