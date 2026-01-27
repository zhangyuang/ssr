import { resolve } from "path";
import { exec } from "shelljs";
import { networkInterfaces } from "os";
import { getCwd, loadConfig, logGreen } from "ssr-common-utils";
import type { Argv } from "ssr-types";
import { getNormalizeArgv, morethan10 } from "./utils";

const morethan = morethan10();
const spinner = require("ora")("starting ");
const singleDash = ["c", "p", "w", "d", "e", "h"].concat(morethan ? "b" : "");
const doubleDash = [
  "config",
  "path",
  "watch",
  "watchAssets",
  "debug",
  "webpack",
  "webpackPath",
  "tsc",
  "exec",
  "preserveWatchOutput",
  "help",
].concat(morethan ? "builder" : "");

const getLocalNetworkAddress = () => {
  const nets = networkInterfaces();
  for (const name of Object.keys(nets)) {
    const netInterface = nets[name];
    if (netInterface) {
      for (const net of netInterface) {
        if (net.family === "IPv4" && !net.internal) {
          return net.address;
        }
      }
    }
  }
  return null;
};

const start = async (argv: Argv) => {
  const cwd = getCwd();
  const { serverPort, nestStartTips } = loadConfig();
  spinner.start();
  if (morethan) {
    argv.b = argv.b || "swc"; // swc has initilized twice bug
    // argv.b = argv.b || 'tsc'
  } // use swc as default compiler when nestjs >=10

  const normalizeArgv = getNormalizeArgv(argv, {
    singleDash,
    doubleDash,
  });
  const { stdout, stderr } = exec(
    `${resolve(cwd, "./node_modules/.bin/nest")} start --watch ${normalizeArgv}`,
    {
      async: true,
      silent: true,
      env: { ...process.env, FORCE_COLOR: "1" },
    },
  );

  stdout?.on("data", function (data) {
    console.log(data);
    if (data.match("Nest application successfully started")) {
      spinner.stop();
      const https = process.env.HTTPS;
      const protocol = https ? "https" : "http";
      const networkAddress = getLocalNetworkAddress();

      if (nestStartTips) {
        logGreen(nestStartTips);
      } else {
        logGreen(`Server is listening on:`);
        logGreen(`  ➜  Local:   ${protocol}://127.0.0.1:${serverPort}`);
        logGreen(`  ➜  Local:   ${protocol}://localhost:${serverPort}`);
        if (networkAddress) {
          logGreen(`  ➜  Network: ${protocol}://${networkAddress}:${serverPort}`);
        }
      }
    }
  });
  stderr?.on("data", function (data) {
    if (
      !data.includes("DeprecationWarning") &&
      !data.includes("has been deprecated") &&
      !data.includes("reflect-metadata doesn't appear to be written in CJS")
    ) {
      console.error(`error: ${data}`);
    }
  });
};

export { start };
