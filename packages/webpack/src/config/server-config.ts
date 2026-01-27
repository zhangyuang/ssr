import { loadConfig, getBuildEntry } from "ssr-common-utils";
import WebpackChain from "webpack-chain";

import { getBaseConfig } from "./base-config";

const getServerWebpack = (chain: WebpackChain) => {
  const config = loadConfig();
  const { isDev, getOutput, chainServerConfig, chunkName } = config;

  getBaseConfig(chain, true);
  chain.target("node");
  chain
    .entry(chunkName)
    .add(getBuildEntry().server)
    .end()
    .output.path(getOutput().serverOutPut)
    .filename("[name].server.js")
    .libraryTarget("commonjs")
    .end();

  chain.optimization.minimize(false);

  chain.when(isDev, () => {
    chain.watch(true);
  });

  chainServerConfig(chain); // 合并用户自定义配置

  return chain.toConfig();
};

export { getServerWebpack };
