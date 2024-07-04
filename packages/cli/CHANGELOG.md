## [6.2.73](https://github.com/zhangyuang/ssr/compare/cli@6.2.72...cli@6.2.73) (2024-07-04)


### Bug Fixes

* set bc env ([bf2dbb5](https://github.com/zhangyuang/ssr/commit/bf2dbb50a4b72f56a85c80679eb06e024cb117d2))



## [6.2.72](https://github.com/zhangyuang/ssr/compare/cli@6.2.71...cli@6.2.72) (2024-07-03)


### Features

* add nameSpaceBuiltinModules judge in external ([47e92be](https://github.com/zhangyuang/ssr/commit/47e92bede76904ed69b2febdd047bd26c06be6a6))
* add vue-demi in default Page ([2f1bb86](https://github.com/zhangyuang/ssr/commit/2f1bb86ed54b2265521068ffb5a39f6bd92e26da))
* babel-plugin-import unsupport vant@v4 ([#325](https://github.com/zhangyuang/ssr/issues/325)) ([68532aa](https://github.com/zhangyuang/ssr/commit/68532aa59a8f0a968c8a92601a069581965cbff9))
* compatible with bun ([0eeaba7](https://github.com/zhangyuang/ssr/commit/0eeaba777a306443d954dabfc6643ce7bdadc208))
* support build --nominify in vite ([1dac6eb](https://github.com/zhangyuang/ssr/commit/1dac6eb015b86c1fe4d23242885e939eac051199))
* support build @vue/server-renderer in server bundle ([df675a9](https://github.com/zhangyuang/ssr/commit/df675a94f642881026899b9ef5c48872f73d07ce))
* support config.asyncGlobalData ([b571399](https://github.com/zhangyuang/ssr/commit/b571399887d95d3f1e9de1cb6cf8718c8b6a71f8))
* support set streamHighWaterMark in react ([62421e2](https://github.com/zhangyuang/ssr/commit/62421e23af7d5d9528f3085b6890e850b7d9ff7a))
* support ssr build --bundleConfigPlatform ([44f54cd](https://github.com/zhangyuang/ssr/commit/44f54cdc54aadb0a8b1072d280d0efaa61679a32))



## [6.2.71](https://github.com/zhangyuang/ssr/compare/cli@6.2.70...cli@6.2.71) (2024-03-27)


### Features

* use source-map in dev mode ([8041c8d](https://github.com/zhangyuang/ssr/commit/8041c8da0dd0e01b5bc66fa8fa31ccd9fe03b7a5))



## [6.2.70](https://github.com/zhangyuang/ssr/compare/cli@6.2.69...cli@6.2.70) (2024-03-27)


### Bug Fixes

* contex single instance ([3ca64cd](https://github.com/zhangyuang/ssr/commit/3ca64cdcd6aa0e556b5131147737b39bcd50902f))
* object.assign take effect in initial state ([bf8268f](https://github.com/zhangyuang/ssr/commit/bf8268fc0181e22ace47c13a6cd6239ca89c73c5))


### Features

* use inline-source-map in dev mode ([e639c67](https://github.com/zhangyuang/ssr/commit/e639c679adaf7eb8aecd4a712abd7df2148202cf))



## [6.2.69](https://github.com/zhangyuang/ssr/compare/cli@6.2.68...cli@6.2.69) (2024-03-25)


### Bug Fixes

* optimize react scene use context code ([1d3e885](https://github.com/zhangyuang/ssr/commit/1d3e885d4fd5a8fade6f48438592ae2df16374e1))
* valtio single instance error ([0474b30](https://github.com/zhangyuang/ssr/commit/0474b302110adc755285fdcefe9d58757e1b200f))



## [6.2.68](https://github.com/zhangyuang/ssr/compare/cli@6.2.67...cli@6.2.68) (2024-03-19)


### Bug Fixes

* add @vue/server-renderer in package.json ([ff2f6de](https://github.com/zhangyuang/ssr/commit/ff2f6de84667198a7a99301d1fce7cab40b59abc))
* add babel-optional-chaining in plugin-vue, use checkModuleExist replace loadModule ([3f6d451](https://github.com/zhangyuang/ssr/commit/3f6d4511eb7b89fd6cdf5962d03dd3a2b23dd35f))
* delete entry name chunk in cacheGroup when build optimize ([c813208](https://github.com/zhangyuang/ssr/commit/c8132083468e0f7c661e1b0aa301c733556b8466))
* loadConfig ([a0c2e4a](https://github.com/zhangyuang/ssr/commit/a0c2e4a22b343d77626044eea292f7de2d2e46b7))
* loadModule in vue2 ([1e8055b](https://github.com/zhangyuang/ssr/commit/1e8055b4218a57c1f07c01f9698d119b47f59824))
* plugin-react close [#321](https://github.com/zhangyuang/ssr/issues/321) ([1f0709f](https://github.com/zhangyuang/ssr/commit/1f0709fd7bc5a9633555f33bfe5dc21a7d925028))


### Features

* add debug when build optimize ([402b3c1](https://github.com/zhangyuang/ssr/commit/402b3c18a33f14ea447fbc96d61648d21213d6fd))
* add error log when build optimize ([8d21bfb](https://github.com/zhangyuang/ssr/commit/8d21bfb45d522589ca0bb6187ebb1d0205cacd67))
* set NPM_CLIENT when midway deploy ([715799f](https://github.com/zhangyuang/ssr/commit/715799f2c87b1671b0d27a9470c5871cee33072b))
* support more sourcemap type ([80571b3](https://github.com/zhangyuang/ssr/commit/80571b3bdd210e7847f9ba7db5e5a52c1453c821))
* support optimizeDeps in vite, add react-is as deps when use antd5 ([66fa36e](https://github.com/zhangyuang/ssr/commit/66fa36eb94c7b287db68242f8e61f0928dde6356))
* use process.exit(1) replace throw error ([efe5e40](https://github.com/zhangyuang/ssr/commit/efe5e40673c81fa7904fcba7e02cca13506b6627))



## [6.2.67](https://github.com/zhangyuang/ssr/compare/cli@6.2.66...cli@6.2.67) (2024-01-19)


### Bug Fixes

* specify platform as node ([0b6f358](https://github.com/zhangyuang/ssr/commit/0b6f35895c147c01a6dd254d76445b2fd5dabdb2))


### Features

* add optional-chaining in default ([e479496](https://github.com/zhangyuang/ssr/commit/e479496d0571c3fa34277fbb6bc7e10ae980f600))
* support ssr build --html in react/react18 close [#317](https://github.com/zhangyuang/ssr/issues/317) ([7311f8e](https://github.com/zhangyuang/ssr/commit/7311f8ed6034ad925c642c2682e85ab42872d86c))



## [6.2.66](https://github.com/zhangyuang/ssr/compare/cli@6.2.65...cli@6.2.66) (2023-12-26)


### Features

* replace esbuild transform to build ([6f37717](https://github.com/zhangyuang/ssr/commit/6f3771714282e4529b199cffa0c4e3a9ad28dd57))



## [6.2.65](https://github.com/zhangyuang/ssr/compare/cli@6.2.64...cli@6.2.65) (2023-12-21)


### Bug Fixes

* add @midwayjs/logger in dependencies ([55584f1](https://github.com/zhangyuang/ssr/commit/55584f19e5eec4f086e490672f5fe00322724e91))
* checkroute close [#312](https://github.com/zhangyuang/ssr/issues/312) ([97d2db7](https://github.com/zhangyuang/ssr/commit/97d2db7af10a31a7ba486fd04990f4ef97363375))
* pinia example ([ef81d0b](https://github.com/zhangyuang/ssr/commit/ef81d0b4b805f4be49dfd6f69ce016a66a12bc9c))


### Features

* add useCtx ([c6d0fbe](https://github.com/zhangyuang/ssr/commit/c6d0fbecef9ef1cb6dafaed7066b25ce4a0fcead))
* optimize vite build ([d5dbac2](https://github.com/zhangyuang/ssr/commit/d5dbac2ce9d0233a9e7c39975eae025714449205))
* use swc in nestjs ([29913ea](https://github.com/zhangyuang/ssr/commit/29913ea5fb5cccf4f803edcde01ed9401b54e0e8))
* valtio ([#311](https://github.com/zhangyuang/ssr/issues/311)) ([6a4e069](https://github.com/zhangyuang/ssr/commit/6a4e0694d812056f8552a12a8dddc998344f58c7))



## [6.2.64](https://github.com/zhangyuang/ssr/compare/cli@6.2.62...cli@6.2.64) (2023-10-10)


### Features

* support multiply deploy select ([eeeaba4](https://github.com/zhangyuang/ssr/commit/eeeaba41cf24e4fac5f4fe90a6b36e5a61ef06bd))



## [6.2.63](https://github.com/zhangyuang/ssr/compare/cli@6.2.62...cli@6.2.63) (2023-10-10)



## [6.2.62](https://github.com/zhangyuang/ssr/compare/cli@6.2.61...cli@6.2.62) (2023-10-10)


### Bug Fixes

* inlinecss when all mode ([e1be337](https://github.com/zhangyuang/ssr/commit/e1be3378d7d6a857e0690189a7e3ec5e955e624a))
* use asyncChunkMap only in client ([f3d29e3](https://github.com/zhangyuang/ssr/commit/f3d29e354ee3b86e17a57cb59c0f1b5452e3ff10))


### Features

* for node18 use terser minify server bundle ([c47091b](https://github.com/zhangyuang/ssr/commit/c47091b6d27913a527aaccb697db263e4a601aa3))
* optimize getVNode for compatible with vue2.6 ([8ebc114](https://github.com/zhangyuang/ssr/commit/8ebc114b817d78638e18fcbb27bbb09e897b9664))
* support throw error during rendering inside vue3 in production ([343a34f](https://github.com/zhangyuang/ssr/commit/343a34f83bdf224a45bb6ef60e26be0addc26bd3))
* upgrade webpack-dev-server-ssr ([a424789](https://github.com/zhangyuang/ssr/commit/a42478931acfb82bcf9b335f9f157528d20b2f44))



## [6.2.61](https://github.com/zhangyuang/ssr/compare/cli@6.2.60...cli@6.2.61) (2023-09-18)


### Bug Fixes

* support hashRouter ([e7a3129](https://github.com/zhangyuang/ssr/commit/e7a3129a4dffb9c3f80ec8ed55e77622f0b4a846))


### Features

* support node18 replace webpack4 with ssr-webpack4 ([1111ae7](https://github.com/zhangyuang/ssr/commit/1111ae7d5c759efeb4dd8bf9fcd599c2d270d930))
* update types comment and lessOptions ([eba6efb](https://github.com/zhangyuang/ssr/commit/eba6efb13e7c9652722d9bcae7b355e08f16981c))



## [6.2.60](https://github.com/zhangyuang/ssr/compare/cli@6.2.59...cli@6.2.60) (2023-09-01)


### Bug Fixes

* build html ([4cc7465](https://github.com/zhangyuang/ssr/commit/4cc74656f06509887957faf2951ef8a5ebc8fb43))
* combine config ([3933ce3](https://github.com/zhangyuang/ssr/commit/3933ce3458dd3bc1bf39f497d075513307fcfd68))
* cssInline in vue2 ([10df2a8](https://github.com/zhangyuang/ssr/commit/10df2a8a2bd72c3b73680ec3f6c8bda4adef4d37))
* don't use swc as nest compiler for bug ([f445e57](https://github.com/zhangyuang/ssr/commit/f445e575879729bed41cfdfc071c6fb0f8747b0a))
* merge config ([2bca435](https://github.com/zhangyuang/ssr/commit/2bca435f864ed658c5376438a237147871e30b0a))
* merge config ([686eedf](https://github.com/zhangyuang/ssr/commit/686eedf8326673649fe0af3af8212589c9329c2c))
* split path for fastify ([90e7fb6](https://github.com/zhangyuang/ssr/commit/90e7fb69abd809638aafdb862444aed34aa4a0ab))
* use cssInline is dev or prod ([5571c66](https://github.com/zhangyuang/ssr/commit/5571c66f4a9b43517115abb7f99cd141e18e3252))


### Features

* optimize cssinline ([710e6e5](https://github.com/zhangyuang/ssr/commit/710e6e56eb154bc9fff0258bb2f677ae8a923d35))



## [6.2.59](https://github.com/zhangyuang/ssr/compare/cli@6.2.58...cli@6.2.59) (2023-08-18)


### Bug Fixes

* combine config ([f80f705](https://github.com/zhangyuang/ssr/commit/f80f70549dfa2719033c2be89e71aa435112bbcb))


### Features

* support ssr build --nominify ([fd0b274](https://github.com/zhangyuang/ssr/commit/fd0b274e9e173e6a2e05782ccb2c80b62e165c8f))



## [6.2.58](https://github.com/zhangyuang/ssr/compare/cli@6.2.57...cli@6.2.58) (2023-08-17)


### Features

* support ssr build --sourcemap ([a6ba95e](https://github.com/zhangyuang/ssr/commit/a6ba95e1f4711c9d7b797687df1d48dcfdf6abe7))



## [6.2.57](https://github.com/zhangyuang/ssr/compare/cli@6.2.54...cli@6.2.57) (2023-08-10)


### Bug Fixes

* bundle common-utils in webpack ([58626c7](https://github.com/zhangyuang/ssr/commit/58626c7f17dfcb34a4b25337e7a90918ae06859c))
* clean dir ([2081774](https://github.com/zhangyuang/ssr/commit/2081774b6c4b348aa5ba34e258d3774c84c6ed6e))
* type ([15f2224](https://github.com/zhangyuang/ssr/commit/15f2224bc6e632fdea6d2b23b694f643f0ef9e5f))


### Features

* add webpack error plugin emit error close [#304](https://github.com/zhangyuang/ssr/issues/304) ([00ad5ea](https://github.com/zhangyuang/ssr/commit/00ad5eabb0384841f45c6dd78c791c8521025694))
* optimize getStaticConfig ([6418eda](https://github.com/zhangyuang/ssr/commit/6418eda03ca6a2798e6128d78017dc97767a968f))
* support config.framework ([cd1abf0](https://github.com/zhangyuang/ssr/commit/cd1abf043cefac658ca265b62028ccf89109cbe3))
* support set ssrConfig in env ([1c8b6e3](https://github.com/zhangyuang/ssr/commit/1c8b6e36272b9ac9fac5d18ffe8a7b5ca6fe7235))
* support vite processPlugin ([1436a85](https://github.com/zhangyuang/ssr/commit/1436a855eb07b753e4baaa4de0c5ecfb2f28e5a9))
* upgrade nestjs version to 10 use swc as default compiler ([a85503a](https://github.com/zhangyuang/ssr/commit/a85503a680990c80b3dddedc9971ddaf92ee7f46))



## [6.2.56](https://github.com/zhangyuang/ssr/compare/cli@6.2.54...cli@6.2.56) (2023-07-31)


### Bug Fixes

* clean dir ([2081774](https://github.com/zhangyuang/ssr/commit/2081774b6c4b348aa5ba34e258d3774c84c6ed6e))


### Features

* upgrade nestjs version to 10 use swc as default compiler ([a85503a](https://github.com/zhangyuang/ssr/commit/a85503a680990c80b3dddedc9971ddaf92ee7f46))



## [6.2.55](https://github.com/zhangyuang/ssr/compare/cli@6.2.54...cli@6.2.55) (2023-07-29)


### Features

* upgrade nestjs version to 10 use swc as default compiler ([a85503a](https://github.com/zhangyuang/ssr/commit/a85503a680990c80b3dddedc9971ddaf92ee7f46))



## [6.2.54](https://github.com/zhangyuang/ssr/compare/cli@6.2.53...cli@6.2.54) (2023-07-27)


### Bug Fixes

* dynamic require staticConfigPath ([9d426e3](https://github.com/zhangyuang/ssr/commit/9d426e3121603bdb9e133c7d2397b430a82f788d))



## [6.2.53](https://github.com/zhangyuang/ssr/compare/cli@6.2.52...cli@6.2.53) (2023-07-27)



## [6.2.52](https://github.com/zhangyuang/ssr/compare/cli@6.2.51...cli@6.2.52) (2023-07-26)


### Bug Fixes

* esbuildTransform staticConfig after ssr build finish ([95a3faa](https://github.com/zhangyuang/ssr/commit/95a3faa4bec57d4d713ca32da4063bf19a0c8cf0))



## [6.2.51](https://github.com/zhangyuang/ssr/compare/cli@6.2.50...cli@6.2.51) (2023-07-26)


### Bug Fixes

* esbuildTransform staticConfig after ssr build finish ([c281b9c](https://github.com/zhangyuang/ssr/commit/c281b9cd2419445c26279a0dace63e0a97318d99))
* transformConfig ([f44899e](https://github.com/zhangyuang/ssr/commit/f44899e76236aae8ba5dbcbe174238d31a539685))



## [6.2.50](https://github.com/zhangyuang/ssr/compare/cli@6.2.49...cli@6.2.50) (2023-07-25)


### Features

* use h function render html in vue2 ([031f59e](https://github.com/zhangyuang/ssr/commit/031f59e0c11973bc2aa569f2b656cd61f5bb8e39))



## [6.2.49](https://github.com/zhangyuang/ssr/compare/cli@6.2.48...cli@6.2.49) (2023-07-25)


### Bug Fixes

* filter babel plugins null string ([837d7b6](https://github.com/zhangyuang/ssr/commit/837d7b6eb7bbcd290cc234591975bc2f82695ed8))
* react plugin add plugin-proposal close [#297](https://github.com/zhangyuang/ssr/issues/297) ([fdd8253](https://github.com/zhangyuang/ssr/commit/fdd82537f33f8284881ba80cacfa12ce756a109b))
* ssr build --optimize clear null string add layout~app ([84f5671](https://github.com/zhangyuang/ssr/commit/84f5671f2c87c251cc9e33ce1b8c7423d33e7845))


### Features

* add addCommonChain for babel in vue3/react ([568a3ed](https://github.com/zhangyuang/ssr/commit/568a3edde7b432d8e78881eb77491bf484c82e20))
* add pinia in midway-vue3 dependencies ([9b8ca90](https://github.com/zhangyuang/ssr/commit/9b8ca907e51f5e3f5f29b0ebd7025587a622012f))
* extra terserconfig to common ([11105bb](https://github.com/zhangyuang/ssr/commit/11105bbe3f71be00da794a1c11e73b138e64d090))
* support combine dynamic customeHeadScript when call render ([76dbe1f](https://github.com/zhangyuang/ssr/commit/76dbe1ffa4c603d32487abd0507bc1a3808facfc))
* support staticConfigPath ([80a9411](https://github.com/zhangyuang/ssr/commit/80a94117d87d025a3788fbadb6c810ce036de883))



## [6.2.48](https://github.com/zhangyuang/ssr/compare/cli@6.2.47...cli@6.2.48) (2023-05-26)


### Bug Fixes

* build --html add rootId ([#291](https://github.com/zhangyuang/ssr/issues/291)) ([53e6a36](https://github.com/zhangyuang/ssr/commit/53e6a3690ddf47659b9c0a85f8a98519a37a19d5))
* remove manifest info in production ([4d341e1](https://github.com/zhangyuang/ssr/commit/4d341e1ae89b47aee943e5f2e21f1cda59a410d1))


### Features

* remove null string in chunkName ([f56d62e](https://github.com/zhangyuang/ssr/commit/f56d62e4cb57aa9a7628587755bec6d58f98d51d))
* use splitPageInfo generate page state ([8f51258](https://github.com/zhangyuang/ssr/commit/8f51258af97f99168e16b65b1f886a2bb50bd183))
* use splitPageInfo generate page state in build html file ([0bb5107](https://github.com/zhangyuang/ssr/commit/0bb510704fd95372bdeae6fab4970f70b1bf28a0))



## [6.2.47](https://github.com/zhangyuang/ssr/compare/cli@6.2.46...cli@6.2.47) (2023-05-11)


### Bug Fixes

* confirm all children dependence belong to which chunkName in vite ([1ac15e4](https://github.com/zhangyuang/ssr/commit/1ac15e4f2a664426cc8e4c6ff9afa3620e1411ca))
* define in windows vite ([7ed50d0](https://github.com/zhangyuang/ssr/commit/7ed50d02679d91967459092fc92db64f2db9b446))
* development filenamepath ([838d492](https://github.com/zhangyuang/ssr/commit/838d4927afb128dbb2a6057a4b5cc1e16ce031a5))
* fastify req.path ([b563118](https://github.com/zhangyuang/ssr/commit/b5631184d0054ef12c748f538255d00132e99482))
* react18 default exclude ([1747419](https://github.com/zhangyuang/ssr/commit/1747419b978d81e7abe5c6975884ca8a87c749de))
* setheader close [#285](https://github.com/zhangyuang/ssr/issues/285) ([af32288](https://github.com/zhangyuang/ssr/commit/af32288ca5f7a99870702cec47d9add025dba93d))
* use unshift replace pop in queue ([25e9513](https://github.com/zhangyuang/ssr/commit/25e9513ebc744c70e3d3061a6ef92f66436a116a))
* validate process.env ([ec46249](https://github.com/zhangyuang/ssr/commit/ec46249d65133587ec870732613f24fc94e6e683))
* vite build ([6ad5079](https://github.com/zhangyuang/ssr/commit/6ad507976f38c5972e9785a0e528314c46a04431))
* vite build dependenciesMap logic ([28bee51](https://github.com/zhangyuang/ssr/commit/28bee5102f0f44e0ab1a7d9e16272c27c1fbbe08))
* vite build with babel ([b924353](https://github.com/zhangyuang/ssr/commit/b9243532cebbbf91fc61cd711f23ced0ef0c82ce))


### Features

* add maxAge in koa-static-cache ([6fb953a](https://github.com/zhangyuang/ssr/commit/6fb953a4acae78c33275004474251427ae3b24c3))
* compatible with old versions ([0cd8b1c](https://github.com/zhangyuang/ssr/commit/0cd8b1cf0fbcc10a3fc9e54715e25d6ee3fbb174))
* for ctx.body will loose asynclocalstorage context, consume stream in advance like vue2/3 ([1f0c2ba](https://github.com/zhangyuang/ssr/commit/1f0c2bacd28a7a35af686c98f691a4a0c1ca9693))
* ignore node_modules dependencies in vite build ([72a7062](https://github.com/zhangyuang/ssr/commit/72a706283807609576e2de22fb4dcdaa9cc89e54))
* improve babel options experience in vue3 vite build ([7f4d34b](https://github.com/zhangyuang/ssr/commit/7f4d34b23c81fbcb665c2f819000468910eb1944))
* inject manifest in window when use vue3 ([01937f5](https://github.com/zhangyuang/ssr/commit/01937f5539164635558a2e88534a0eb13f2a4666))
* move core-react core-vue2/3 to core ([54915f7](https://github.com/zhangyuang/ssr/commit/54915f76524997af61213bf3e95a19858746c776))
* remove unplugin-element-plus ([25231dc](https://github.com/zhangyuang/ssr/commit/25231dc2cab3455bb00de61df8306ddab1ac4c6a))
* support config.rootId close [#280](https://github.com/zhangyuang/ssr/issues/280) ([107ee58](https://github.com/zhangyuang/ssr/commit/107ee5879ff8313ca890f35012ac3334f7986ba2))
* support configuration config.assetDir ([#270](https://github.com/zhangyuang/ssr/issues/270)) ([885716c](https://github.com/zhangyuang/ssr/commit/885716cefa254dc812a5cae36627103fab3c449d))
* support css inline in vue2 ([2bfa82f](https://github.com/zhangyuang/ssr/commit/2bfa82fcb7b5f1183a4479a0d4238f9a8e4fcde5))
* support css inline in vue3 ([e281ddd](https://github.com/zhangyuang/ssr/commit/e281dddf77f12230b7a9e220be0b6fa8129e8c8a))
* support inject process.env.XXX in bundle ([a403a28](https://github.com/zhangyuang/ssr/commit/a403a28b8cc6dbe43d5e9b6c6d34dade5b76803f))
* support nested routes for vue close [#277](https://github.com/zhangyuang/ssr/issues/277) ([5ff584d](https://github.com/zhangyuang/ssr/commit/5ff584d7d6fca15655a8cd32fed8dfd8e206f86a))
* support react18 ([#264](https://github.com/zhangyuang/ssr/issues/264)) ([c992161](https://github.com/zhangyuang/ssr/commit/c992161c8ea0d2f1a9814dd4b30ffa82b1bbbe84))
* support route.name close [#266](https://github.com/zhangyuang/ssr/issues/266) ([4a4d27c](https://github.com/zhangyuang/ssr/commit/4a4d27ca46856d0a0349d1de599dc10b5ddb6434))
* update axios version to 1.4.0 ([#286](https://github.com/zhangyuang/ssr/issues/286)) ([37286c7](https://github.com/zhangyuang/ssr/commit/37286c77895e90b3e534bd060fc314f99cf67be1))
* upgrade midway-cli to v2 support deploy concurrency ([13a07f6](https://github.com/zhangyuang/ssr/commit/13a07f696629ebd3fadd366844f888ceaa66247c))
* use asynclocalstorage for get correct pinia store app context instance ([a38d3e9](https://github.com/zhangyuang/ssr/commit/a38d3e99c2a6aa6a64a20099a59fb06edba1b5ea))



## [6.2.46](https://github.com/zhangyuang/ssr/compare/cli@6.2.45...cli@6.2.46) (2023-02-14)


### Features

* add ssr start --help tips in midway ([f76f0a1](https://github.com/zhangyuang/ssr/commit/f76f0a1a9dc49cb175a800655699a10065571ae2))



## [6.2.45](https://github.com/zhangyuang/ssr/compare/cli@6.2.44...cli@6.2.45) (2023-02-11)


### Bug Fixes

* add NODE_OPTIONS tips when nodejs version > 16 ([3492698](https://github.com/zhangyuang/ssr/commit/34926987bb3f6f7562b87b14289f509cecf2a6fa))
* external ([005b74a](https://github.com/zhangyuang/ssr/commit/005b74a35bbecfc44a1235b8d256aaf934b595bc))
* judge node version ([b6f17b3](https://github.com/zhangyuang/ssr/commit/b6f17b3a04afdcdea936554b60e6db96e2053532))
* update vite-vue plugin version ([#261](https://github.com/zhangyuang/ssr/issues/261)) ([31d3844](https://github.com/zhangyuang/ssr/commit/31d38447e49bc8055d59e4452d02fc9825afab64))


### Features

* add @types/koa ([0dffea6](https://github.com/zhangyuang/ssr/commit/0dffea66264dafde6ff16fd211a14137fd8b6e5d))
* add path-to-regexp to vite build vendorlist ([8934da5](https://github.com/zhangyuang/ssr/commit/8934da5dca7c709d4cbc0635bb194057b59dc2c0))
* support element-plus ([e13fed8](https://github.com/zhangyuang/ssr/commit/e13fed826ad634a31f3506afc0a7958340c9dc87))



## [6.2.44](https://github.com/zhangyuang/ssr/compare/cli@6.2.42...cli@6.2.44) (2022-12-14)


### Bug Fixes

* spa build ([d399bea](https://github.com/zhangyuang/ssr/commit/d399beac0dc3a336194651b3fc05f011a7515ff1))
* types ([7015666](https://github.com/zhangyuang/ssr/commit/70156663c28c87628596a4466cf8c647d18335dd))


### Features

* add vite dev css flicker tips ([1744a72](https://github.com/zhangyuang/ssr/commit/1744a72fbc056532336daef4ee0a439fefe529ff))



## [6.2.43](https://github.com/zhangyuang/ssr/compare/cli@6.2.42...cli@6.2.43) (2022-12-01)


### Bug Fixes

* spa build ([d399bea](https://github.com/zhangyuang/ssr/commit/d399beac0dc3a336194651b3fc05f011a7515ff1))
* types ([7015666](https://github.com/zhangyuang/ssr/commit/70156663c28c87628596a4466cf8c647d18335dd))



## [6.2.42](https://github.com/zhangyuang/ssr/compare/cli@6.2.41...cli@6.2.42) (2022-12-01)


### Features

* build spa support priority ([d456969](https://github.com/zhangyuang/ssr/commit/d4569697d00a720c2e820206ebb5df1002c4af8d))
* support jsOrderPriority🤔 cssOrderPriority🤔 ([9db9a7d](https://github.com/zhangyuang/ssr/commit/9db9a7d03e8c47a93ca459b8b8b3fad571f73960))



## [6.2.41](https://github.com/zhangyuang/ssr/compare/cli@6.2.40...cli@6.2.41) (2022-12-01)


### Features

* spa with customeFooterScript is array ([b9508ae](https://github.com/zhangyuang/ssr/commit/b9508aea7e98bbbdaecaa318667d10d04c10aa82))



## [6.2.40](https://github.com/zhangyuang/ssr/compare/cli@6.2.39...cli@6.2.40) (2022-12-01)


### Bug Fixes

* call judgeServerFramework in node environment prevent utils be ([47cd81a](https://github.com/zhangyuang/ssr/commit/47cd81a18a85be507c7d43c323c294f2d5b8775d))
* defaultExternals add react-dom close [#253](https://github.com/zhangyuang/ssr/issues/253) ([f748cee](https://github.com/zhangyuang/ssr/commit/f748ceeac2cf3205549b2a818e9cc4e386a5c250))
* pinia alias ([2256194](https://github.com/zhangyuang/ssr/commit/22561948b9d27ea6296b5f60cefb3f42d6c1d4c1))


### Features

* spa support extrajsorder cssorder ([ebc82c5](https://github.com/zhangyuang/ssr/commit/ebc82c52d35502533130fc4d6e551aed0f9d1137))
* support antd5 close [#250](https://github.com/zhangyuang/ssr/issues/250) ([c999536](https://github.com/zhangyuang/ssr/commit/c9995365fbd82faa30a006b51e5cd76ab307bab5))
* update vue alias ([36e15ac](https://github.com/zhangyuang/ssr/commit/36e15ac5d2d1398ced6abef2727970947177e6bc))



## [6.2.39](https://github.com/zhangyuang/ssr/compare/cli@6.2.38...cli@6.2.39) (2022-11-03)


### Bug Fixes

* gernerate html ([08e5678](https://github.com/zhangyuang/ssr/commit/08e567877e7b6d0b4b3a6fab6ad4ea2546b0c041))


### Features

* support fastify close [#245](https://github.com/zhangyuang/ssr/issues/245) ([#246](https://github.com/zhangyuang/ssr/issues/246)) ([d9c24c5](https://github.com/zhangyuang/ssr/commit/d9c24c595941447c5e8072c63c1a80cba06689c3))



## [6.2.38](https://github.com/zhangyuang/ssr/compare/cli@6.2.37...cli@6.2.38) (2022-10-27)


### Bug Fixes

* onlyCsr types core-vue3 render logic ([f75929e](https://github.com/zhangyuang/ssr/commit/f75929ef84e564fe7e3d9c5c6d1e56fe70f5629b))
* react hmr ([2c57a6e](https://github.com/zhangyuang/ssr/commit/2c57a6e14d485500a2e8868035d9cb6e1fa883b0))
* types ([2ad371f](https://github.com/zhangyuang/ssr/commit/2ad371fc6c0b27e6e52801048a28a3d8fdcfccf7))


### Features

* customScript support tagName ([91a836f](https://github.com/zhangyuang/ssr/commit/91a836f0b423b46f730a2c893b56f89bddd470c5))
* remove css-hot-loader inject ssrDevInfo in vue3 ([e4a28f6](https://github.com/zhangyuang/ssr/commit/e4a28f66ae019bbd5a11df649b8ffe92f6b2b2da))
* support more babelOptions like include exclude ([4a2b254](https://github.com/zhangyuang/ssr/commit/4a2b254f4f6a9996bf3c3f9fea561636d61b85ac))
* update react alias ([160b991](https://github.com/zhangyuang/ssr/commit/160b9911166172f36db9690be87f35fcbfc747aa))
* update sprops types ([9383235](https://github.com/zhangyuang/ssr/commit/9383235321f171b4d5c877d08025e9b9936175d3))
* update vite build logic ([0bf7a28](https://github.com/zhangyuang/ssr/commit/0bf7a28ca38f2cde8501dfb53546f4d3b0c6f51f))
* use jsx-runtime in react ([ffdd346](https://github.com/zhangyuang/ssr/commit/ffdd34674ff0753e130b6570ab9eef3b1aec5217))
* use ssr-mini-css-extra-plugin for micro ([fa1c025](https://github.com/zhangyuang/ssr/commit/fa1c025b19b38733c20b11a40860b7eb648387e6))



## [6.2.37](https://github.com/zhangyuang/ssr/compare/cli@6.2.36...cli@6.2.37) (2022-09-27)


### Features

* add env flag when ssg ([32fef6f](https://github.com/zhangyuang/ssr/commit/32fef6f8d43bf2cecb867f6d0e2d9f8e6d113224))



## [6.2.36](https://github.com/zhangyuang/ssr/compare/cli@6.2.34...cli@6.2.36) (2022-09-25)


### Bug Fixes

* don't inject dynamic js chunk in html for sourcemap ([7771694](https://github.com/zhangyuang/ssr/commit/7771694d1e34ab2fccf5e411a5b7611047b38a23))
* hidden nest build warning ([28e809d](https://github.com/zhangyuang/ssr/commit/28e809da607a77e6e0d97075c179d3b0a53a988d))
* nest start tips ([ac7f0a1](https://github.com/zhangyuang/ssr/commit/ac7f0a1a50b5765fcd00d00195b5a413070ac0b3))
* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* spinner.stop when stdout end ([9636fc6](https://github.com/zhangyuang/ssr/commit/9636fc650cf8f9050381480f06c58103f1806d05))
* update correct cwd in postinstall ([fff08ef](https://github.com/zhangyuang/ssr/commit/fff08efe37436f96e599f2265b1931c0a1d6df72))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))
* update postinstall ([1078a50](https://github.com/zhangyuang/ssr/commit/1078a50254f27de58525ffec4f7c92a60e4dc03c))


### Features

* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* close css less sourcemap ([7936f71](https://github.com/zhangyuang/ssr/commit/7936f71a5db4faeb6b84a5a15967d19c5d8c606b))
* close default hmr host ([f415d73](https://github.com/zhangyuang/ssr/commit/f415d7363a0a40f36074402eb8db7747538e05a1))
* move nestjs-pinia example in ([d214b2c](https://github.com/zhangyuang/ssr/commit/d214b2ccded3d3dc43092b43c9c69ee2122c9bd5))
* move render app logic in server-render not in core ([8638ab2](https://github.com/zhangyuang/ssr/commit/8638ab2970bbd9e47598d93e7038f8f599ea82f5))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* support ssg ([27e2c7c](https://github.com/zhangyuang/ssr/commit/27e2c7cfb88ce6fa07f393a231d22a1d60b36fd2))
* update vue2/react logic in plugin ([e2d576b](https://github.com/zhangyuang/ssr/commit/e2d576b92bf8a0e9615480c2d7cccb42ad59635d))
* use esbuild transform manualroutes ([cf77fcd](https://github.com/zhangyuang/ssr/commit/cf77fcd489a02deb49d7c85def240f4f19367ad9))
* use eval-source-map replace cheap-sourcemap in dev ([1bd615e](https://github.com/zhangyuang/ssr/commit/1bd615e52b24334f727c3c0c13113125670c776f))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))
* 完善 ssg 文档 ([384b85a](https://github.com/zhangyuang/ssr/commit/384b85a820043dc9154677ace66e16568d322aca))



## [6.2.35](https://github.com/zhangyuang/ssr/compare/cli@6.2.35...cli@6.2.35) (2022-08-19)


### Bug Fixes

* react prebundle ([9e41e60](https://github.com/zhangyuang/ssr/commit/9e41e607e54db98aa3b9dd9b8e23d744efbbcda3))
* update example ([185219c](https://github.com/zhangyuang/ssr/commit/185219cee04d55d347b8dc6511798430a5f19c73))


### Features

* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* render head script after fetch in vue3 ([edb2ac7](https://github.com/zhangyuang/ssr/commit/edb2ac7051fe12bbda7d13a84870a427fa71bc68))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))



