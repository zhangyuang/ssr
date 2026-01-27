import { startClientServer, startClientBuild } from "./client";
import { startServerBuild } from "./server";
import { getServerRspack } from "./config/server-config";
import { getClientRspack } from "./config/client-config";
import { default as RspackChain } from "rspack-chain";

export const start = async () => {
  const serverConfigChain = new RspackChain();
  const clientConfigChain = new RspackChain();
  await Promise.all([
    startServerBuild(getServerRspack(serverConfigChain)),
    startClientServer(getClientRspack(clientConfigChain)),
  ]);
};

export const build = async () => {
  const serverConfigChain = new RspackChain();
  const clientConfigChain = new RspackChain();
  await Promise.all([
    startServerBuild(getServerRspack(serverConfigChain)),
    startClientBuild(getClientRspack(clientConfigChain)),
  ]);
};
