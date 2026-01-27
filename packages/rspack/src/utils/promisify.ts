import { rspack } from "@rspack/core";
import type { Compiler, RspackOptions, Stats } from "@rspack/core";

const errorEmitPlugin = function (compiler: Compiler) {
  compiler.hooks.done.tapAsync("done", function (stats, callback) {
    if (stats.compilation.errors.length > 0) {
      const isDev = process.env.NODE_ENV !== "production";
      console.error(stats.compilation.errors);
      if (!isDev) {
        process.exit(1);
      }
    }
    callback();
  });
};
const rspackPromisify = async (config: RspackOptions): Promise<Stats> => {
  config.plugins?.push(errorEmitPlugin);
  return await new Promise((resolve, reject) => {
    rspack(config, (err, stats: Stats | undefined) => {
      if (err) {
        reject(err);
      }
      resolve(stats!);
    });
  });
};

export { rspackPromisify };
