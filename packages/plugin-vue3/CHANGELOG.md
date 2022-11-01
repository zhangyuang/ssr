## [6.2.70](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.68...plugin-vue3@6.2.70) (2022-11-01)


### Bug Fixes

* onlyCsr types core-vue3 render logic ([f75929e](https://github.com/zhangyuang/ssr/commit/f75929ef84e564fe7e3d9c5c6d1e56fe70f5629b))
* react hmr ([2c57a6e](https://github.com/zhangyuang/ssr/commit/2c57a6e14d485500a2e8868035d9cb6e1fa883b0))
* types ([2ad371f](https://github.com/zhangyuang/ssr/commit/2ad371fc6c0b27e6e52801048a28a3d8fdcfccf7))


### Features

* customScript support tagName ([91a836f](https://github.com/zhangyuang/ssr/commit/91a836f0b423b46f730a2c893b56f89bddd470c5))
* support fastify close [#245](https://github.com/zhangyuang/ssr/issues/245) ([#246](https://github.com/zhangyuang/ssr/issues/246)) ([d9c24c5](https://github.com/zhangyuang/ssr/commit/d9c24c595941447c5e8072c63c1a80cba06689c3))
* support more babelOptions like include exclude ([4a2b254](https://github.com/zhangyuang/ssr/commit/4a2b254f4f6a9996bf3c3f9fea561636d61b85ac))
* update react alias ([160b991](https://github.com/zhangyuang/ssr/commit/160b9911166172f36db9690be87f35fcbfc747aa))
* update sprops types ([9383235](https://github.com/zhangyuang/ssr/commit/9383235321f171b4d5c877d08025e9b9936175d3))
* update vite build logic ([0bf7a28](https://github.com/zhangyuang/ssr/commit/0bf7a28ca38f2cde8501dfb53546f4d3b0c6f51f))
* use jsx-runtime in react ([ffdd346](https://github.com/zhangyuang/ssr/commit/ffdd34674ff0753e130b6570ab9eef3b1aec5217))



## [6.2.69](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.68...plugin-vue3@6.2.69) (2022-10-17)


### Bug Fixes

* react hmr ([2c57a6e](https://github.com/zhangyuang/ssr/commit/2c57a6e14d485500a2e8868035d9cb6e1fa883b0))


### Features

* support more babelOptions like include exclude ([4a2b254](https://github.com/zhangyuang/ssr/commit/4a2b254f4f6a9996bf3c3f9fea561636d61b85ac))



## [6.2.68](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.67...plugin-vue3@6.2.68) (2022-09-27)


### Features

* add env flag when ssg ([32fef6f](https://github.com/zhangyuang/ssr/commit/32fef6f8d43bf2cecb867f6d0e2d9f8e6d113224))
* remove css-hot-loader inject ssrDevInfo in vue3 ([e4a28f6](https://github.com/zhangyuang/ssr/commit/e4a28f66ae019bbd5a11df649b8ffe92f6b2b2da))
* use ssr-mini-css-extra-plugin for micro ([fa1c025](https://github.com/zhangyuang/ssr/commit/fa1c025b19b38733c20b11a40860b7eb648387e6))



## [6.2.67](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.66...plugin-vue3@6.2.67) (2022-09-25)


### Features

* support ssg ([27e2c7c](https://github.com/zhangyuang/ssr/commit/27e2c7cfb88ce6fa07f393a231d22a1d60b36fd2))
* update vue2/react logic in plugin ([e2d576b](https://github.com/zhangyuang/ssr/commit/e2d576b92bf8a0e9615480c2d7cccb42ad59635d))
* 完善 ssg 文档 ([384b85a](https://github.com/zhangyuang/ssr/commit/384b85a820043dc9154677ace66e16568d322aca))



## [6.2.66](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.65...plugin-vue3@6.2.66) (2022-09-15)


### Features

* move render app logic in server-render not in core ([8638ab2](https://github.com/zhangyuang/ssr/commit/8638ab2970bbd9e47598d93e7038f8f599ea82f5))



## [6.2.65](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.64...plugin-vue3@6.2.65) (2022-09-06)


### Bug Fixes

* don't inject dynamic js chunk in html for sourcemap ([7771694](https://github.com/zhangyuang/ssr/commit/7771694d1e34ab2fccf5e411a5b7611047b38a23))
* nest start tips ([ac7f0a1](https://github.com/zhangyuang/ssr/commit/ac7f0a1a50b5765fcd00d00195b5a413070ac0b3))


### Features

* close css less sourcemap ([7936f71](https://github.com/zhangyuang/ssr/commit/7936f71a5db4faeb6b84a5a15967d19c5d8c606b))
* use eval-source-map replace cheap-sourcemap in dev ([1bd615e](https://github.com/zhangyuang/ssr/commit/1bd615e52b24334f727c3c0c13113125670c776f))



## [6.2.64](https://github.com/zhangyuang/ssr/compare/plugin-vue3@6.2.63...plugin-vue3@6.2.64) (2022-08-31)


### Bug Fixes

* hidden nest build warning ([28e809d](https://github.com/zhangyuang/ssr/commit/28e809da607a77e6e0d97075c179d3b0a53a988d))
* spinner.stop when stdout end ([9636fc6](https://github.com/zhangyuang/ssr/commit/9636fc650cf8f9050381480f06c58103f1806d05))
* update correct cwd in postinstall ([fff08ef](https://github.com/zhangyuang/ssr/commit/fff08efe37436f96e599f2265b1931c0a1d6df72))
* update postinstall ([1078a50](https://github.com/zhangyuang/ssr/commit/1078a50254f27de58525ffec4f7c92a60e4dc03c))


### Features

* close default hmr host ([f415d73](https://github.com/zhangyuang/ssr/commit/f415d7363a0a40f36074402eb8db7747538e05a1))
* move nestjs-pinia example in ([d214b2c](https://github.com/zhangyuang/ssr/commit/d214b2ccded3d3dc43092b43c9c69ee2122c9bd5))
* use esbuild transform manualroutes ([cf77fcd](https://github.com/zhangyuang/ssr/commit/cf77fcd489a02deb49d7c85def240f4f19367ad9))



