## [6.2.17](https://github.com/zhangyuang/ssr/compare/core-react@6.2.16...core-react@6.2.17) (2023-02-19)


### Bug Fixes

* add NODE_OPTIONS tips when nodejs version > 16 ([3492698](https://github.com/zhangyuang/ssr/commit/34926987bb3f6f7562b87b14289f509cecf2a6fa))
* confirm all children dependence belong to which chunkName in vite ([1ac15e4](https://github.com/zhangyuang/ssr/commit/1ac15e4f2a664426cc8e4c6ff9afa3620e1411ca))
* defaultExternals add react-dom close [#253](https://github.com/zhangyuang/ssr/issues/253) ([f748cee](https://github.com/zhangyuang/ssr/commit/f748ceeac2cf3205549b2a818e9cc4e386a5c250))
* external ([005b74a](https://github.com/zhangyuang/ssr/commit/005b74a35bbecfc44a1235b8d256aaf934b595bc))
* judge node version ([b6f17b3](https://github.com/zhangyuang/ssr/commit/b6f17b3a04afdcdea936554b60e6db96e2053532))
* spa build ([d399bea](https://github.com/zhangyuang/ssr/commit/d399beac0dc3a336194651b3fc05f011a7515ff1))
* types ([7015666](https://github.com/zhangyuang/ssr/commit/70156663c28c87628596a4466cf8c647d18335dd))
* update vite-vue plugin version ([#261](https://github.com/zhangyuang/ssr/issues/261)) ([31d3844](https://github.com/zhangyuang/ssr/commit/31d38447e49bc8055d59e4452d02fc9825afab64))
* use unshift replace pop in queue ([25e9513](https://github.com/zhangyuang/ssr/commit/25e9513ebc744c70e3d3061a6ef92f66436a116a))
* vite build dependenciesMap logic ([28bee51](https://github.com/zhangyuang/ssr/commit/28bee5102f0f44e0ab1a7d9e16272c27c1fbbe08))


### Features

* add @types/koa ([0dffea6](https://github.com/zhangyuang/ssr/commit/0dffea66264dafde6ff16fd211a14137fd8b6e5d))
* add path-to-regexp to vite build vendorlist ([8934da5](https://github.com/zhangyuang/ssr/commit/8934da5dca7c709d4cbc0635bb194057b59dc2c0))
* add ssr start --help tips in midway ([f76f0a1](https://github.com/zhangyuang/ssr/commit/f76f0a1a9dc49cb175a800655699a10065571ae2))
* add vite dev css flicker tips ([1744a72](https://github.com/zhangyuang/ssr/commit/1744a72fbc056532336daef4ee0a439fefe529ff))
* build spa support priority ([d456969](https://github.com/zhangyuang/ssr/commit/d4569697d00a720c2e820206ebb5df1002c4af8d))
* for ctx.body will loose asynclocalstorage context, consume stream in advance like vue2/3 ([1f0c2ba](https://github.com/zhangyuang/ssr/commit/1f0c2bacd28a7a35af686c98f691a4a0c1ca9693))
* ignore node_modules dependencies in vite build ([72a7062](https://github.com/zhangyuang/ssr/commit/72a706283807609576e2de22fb4dcdaa9cc89e54))
* spa support extrajsorder cssorder ([ebc82c5](https://github.com/zhangyuang/ssr/commit/ebc82c52d35502533130fc4d6e551aed0f9d1137))
* spa with customeFooterScript is array ([b9508ae](https://github.com/zhangyuang/ssr/commit/b9508aea7e98bbbdaecaa318667d10d04c10aa82))
* support antd5 close [#250](https://github.com/zhangyuang/ssr/issues/250) ([c999536](https://github.com/zhangyuang/ssr/commit/c9995365fbd82faa30a006b51e5cd76ab307bab5))
* support element-plus ([e13fed8](https://github.com/zhangyuang/ssr/commit/e13fed826ad634a31f3506afc0a7958340c9dc87))
* support jsOrderPriority🤔 cssOrderPriority🤔 ([9db9a7d](https://github.com/zhangyuang/ssr/commit/9db9a7d03e8c47a93ca459b8b8b3fad571f73960))
* support react18 ([#264](https://github.com/zhangyuang/ssr/issues/264)) ([c992161](https://github.com/zhangyuang/ssr/commit/c992161c8ea0d2f1a9814dd4b30ffa82b1bbbe84))
* use asynclocalstorage for get correct pinia store app context instance ([a38d3e9](https://github.com/zhangyuang/ssr/commit/a38d3e99c2a6aa6a64a20099a59fb06edba1b5ea))



## [6.2.16](https://github.com/zhangyuang/ssr/compare/core-react@6.2.15...core-react@6.2.16) (2022-11-09)


### Bug Fixes

* call judgeServerFramework in node environment prevent utils be ([47cd81a](https://github.com/zhangyuang/ssr/commit/47cd81a18a85be507c7d43c323c294f2d5b8775d))
* gernerate html ([08e5678](https://github.com/zhangyuang/ssr/commit/08e567877e7b6d0b4b3a6fab6ad4ea2546b0c041))
* pinia alias ([2256194](https://github.com/zhangyuang/ssr/commit/22561948b9d27ea6296b5f60cefb3f42d6c1d4c1))


### Features

* update vue alias ([36e15ac](https://github.com/zhangyuang/ssr/commit/36e15ac5d2d1398ced6abef2727970947177e6bc))



## [6.2.15](https://github.com/zhangyuang/ssr/compare/core-react@6.2.14...core-react@6.2.15) (2022-11-01)


### Bug Fixes

* onlyCsr types core-vue3 render logic ([f75929e](https://github.com/zhangyuang/ssr/commit/f75929ef84e564fe7e3d9c5c6d1e56fe70f5629b))
* react hmr ([2c57a6e](https://github.com/zhangyuang/ssr/commit/2c57a6e14d485500a2e8868035d9cb6e1fa883b0))
* types ([2ad371f](https://github.com/zhangyuang/ssr/commit/2ad371fc6c0b27e6e52801048a28a3d8fdcfccf7))


### Features

* add env flag when ssg ([32fef6f](https://github.com/zhangyuang/ssr/commit/32fef6f8d43bf2cecb867f6d0e2d9f8e6d113224))
* customScript support tagName ([91a836f](https://github.com/zhangyuang/ssr/commit/91a836f0b423b46f730a2c893b56f89bddd470c5))
* remove css-hot-loader inject ssrDevInfo in vue3 ([e4a28f6](https://github.com/zhangyuang/ssr/commit/e4a28f66ae019bbd5a11df649b8ffe92f6b2b2da))
* support fastify close [#245](https://github.com/zhangyuang/ssr/issues/245) ([#246](https://github.com/zhangyuang/ssr/issues/246)) ([d9c24c5](https://github.com/zhangyuang/ssr/commit/d9c24c595941447c5e8072c63c1a80cba06689c3))
* support more babelOptions like include exclude ([4a2b254](https://github.com/zhangyuang/ssr/commit/4a2b254f4f6a9996bf3c3f9fea561636d61b85ac))
* update react alias ([160b991](https://github.com/zhangyuang/ssr/commit/160b9911166172f36db9690be87f35fcbfc747aa))
* update sprops types ([9383235](https://github.com/zhangyuang/ssr/commit/9383235321f171b4d5c877d08025e9b9936175d3))
* update vite build logic ([0bf7a28](https://github.com/zhangyuang/ssr/commit/0bf7a28ca38f2cde8501dfb53546f4d3b0c6f51f))
* use jsx-runtime in react ([ffdd346](https://github.com/zhangyuang/ssr/commit/ffdd34674ff0753e130b6570ab9eef3b1aec5217))
* use ssr-mini-css-extra-plugin for micro ([fa1c025](https://github.com/zhangyuang/ssr/commit/fa1c025b19b38733c20b11a40860b7eb648387e6))



## [6.2.14](https://github.com/zhangyuang/ssr/compare/core-react@6.2.13...core-react@6.2.14) (2022-09-25)


### Bug Fixes

* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* don't inject dynamic js chunk in html for sourcemap ([7771694](https://github.com/zhangyuang/ssr/commit/7771694d1e34ab2fccf5e411a5b7611047b38a23))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* hidden nest build warning ([28e809d](https://github.com/zhangyuang/ssr/commit/28e809da607a77e6e0d97075c179d3b0a53a988d))
* nest start tips ([ac7f0a1](https://github.com/zhangyuang/ssr/commit/ac7f0a1a50b5765fcd00d00195b5a413070ac0b3))
* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* spinner.stop when stdout end ([9636fc6](https://github.com/zhangyuang/ssr/commit/9636fc650cf8f9050381480f06c58103f1806d05))
* update correct cwd in postinstall ([fff08ef](https://github.com/zhangyuang/ssr/commit/fff08efe37436f96e599f2265b1931c0a1d6df72))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))
* update postinstall ([1078a50](https://github.com/zhangyuang/ssr/commit/1078a50254f27de58525ffec4f7c92a60e4dc03c))


### Features

* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* close css less sourcemap ([7936f71](https://github.com/zhangyuang/ssr/commit/7936f71a5db4faeb6b84a5a15967d19c5d8c606b))
* close default hmr host ([f415d73](https://github.com/zhangyuang/ssr/commit/f415d7363a0a40f36074402eb8db7747538e05a1))
* move nestjs-pinia example in ([d214b2c](https://github.com/zhangyuang/ssr/commit/d214b2ccded3d3dc43092b43c9c69ee2122c9bd5))
* move render app logic in server-render not in core ([8638ab2](https://github.com/zhangyuang/ssr/commit/8638ab2970bbd9e47598d93e7038f8f599ea82f5))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* support ssg ([27e2c7c](https://github.com/zhangyuang/ssr/commit/27e2c7cfb88ce6fa07f393a231d22a1d60b36fd2))
* update vue2/react logic in plugin ([e2d576b](https://github.com/zhangyuang/ssr/commit/e2d576b92bf8a0e9615480c2d7cccb42ad59635d))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* use esbuild transform manualroutes ([cf77fcd](https://github.com/zhangyuang/ssr/commit/cf77fcd489a02deb49d7c85def240f4f19367ad9))
* use eval-source-map replace cheap-sourcemap in dev ([1bd615e](https://github.com/zhangyuang/ssr/commit/1bd615e52b24334f727c3c0c13113125670c776f))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))
* 完善 ssg 文档 ([384b85a](https://github.com/zhangyuang/ssr/commit/384b85a820043dc9154677ace66e16568d322aca))



## [6.2.13](https://github.com/zhangyuang/ssr/compare/core-react@6.2.13...core-react@6.2.13) (2022-08-19)


### Bug Fixes

* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add clientBuildEnd event ([f081d4b](https://github.com/zhangyuang/ssr/commit/f081d4b5cf7b826967fc3013ff625adb871bdcb1))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* css chunkname ([4576d7b](https://github.com/zhangyuang/ssr/commit/4576d7b8ffce5b2e32624cae8c19d81235ad1636))
* default splitChunks options ([20fb45f](https://github.com/zhangyuang/ssr/commit/20fb45f5567b4cc8788fa93d9e1772bf6695e723))
* dynamic render ([7a9157c](https://github.com/zhangyuang/ssr/commit/7a9157cab3a1de354629345961d895b5c29d86c3))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* esbuild bundle only in dev ([10aef35](https://github.com/zhangyuang/ssr/commit/10aef35232ca158e3b1c0637fc04a50c44673026))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* generate html add all chunk css ([7a1be47](https://github.com/zhangyuang/ssr/commit/7a1be479b908a488e695385097cc41d609955bd0))
* inject clientPrefix in csr ([33b15ac](https://github.com/zhangyuang/ssr/commit/33b15acb36f25fce183b01457e32f9e622462d8e))
* judge isVite in core ([7c175a2](https://github.com/zhangyuang/ssr/commit/7c175a2513673e53840beb9904cfe39dbb149ba8))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* react router basename in server entry ([#212](https://github.com/zhangyuang/ssr/issues/212)) ([28072f7](https://github.com/zhangyuang/ssr/commit/28072f7bdfc489a27599b636db33bdea18ef4c18))
* react static router basename close [#228](https://github.com/zhangyuang/ssr/issues/228) ([542dc60](https://github.com/zhangyuang/ssr/commit/542dc603be7d4b2ce88dc6bb2d9203aa5094bfb8))
* read manifest in dev mode ([9c577a4](https://github.com/zhangyuang/ssr/commit/9c577a4a66c79e301988ff40ffb9b06e626a0ad6))
* Recommended to specify used minor core-js version ([#207](https://github.com/zhangyuang/ssr/issues/207)) ([9db0424](https://github.com/zhangyuang/ssr/commit/9db0424e5e7ad1728d40665d01740f7a2c1c4b70))
* release utils ([1b9c56b](https://github.com/zhangyuang/ssr/commit/1b9c56bc904faa0cae39fb329c02b5d159d69872))
* remove writeEmitter ([77a5ac8](https://github.com/zhangyuang/ssr/commit/77a5ac8e9338424fbca77a5560c4c91ed405ac09))
* restore webpack split chunks config ([2f7ae67](https://github.com/zhangyuang/ssr/commit/2f7ae67ecef863d56752a4a4e1fa7a75ec0756ed))
* revert vite build ([210ddea](https://github.com/zhangyuang/ssr/commit/210ddea22fc0639f60fcee96bdf47463d188e18f))
* set defaulr hmr protocol to ws ([0d14c1c](https://github.com/zhangyuang/ssr/commit/0d14c1cae2b10dfea262c76794fd0a4ebca3f8ae))
* setGenerateMap ([c2ce03f](https://github.com/zhangyuang/ssr/commit/c2ce03f172b937d2a3c86e109bed524c3ce07910))
* setGenerateMap ([040cec5](https://github.com/zhangyuang/ssr/commit/040cec58a29064698b2b4ef909be3d3de42e3b80))
* ssr start --optimize ([42bb399](https://github.com/zhangyuang/ssr/commit/42bb39931001af5ad19e1f42b7912ffa08c47e71))
* types ([a77ab3b](https://github.com/zhangyuang/ssr/commit/a77ab3bc313ee202394e008bed599dad850cf072))
* types ([f210669](https://github.com/zhangyuang/ssr/commit/f210669cb1192136acb898feaca72402fdcb72de))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))
* update parse logic to non-render file ([6140204](https://github.com/zhangyuang/ssr/commit/61402041ba76dfd61b9d74f0d79490603271cbcc))
* userConfig ([b385333](https://github.com/zhangyuang/ssr/commit/b3853337623dee41907cc7465b0eb27dd9395c90))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))


### Features

* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add checkBuildEnd ([fa37147](https://github.com/zhangyuang/ssr/commit/fa371479d6f6d609d4ae6b9bf160ea4966255e09))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add optimize logic in server plugin ([5f5d5c3](https://github.com/zhangyuang/ssr/commit/5f5d5c3f482b580efcb3fe06b984051a0bec1975))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add useApp ([48aefed](https://github.com/zhangyuang/ssr/commit/48aefedde20b547921905b7b961ede86c1873a4b))
* add usePinia ([3253e83](https://github.com/zhangyuang/ssr/commit/3253e83b8b3c1d86bcf83e0dce74e03f5704706d))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add useStoreContext ([ee3cd7a](https://github.com/zhangyuang/ssr/commit/ee3cd7a9f6e0807b237f106e876a3e1081579b73))
* add vendorMap in vite build ([a084620](https://github.com/zhangyuang/ssr/commit/a0846207fc3c5092927f5fb57480c9a669f767e2))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* build html ([9a1ca75](https://github.com/zhangyuang/ssr/commit/9a1ca754f147c080ca93211defde5f7cf8f7c259))
* change splitChunks from all to initial ([f0de225](https://github.com/zhangyuang/ssr/commit/f0de22566ff7769b02d3b7d7b75bde12a5b2c28a))
* combine server-utils and client-utils to common-utils ([#234](https://github.com/zhangyuang/ssr/issues/234)) ([4824a22](https://github.com/zhangyuang/ssr/commit/4824a220a1fe83fd88971d9e616a6fd011078618))
* concat arr when vendorMap has same length ([0a5a814](https://github.com/zhangyuang/ssr/commit/0a5a814a72aebe2d179a72bf1eb7966a977e167d))
* don't cover viteConfig.build ([02aef3b](https://github.com/zhangyuang/ssr/commit/02aef3b44c1cde54d8586f0d73defdcdc7ce0ad3))
* don't emit void chunk ([dc5d8b7](https://github.com/zhangyuang/ssr/commit/dc5d8b742a9f97f2be38d9da633b9d1768b6710b))
* don't write file to dist in webpack optimize ([c1cbce9](https://github.com/zhangyuang/ssr/commit/c1cbce927716dfa4fca052b1d54448e87771b1f6))
* generate html file support inject prefix ([02741ee](https://github.com/zhangyuang/ssr/commit/02741eeda778eec26504c5e7e2c074b1d2402e83))
* judge proxy framework ([a6b28fd](https://github.com/zhangyuang/ssr/commit/a6b28fd43badf454026c046df7aaf2a1c7620c07))
* make splitPriorityMap consistent ([b7c8afb](https://github.com/zhangyuang/ssr/commit/b7c8afb7940b7f6f863531277b224f234292d62b))
* move all client files at same folder in webpack ([d6d623f](https://github.com/zhangyuang/ssr/commit/d6d623f29ba4aa10d85c0561c8f6f88ec3bb2290))
* move react-router to external ([0a58570](https://github.com/zhangyuang/ssr/commit/0a585705fb66d9f3a4a59008f1f3e82b23f05fae))
* move ssr-types dependencies to devdependencies ([417e4ad](https://github.com/zhangyuang/ssr/commit/417e4ad00b6a25c9314f702e5a2678306f97825e))
* new vite build logic ([4420935](https://github.com/zhangyuang/ssr/commit/4420935ee6ced6dd77a120998bdb6377d3df1780))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* remove clientBuildEnd events ([44cc355](https://github.com/zhangyuang/ssr/commit/44cc355f0dc060ae58581488a1fc1573ebad1ba5))
* remove getlocalmodules update getuserconfig ([172adde](https://github.com/zhangyuang/ssr/commit/172adde96395fc3b3dd489fa8e529e21a0c226f4))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* support dynamicFile ([c11781c](https://github.com/zhangyuang/ssr/commit/c11781c846651bd8027c8d5b9821163181f8629b))
* support link preload ([9a6abf3](https://github.com/zhangyuang/ssr/commit/9a6abf3fcdae8f02928731018e8aa7370f804d82))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update combineRoutes ([7102531](https://github.com/zhangyuang/ssr/commit/7102531660e3a2aa3f607e8b138894a3bdbca371))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



