function readPackage(pkg, context) {
  const pkgs = [
    "vue-loader",
    "ssr-plugin-vue3",
    "ssr-plugin-vue",
    "ssr-plugin-react",
    "@rspack/core",
  ];
  if (pkgs.includes(pkg.name) && process.env.GITHUB_JOB) {
    const webpackVersion = process.env.GITHUB_JOB.includes("rspack") ? "^5.0.0" : "^4.0.0";
    pkg.dependencies.webpack = webpackVersion;
    pkg.peerDependencies.webpack = webpackVersion;
  }

  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
