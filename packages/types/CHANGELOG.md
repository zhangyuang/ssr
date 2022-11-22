## [6.2.33](https://github.com/zhangyuang/ssr/compare/types@6.2.32...types@6.2.33) (2022-11-22)


### Bug Fixes

* call judgeServerFramework in node environment prevent utils be ([47cd81a](https://github.com/zhangyuang/ssr/commit/47cd81a18a85be507c7d43c323c294f2d5b8775d))
* gernerate html ([08e5678](https://github.com/zhangyuang/ssr/commit/08e567877e7b6d0b4b3a6fab6ad4ea2546b0c041))
* pinia alias ([2256194](https://github.com/zhangyuang/ssr/commit/22561948b9d27ea6296b5f60cefb3f42d6c1d4c1))


### Features

* support antd5 close [#250](https://github.com/zhangyuang/ssr/issues/250) ([c999536](https://github.com/zhangyuang/ssr/commit/c9995365fbd82faa30a006b51e5cd76ab307bab5))
* update vue alias ([36e15ac](https://github.com/zhangyuang/ssr/commit/36e15ac5d2d1398ced6abef2727970947177e6bc))



## [6.2.32](https://github.com/zhangyuang/ssr/compare/types@6.2.31...types@6.2.32) (2022-11-01)


### Features

* support fastify close [#245](https://github.com/zhangyuang/ssr/issues/245) ([#246](https://github.com/zhangyuang/ssr/issues/246)) ([d9c24c5](https://github.com/zhangyuang/ssr/commit/d9c24c595941447c5e8072c63c1a80cba06689c3))
* update react alias ([160b991](https://github.com/zhangyuang/ssr/commit/160b9911166172f36db9690be87f35fcbfc747aa))
* update vite build logic ([0bf7a28](https://github.com/zhangyuang/ssr/commit/0bf7a28ca38f2cde8501dfb53546f4d3b0c6f51f))
* use jsx-runtime in react ([ffdd346](https://github.com/zhangyuang/ssr/commit/ffdd34674ff0753e130b6570ab9eef3b1aec5217))



## [6.2.31](https://github.com/zhangyuang/ssr/compare/types@6.2.30...types@6.2.31) (2022-10-19)


### Bug Fixes

* types ([2ad371f](https://github.com/zhangyuang/ssr/commit/2ad371fc6c0b27e6e52801048a28a3d8fdcfccf7))



## [6.2.30](https://github.com/zhangyuang/ssr/compare/types@6.2.29...types@6.2.30) (2022-10-19)


### Bug Fixes

* onlyCsr types core-vue3 render logic ([f75929e](https://github.com/zhangyuang/ssr/commit/f75929ef84e564fe7e3d9c5c6d1e56fe70f5629b))


### Features

* update sprops types ([9383235](https://github.com/zhangyuang/ssr/commit/9383235321f171b4d5c877d08025e9b9936175d3))



## [6.2.29](https://github.com/zhangyuang/ssr/compare/types@6.2.28...types@6.2.29) (2022-10-18)


### Features

* customScript support tagName ([91a836f](https://github.com/zhangyuang/ssr/commit/91a836f0b423b46f730a2c893b56f89bddd470c5))
* support more babelOptions like include exclude ([4a2b254](https://github.com/zhangyuang/ssr/commit/4a2b254f4f6a9996bf3c3f9fea561636d61b85ac))



## [6.2.28](https://github.com/zhangyuang/ssr/compare/types@6.2.27...types@6.2.28) (2022-10-15)


### Bug Fixes

* react hmr ([2c57a6e](https://github.com/zhangyuang/ssr/commit/2c57a6e14d485500a2e8868035d9cb6e1fa883b0))


### Features

* add env flag when ssg ([32fef6f](https://github.com/zhangyuang/ssr/commit/32fef6f8d43bf2cecb867f6d0e2d9f8e6d113224))
* remove css-hot-loader inject ssrDevInfo in vue3 ([e4a28f6](https://github.com/zhangyuang/ssr/commit/e4a28f66ae019bbd5a11df649b8ffe92f6b2b2da))
* use ssr-mini-css-extra-plugin for micro ([fa1c025](https://github.com/zhangyuang/ssr/commit/fa1c025b19b38733c20b11a40860b7eb648387e6))



## [6.2.27](https://github.com/zhangyuang/ssr/compare/types@6.2.26...types@6.2.27) (2022-09-25)


### Features

* move render app logic in server-render not in core ([8638ab2](https://github.com/zhangyuang/ssr/commit/8638ab2970bbd9e47598d93e7038f8f599ea82f5))
* support ssg ([27e2c7c](https://github.com/zhangyuang/ssr/commit/27e2c7cfb88ce6fa07f393a231d22a1d60b36fd2))
* update vue2/react logic in plugin ([e2d576b](https://github.com/zhangyuang/ssr/commit/e2d576b92bf8a0e9615480c2d7cccb42ad59635d))
* 完善 ssg 文档 ([384b85a](https://github.com/zhangyuang/ssr/commit/384b85a820043dc9154677ace66e16568d322aca))



## [6.2.26](https://github.com/zhangyuang/ssr/compare/types@6.2.25...types@6.2.26) (2022-09-14)


### Bug Fixes

* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* don't inject dynamic js chunk in html for sourcemap ([7771694](https://github.com/zhangyuang/ssr/commit/7771694d1e34ab2fccf5e411a5b7611047b38a23))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* hidden nest build warning ([28e809d](https://github.com/zhangyuang/ssr/commit/28e809da607a77e6e0d97075c179d3b0a53a988d))
* nest start tips ([ac7f0a1](https://github.com/zhangyuang/ssr/commit/ac7f0a1a50b5765fcd00d00195b5a413070ac0b3))
* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* spinner.stop when stdout end ([9636fc6](https://github.com/zhangyuang/ssr/commit/9636fc650cf8f9050381480f06c58103f1806d05))
* types ([a77ab3b](https://github.com/zhangyuang/ssr/commit/a77ab3bc313ee202394e008bed599dad850cf072))
* types ([f210669](https://github.com/zhangyuang/ssr/commit/f210669cb1192136acb898feaca72402fdcb72de))
* update correct cwd in postinstall ([fff08ef](https://github.com/zhangyuang/ssr/commit/fff08efe37436f96e599f2265b1931c0a1d6df72))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))
* update postinstall ([1078a50](https://github.com/zhangyuang/ssr/commit/1078a50254f27de58525ffec4f7c92a60e4dc03c))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))


### Features

* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* close css less sourcemap ([7936f71](https://github.com/zhangyuang/ssr/commit/7936f71a5db4faeb6b84a5a15967d19c5d8c606b))
* close default hmr host ([f415d73](https://github.com/zhangyuang/ssr/commit/f415d7363a0a40f36074402eb8db7747538e05a1))
* move nestjs-pinia example in ([d214b2c](https://github.com/zhangyuang/ssr/commit/d214b2ccded3d3dc43092b43c9c69ee2122c9bd5))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* use esbuild transform manualroutes ([cf77fcd](https://github.com/zhangyuang/ssr/commit/cf77fcd489a02deb49d7c85def240f4f19367ad9))
* use eval-source-map replace cheap-sourcemap in dev ([1bd615e](https://github.com/zhangyuang/ssr/commit/1bd615e52b24334f727c3c0c13113125670c776f))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))



## [6.2.25](https://github.com/zhangyuang/ssr/compare/types@6.2.25...types@6.2.25) (2022-08-19)


### Bug Fixes

* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* types ([a77ab3b](https://github.com/zhangyuang/ssr/commit/a77ab3bc313ee202394e008bed599dad850cf072))
* types ([f210669](https://github.com/zhangyuang/ssr/commit/f210669cb1192136acb898feaca72402fdcb72de))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))


### Features

* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))



