## [6.2.16](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.16) (2022-08-17)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add clientBuildEnd event ([f081d4b](https://github.com/zhangyuang/ssr/commit/f081d4b5cf7b826967fc3013ff625adb871bdcb1))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* css chunkname ([4576d7b](https://github.com/zhangyuang/ssr/commit/4576d7b8ffce5b2e32624cae8c19d81235ad1636))
* default splitChunks options ([20fb45f](https://github.com/zhangyuang/ssr/commit/20fb45f5567b4cc8788fa93d9e1772bf6695e723))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* dynamic render ([7a9157c](https://github.com/zhangyuang/ssr/commit/7a9157cab3a1de354629345961d895b5c29d86c3))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* esbuild bundle only in dev ([10aef35](https://github.com/zhangyuang/ssr/commit/10aef35232ca158e3b1c0637fc04a50c44673026))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* generate html add all chunk css ([7a1be47](https://github.com/zhangyuang/ssr/commit/7a1be479b908a488e695385097cc41d609955bd0))
* inject clientPrefix in csr ([33b15ac](https://github.com/zhangyuang/ssr/commit/33b15acb36f25fce183b01457e32f9e622462d8e))
* judge isVite in core ([7c175a2](https://github.com/zhangyuang/ssr/commit/7c175a2513673e53840beb9904cfe39dbb149ba8))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
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
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* userConfig ([b385333](https://github.com/zhangyuang/ssr/commit/b3853337623dee41907cc7465b0eb27dd9395c90))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add checkBuildEnd ([fa37147](https://github.com/zhangyuang/ssr/commit/fa371479d6f6d609d4ae6b9bf160ea4966255e09))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add optimize logic in server plugin ([5f5d5c3](https://github.com/zhangyuang/ssr/commit/5f5d5c3f482b580efcb3fe06b984051a0bec1975))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add useApp ([48aefed](https://github.com/zhangyuang/ssr/commit/48aefedde20b547921905b7b961ede86c1873a4b))
* add usePinia ([3253e83](https://github.com/zhangyuang/ssr/commit/3253e83b8b3c1d86bcf83e0dce74e03f5704706d))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add useStoreContext ([ee3cd7a](https://github.com/zhangyuang/ssr/commit/ee3cd7a9f6e0807b237f106e876a3e1081579b73))
* add vendorMap in vite build ([a084620](https://github.com/zhangyuang/ssr/commit/a0846207fc3c5092927f5fb57480c9a669f767e2))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
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
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* remove clientBuildEnd events ([44cc355](https://github.com/zhangyuang/ssr/commit/44cc355f0dc060ae58581488a1fc1573ebad1ba5))
* remove getlocalmodules update getuserconfig ([172adde](https://github.com/zhangyuang/ssr/commit/172adde96395fc3b3dd489fa8e529e21a0c226f4))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* support dynamicFile ([c11781c](https://github.com/zhangyuang/ssr/commit/c11781c846651bd8027c8d5b9821163181f8629b))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support link preload ([9a6abf3](https://github.com/zhangyuang/ssr/commit/9a6abf3fcdae8f02928731018e8aa7370f804d82))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update combineRoutes ([7102531](https://github.com/zhangyuang/ssr/commit/7102531660e3a2aa3f607e8b138894a3bdbca371))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use exec run shell rather than npx in plugin-nest ([e644937](https://github.com/zhangyuang/ssr/commit/e644937959742144ffaf909ea3271dda093da221))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



## [6.2.15](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.15) (2022-08-16)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add clientBuildEnd event ([f081d4b](https://github.com/zhangyuang/ssr/commit/f081d4b5cf7b826967fc3013ff625adb871bdcb1))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* client prefix ([93f4d5c](https://github.com/zhangyuang/ssr/commit/93f4d5c7307597d54581bcb0f169838b814ad2b8))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* css chunkname ([4576d7b](https://github.com/zhangyuang/ssr/commit/4576d7b8ffce5b2e32624cae8c19d81235ad1636))
* default splitChunks options ([20fb45f](https://github.com/zhangyuang/ssr/commit/20fb45f5567b4cc8788fa93d9e1772bf6695e723))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* dynamic render ([7a9157c](https://github.com/zhangyuang/ssr/commit/7a9157cab3a1de354629345961d895b5c29d86c3))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* esbuild bundle only in dev ([10aef35](https://github.com/zhangyuang/ssr/commit/10aef35232ca158e3b1c0637fc04a50c44673026))
* externals ([99978dc](https://github.com/zhangyuang/ssr/commit/99978dcc331bc6a1579688f84aefa5348442a0a0))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* generate html add all chunk css ([7a1be47](https://github.com/zhangyuang/ssr/commit/7a1be479b908a488e695385097cc41d609955bd0))
* inject clientPrefix in csr ([33b15ac](https://github.com/zhangyuang/ssr/commit/33b15acb36f25fce183b01457e32f9e622462d8e))
* judge isVite in core ([7c175a2](https://github.com/zhangyuang/ssr/commit/7c175a2513673e53840beb9904cfe39dbb149ba8))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
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
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* userConfig ([b385333](https://github.com/zhangyuang/ssr/commit/b3853337623dee41907cc7465b0eb27dd9395c90))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add checkBuildEnd ([fa37147](https://github.com/zhangyuang/ssr/commit/fa371479d6f6d609d4ae6b9bf160ea4966255e09))
* add nest build stdout ([ea78454](https://github.com/zhangyuang/ssr/commit/ea784547132e224bb52449681f575d51d8b9b0c1))
* add optimize logic in server plugin ([5f5d5c3](https://github.com/zhangyuang/ssr/commit/5f5d5c3f482b580efcb3fe06b984051a0bec1975))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr update help check dependencies ([192c95d](https://github.com/zhangyuang/ssr/commit/192c95dac1a626991de37e439774a1e26c4f668c))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add useApp ([48aefed](https://github.com/zhangyuang/ssr/commit/48aefedde20b547921905b7b961ede86c1873a4b))
* add usePinia ([3253e83](https://github.com/zhangyuang/ssr/commit/3253e83b8b3c1d86bcf83e0dce74e03f5704706d))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add useStoreContext ([ee3cd7a](https://github.com/zhangyuang/ssr/commit/ee3cd7a9f6e0807b237f106e876a3e1081579b73))
* add vendorMap in vite build ([a084620](https://github.com/zhangyuang/ssr/commit/a0846207fc3c5092927f5fb57480c9a669f767e2))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
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
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* preserve-symlink when webpack build whiteList ([c204d75](https://github.com/zhangyuang/ssr/commit/c204d75d620155001e30137e498617902784c9e6))
* react client-entry add react-router ([c538afc](https://github.com/zhangyuang/ssr/commit/c538afcc5bd18e5b9fbdcbef1ce4a8d87de7ec8f))
* remove clientBuildEnd events ([44cc355](https://github.com/zhangyuang/ssr/commit/44cc355f0dc060ae58581488a1fc1573ebad1ba5))
* remove getlocalmodules update getuserconfig ([172adde](https://github.com/zhangyuang/ssr/commit/172adde96395fc3b3dd489fa8e529e21a0c226f4))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support build ssr-common-utils in bundle ([3af1eba](https://github.com/zhangyuang/ssr/commit/3af1ebac06dd8d50a4c29b72b308f905de768677))
* support dynamicFile ([c11781c](https://github.com/zhangyuang/ssr/commit/c11781c846651bd8027c8d5b9821163181f8629b))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support link preload ([9a6abf3](https://github.com/zhangyuang/ssr/commit/9a6abf3fcdae8f02928731018e8aa7370f804d82))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update combineRoutes ([7102531](https://github.com/zhangyuang/ssr/commit/7102531660e3a2aa3f607e8b138894a3bdbca371))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* update webpack external logic ([1c09fee](https://github.com/zhangyuang/ssr/commit/1c09fee8afd03de34e8fdd3c89348d87da509eba))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



## [6.2.14](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.14) (2022-08-09)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add clientBuildEnd event ([f081d4b](https://github.com/zhangyuang/ssr/commit/f081d4b5cf7b826967fc3013ff625adb871bdcb1))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* css chunkname ([4576d7b](https://github.com/zhangyuang/ssr/commit/4576d7b8ffce5b2e32624cae8c19d81235ad1636))
* default splitChunks options ([20fb45f](https://github.com/zhangyuang/ssr/commit/20fb45f5567b4cc8788fa93d9e1772bf6695e723))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* dynamic render ([7a9157c](https://github.com/zhangyuang/ssr/commit/7a9157cab3a1de354629345961d895b5c29d86c3))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* esbuild bundle only in dev ([10aef35](https://github.com/zhangyuang/ssr/commit/10aef35232ca158e3b1c0637fc04a50c44673026))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* generate html add all chunk css ([7a1be47](https://github.com/zhangyuang/ssr/commit/7a1be479b908a488e695385097cc41d609955bd0))
* inject clientPrefix in csr ([33b15ac](https://github.com/zhangyuang/ssr/commit/33b15acb36f25fce183b01457e32f9e622462d8e))
* judge isVite in core ([7c175a2](https://github.com/zhangyuang/ssr/commit/7c175a2513673e53840beb9904cfe39dbb149ba8))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
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
* update parse logic to non-render file ([6140204](https://github.com/zhangyuang/ssr/commit/61402041ba76dfd61b9d74f0d79490603271cbcc))
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* userConfig ([b385333](https://github.com/zhangyuang/ssr/commit/b3853337623dee41907cc7465b0eb27dd9395c90))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add @types/express in nest ([37877a4](https://github.com/zhangyuang/ssr/commit/37877a43734e1cf2ff15deb921795974c0458bcb))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add checkBuildEnd ([fa37147](https://github.com/zhangyuang/ssr/commit/fa371479d6f6d609d4ae6b9bf160ea4966255e09))
* add optimize logic in server plugin ([5f5d5c3](https://github.com/zhangyuang/ssr/commit/5f5d5c3f482b580efcb3fe06b984051a0bec1975))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add useApp ([48aefed](https://github.com/zhangyuang/ssr/commit/48aefedde20b547921905b7b961ede86c1873a4b))
* add usePinia ([3253e83](https://github.com/zhangyuang/ssr/commit/3253e83b8b3c1d86bcf83e0dce74e03f5704706d))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add useStoreContext ([ee3cd7a](https://github.com/zhangyuang/ssr/commit/ee3cd7a9f6e0807b237f106e876a3e1081579b73))
* add vendorMap in vite build ([a084620](https://github.com/zhangyuang/ssr/commit/a0846207fc3c5092927f5fb57480c9a669f767e2))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
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
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* remove clientBuildEnd events ([44cc355](https://github.com/zhangyuang/ssr/commit/44cc355f0dc060ae58581488a1fc1573ebad1ba5))
* remove getlocalmodules update getuserconfig ([172adde](https://github.com/zhangyuang/ssr/commit/172adde96395fc3b3dd489fa8e529e21a0c226f4))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support dynamicFile ([c11781c](https://github.com/zhangyuang/ssr/commit/c11781c846651bd8027c8d5b9821163181f8629b))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support link preload ([9a6abf3](https://github.com/zhangyuang/ssr/commit/9a6abf3fcdae8f02928731018e8aa7370f804d82))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update combineRoutes ([7102531](https://github.com/zhangyuang/ssr/commit/7102531660e3a2aa3f607e8b138894a3bdbca371))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



## [6.2.13](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.13) (2022-08-08)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add clientBuildEnd event ([f081d4b](https://github.com/zhangyuang/ssr/commit/f081d4b5cf7b826967fc3013ff625adb871bdcb1))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* css chunkname ([4576d7b](https://github.com/zhangyuang/ssr/commit/4576d7b8ffce5b2e32624cae8c19d81235ad1636))
* default splitChunks options ([20fb45f](https://github.com/zhangyuang/ssr/commit/20fb45f5567b4cc8788fa93d9e1772bf6695e723))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* dynamic render ([7a9157c](https://github.com/zhangyuang/ssr/commit/7a9157cab3a1de354629345961d895b5c29d86c3))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* esbuild bundle only in dev ([10aef35](https://github.com/zhangyuang/ssr/commit/10aef35232ca158e3b1c0637fc04a50c44673026))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* generate html add all chunk css ([7a1be47](https://github.com/zhangyuang/ssr/commit/7a1be479b908a488e695385097cc41d609955bd0))
* inject clientPrefix in csr ([33b15ac](https://github.com/zhangyuang/ssr/commit/33b15acb36f25fce183b01457e32f9e622462d8e))
* judge isVite in core ([7c175a2](https://github.com/zhangyuang/ssr/commit/7c175a2513673e53840beb9904cfe39dbb149ba8))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
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
* update parse logic to non-render file ([6140204](https://github.com/zhangyuang/ssr/commit/61402041ba76dfd61b9d74f0d79490603271cbcc))
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* userConfig ([b385333](https://github.com/zhangyuang/ssr/commit/b3853337623dee41907cc7465b0eb27dd9395c90))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* utils types ([39575be](https://github.com/zhangyuang/ssr/commit/39575be39b5238c555899111ecee83627e131aba))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add checkBuildEnd ([fa37147](https://github.com/zhangyuang/ssr/commit/fa371479d6f6d609d4ae6b9bf160ea4966255e09))
* add optimize logic in server plugin ([5f5d5c3](https://github.com/zhangyuang/ssr/commit/5f5d5c3f482b580efcb3fe06b984051a0bec1975))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add useApp ([48aefed](https://github.com/zhangyuang/ssr/commit/48aefedde20b547921905b7b961ede86c1873a4b))
* add usePinia ([3253e83](https://github.com/zhangyuang/ssr/commit/3253e83b8b3c1d86bcf83e0dce74e03f5704706d))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add useStoreContext ([ee3cd7a](https://github.com/zhangyuang/ssr/commit/ee3cd7a9f6e0807b237f106e876a3e1081579b73))
* add vendorMap in vite build ([a084620](https://github.com/zhangyuang/ssr/commit/a0846207fc3c5092927f5fb57480c9a669f767e2))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
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
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* remove clientBuildEnd events ([44cc355](https://github.com/zhangyuang/ssr/commit/44cc355f0dc060ae58581488a1fc1573ebad1ba5))
* remove getlocalmodules update getuserconfig ([172adde](https://github.com/zhangyuang/ssr/commit/172adde96395fc3b3dd489fa8e529e21a0c226f4))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support dynamicFile ([c11781c](https://github.com/zhangyuang/ssr/commit/c11781c846651bd8027c8d5b9821163181f8629b))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support link preload ([9a6abf3](https://github.com/zhangyuang/ssr/commit/9a6abf3fcdae8f02928731018e8aa7370f804d82))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update combineRoutes ([7102531](https://github.com/zhangyuang/ssr/commit/7102531660e3a2aa3f607e8b138894a3bdbca371))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



## [6.2.12](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.12) (2022-07-19)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add checkContains ([6cae390](https://github.com/zhangyuang/ssr/commit/6cae390785e9f0c7aeb1574322a840a7569a6f8e))
* add pinia instance in params in ssr ([6cbaacf](https://github.com/zhangyuang/ssr/commit/6cbaacfea35cb7c92463ec99975ab709b6f5ba57))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* add watchCount ([de1cef1](https://github.com/zhangyuang/ssr/commit/de1cef1db9193bdbbc5a4ec330e04ebcb29dd25a))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* clearlastAsyncChunkMap ([81a605d](https://github.com/zhangyuang/ssr/commit/81a605d79786609c063cba62aeec971cc38ffe17))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* entryList in vite build ([3c928f9](https://github.com/zhangyuang/ssr/commit/3c928f962d490bcc5b352ffe95670c3bf7bf439b))
* f.koa.yml ([5f1012a](https://github.com/zhangyuang/ssr/commit/5f1012a0d5f21a3ecf796de108d5cdab4a3b2e25))
* fetch data after use pinia ([3d1a3f4](https://github.com/zhangyuang/ssr/commit/3d1a3f41d6f5c001c4e233aba25608147fdae2a2))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* manualChunks ([95e16d9](https://github.com/zhangyuang/ssr/commit/95e16d9cbc6a8e6fc820e3419b9ef333e65bfdf6))
* parseRoutes in react close [#227](https://github.com/zhangyuang/ssr/issues/227) ([51c506c](https://github.com/zhangyuang/ssr/commit/51c506c39d6dc9dcf1b677b6d3363085ebf3e82b))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
* react router basename in server entry ([#212](https://github.com/zhangyuang/ssr/issues/212)) ([28072f7](https://github.com/zhangyuang/ssr/commit/28072f7bdfc489a27599b636db33bdea18ef4c18))
* Recommended to specify used minor core-js version ([#207](https://github.com/zhangyuang/ssr/issues/207)) ([9db0424](https://github.com/zhangyuang/ssr/commit/9db0424e5e7ad1728d40665d01740f7a2c1c4b70))
* release utils ([1b9c56b](https://github.com/zhangyuang/ssr/commit/1b9c56bc904faa0cae39fb329c02b5d159d69872))
* restore webpack split chunks config ([2f7ae67](https://github.com/zhangyuang/ssr/commit/2f7ae67ecef863d56752a4a4e1fa7a75ec0756ed))
* revert vite build ([210ddea](https://github.com/zhangyuang/ssr/commit/210ddea22fc0639f60fcee96bdf47463d188e18f))
* set defaulr hmr protocol to ws ([0d14c1c](https://github.com/zhangyuang/ssr/commit/0d14c1cae2b10dfea262c76794fd0a4ebca3f8ae))
* ssr start --optimize ([42bb399](https://github.com/zhangyuang/ssr/commit/42bb39931001af5ad19e1f42b7912ffa08c47e71))
* update parse logic to non-render file ([6140204](https://github.com/zhangyuang/ssr/commit/61402041ba76dfd61b9d74f0d79490603271cbcc))
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* useStore types ([3532bfb](https://github.com/zhangyuang/ssr/commit/3532bfbef9981da300abf748a98925b59cc2c71d))
* vite build logic close [#221](https://github.com/zhangyuang/ssr/issues/221) ([297e2c0](https://github.com/zhangyuang/ssr/commit/297e2c0e5ad6609ce8cd3954a5886387f84343e6))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* void chunk logic ([ad694a1](https://github.com/zhangyuang/ssr/commit/ad694a1275f12560360f4e73c3466cce39b3e878))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* webpack optimize ([#226](https://github.com/zhangyuang/ssr/issues/226)) ([f06a227](https://github.com/zhangyuang/ssr/commit/f06a227f3b221aa575a5c04ad7cd3532ffcf6914))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add optimize logic in server plugin ([8d4c200](https://github.com/zhangyuang/ssr/commit/8d4c2005894ed90de0ebadb8adf0504e449a5dca))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add splitPriorityMap ([11e3888](https://github.com/zhangyuang/ssr/commit/11e38888d820e3be34180360373310fdbf497a67))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add useStore ([b786b8c](https://github.com/zhangyuang/ssr/commit/b786b8cc314ce9d45d56ac68c93020209643b208))
* add vite entry list ([9530443](https://github.com/zhangyuang/ssr/commit/95304435b294400e67112ba59544df2be2a31b8f))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* add writeEmitter ([195f3ca](https://github.com/zhangyuang/ssr/commit/195f3cad7a9ff41ecb54ec151e3fe511665e8d62))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
* change splitChunks from all to initial ([f0de225](https://github.com/zhangyuang/ssr/commit/f0de22566ff7769b02d3b7d7b75bde12a5b2c28a))
* don't cover viteConfig.build ([02aef3b](https://github.com/zhangyuang/ssr/commit/02aef3b44c1cde54d8586f0d73defdcdc7ce0ad3))
* don't emit void chunk ([dc5d8b7](https://github.com/zhangyuang/ssr/commit/dc5d8b742a9f97f2be38d9da633b9d1768b6710b))
* don't write file to dist in webpack optimize ([c1cbce9](https://github.com/zhangyuang/ssr/commit/c1cbce927716dfa4fca052b1d54448e87771b1f6))
* generate html file support inject prefix ([02741ee](https://github.com/zhangyuang/ssr/commit/02741eeda778eec26504c5e7e2c074b1d2402e83))
* move react-router to external ([0a58570](https://github.com/zhangyuang/ssr/commit/0a585705fb66d9f3a4a59008f1f3e82b23f05fae))
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* set argv.ssl for plugin-midway ([#213](https://github.com/zhangyuang/ssr/issues/213)) ([65c1cb9](https://github.com/zhangyuang/ssr/commit/65c1cb9da0772e915162dcd9b03fad2fada22b40))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support more vite config ([3ac5edc](https://github.com/zhangyuang/ssr/commit/3ac5edc605b59a1e1927fad0838cc730aba82b59))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support vuex store options ([9bed529](https://github.com/zhangyuang/ssr/commit/9bed5299a59386e0cd70abbb8a66eca6090ed400))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* support wildcare params ([c5cde18](https://github.com/zhangyuang/ssr/commit/c5cde18566365f9d3bbc81691c0ca5e7b72607d4))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update fetch params ([70aedaa](https://github.com/zhangyuang/ssr/commit/70aedaa82a69552e22af1998bf1c2de8e30e0283))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* update vue example inject content for consistent ([c863c01](https://github.com/zhangyuang/ssr/commit/c863c011fc06ceed5d204d3d96eea29cf7c7d4b8))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vite@2.9.13 move ssr-hoc-react to noOptimize close [#216](https://github.com/zhangyuang/ssr/issues/216) ([842b8af](https://github.com/zhangyuang/ssr/commit/842b8af830927731a2fb35d77dde7c2a051c3670))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))
* webpack build optimize ([#222](https://github.com/zhangyuang/ssr/issues/222)) ([217dd38](https://github.com/zhangyuang/ssr/commit/217dd388c70d2a7d93d8eeec64a3d26136afe51b))



## [6.2.11](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.11) (2022-06-20)


### Bug Fixes

* add build:publish disable sourcemap ([ef82b29](https://github.com/zhangyuang/ssr/commit/ef82b298ddf19b72b130d76c33bfbca67339b139))
* add prefix output to window.prefix in csr mode ([#197](https://github.com/zhangyuang/ssr/issues/197)) ([479bb3d](https://github.com/zhangyuang/ssr/commit/479bb3df67d7da5635939a4219b5f5f9a40b5508))
* build html ([83be7be](https://github.com/zhangyuang/ssr/commit/83be7be185985a5dcbb9b8e846a5e2b14b94c1b0))
* build html ([59a8d7f](https://github.com/zhangyuang/ssr/commit/59a8d7f31bed703601e753d02db49ea5a0f93054))
* ci ([57e713f](https://github.com/zhangyuang/ssr/commit/57e713f1f96b4ceb893837c15c6032b23a0b1a4c))
* core-js types ([036bf38](https://github.com/zhangyuang/ssr/commit/036bf385d8ed804dfc2e46ef4484f7bf499d7cdb))
* don't throw error when load module failed ([2e5d077](https://github.com/zhangyuang/ssr/commit/2e5d077848dc10998a04fcccccc7c745c0d1bea7))
* fix config htmlTemplate read ([#191](https://github.com/zhangyuang/ssr/issues/191)) ([8c3e12b](https://github.com/zhangyuang/ssr/commit/8c3e12b6adb64b7898bc6232d980e72c5353026b))
* loadConfig ([8960c84](https://github.com/zhangyuang/ssr/commit/8960c84eea7b384d59ebfe6424813afec433b3f8))
* lock babel-plugin-import ([72c3041](https://github.com/zhangyuang/ssr/commit/72c3041bf61a1fc9b7593df1fdb6c4dc850c6bbd))
* lock vite version in plugin-react ([e015b75](https://github.com/zhangyuang/ssr/commit/e015b750c60dcae9a4a7e5fe14937177b80367ca))
* plugin-react without dynamic mode ([487cc84](https://github.com/zhangyuang/ssr/commit/487cc84188640aab13c27214df758da0d19e4368))
* postinstall ([fef24ba](https://github.com/zhangyuang/ssr/commit/fef24bada3498f162efd0bdd09921503e44ad21a))
* postinstall get correct path ([b3d1951](https://github.com/zhangyuang/ssr/commit/b3d1951b7537c5954fd040797fc0011a1d4439d7))
* Recommended to specify used minor core-js version ([#207](https://github.com/zhangyuang/ssr/issues/207)) ([9db0424](https://github.com/zhangyuang/ssr/commit/9db0424e5e7ad1728d40665d01740f7a2c1c4b70))
* restore webpack split chunks config ([2f7ae67](https://github.com/zhangyuang/ssr/commit/2f7ae67ecef863d56752a4a4e1fa7a75ec0756ed))
* revert vite build ([210ddea](https://github.com/zhangyuang/ssr/commit/210ddea22fc0639f60fcee96bdf47463d188e18f))
* update preinstall ([2b4b869](https://github.com/zhangyuang/ssr/commit/2b4b869c28b83b414bef10260e5561bc3773cea9))
* vite mode config.base ([c64aa1a](https://github.com/zhangyuang/ssr/commit/c64aa1ab9d88cdfd7df1cce6feb43b191847e666))
* **vite:** vite config base use publicPath first in client ([#192](https://github.com/zhangyuang/ssr/issues/192)) ([ef5b145](https://github.com/zhangyuang/ssr/commit/ef5b1451850441b0748727d09144e6e671f71208))
* vue3 package.json ([c49fb14](https://github.com/zhangyuang/ssr/commit/c49fb146fc6ba79ffbeee567e334b560ffecbcac))
* whitList concat userconfig ([fdd971a](https://github.com/zhangyuang/ssr/commit/fdd971ab11aebc0f348d789e758183b877e791af))
* whitList concat userconfig ([e2328f8](https://github.com/zhangyuang/ssr/commit/e2328f87f5cfc18c9a30867e4f6e18d0df5c1ba3))


### Features

*  optimize code remove disableClientRender fix vite ([eeff477](https://github.com/zhangyuang/ssr/commit/eeff4770f8d9ff400289cf4d1ca4dd32883be108))
* add .vue to defaultWhiteList ([dbabfa2](https://github.com/zhangyuang/ssr/commit/dbabfa2864ec0a5487aadc31286da5630a8603fc))
* add `turbo` ([#196](https://github.com/zhangyuang/ssr/issues/196)) ([2be17bb](https://github.com/zhangyuang/ssr/commit/2be17bba5d80610b97b3813b3d4fe9579f88e5c3))
* add parseRoutes watcher when files changed remove webpack-chain in ([a499654](https://github.com/zhangyuang/ssr/commit/a49965470e2b1e1d9744b59baede586bdd5fff90))
* add ssr-common-utils ([c12a283](https://github.com/zhangyuang/ssr/commit/c12a283e0133285402f4af5cd0346b84f2aaf098))
* add ssr-serialize-javascript code optimize ([41bb14d](https://github.com/zhangyuang/ssr/commit/41bb14d31efd89d4a85d5220544d2f7a3883e1a3))
* add viteConfig.ssr.external ([2035967](https://github.com/zhangyuang/ssr/commit/2035967def8d2f9d48997d6994efd8ffbb4fd382))
* babelExtraModule support vue ([06251e7](https://github.com/zhangyuang/ssr/commit/06251e716678e1f882f06f68f72c518a341de0d7))
* babelExtraModule support vue ([513073d](https://github.com/zhangyuang/ssr/commit/513073ddcecbb728d34eae233686a93d63355e00))
* change splitChunks from all to initial ([f0de225](https://github.com/zhangyuang/ssr/commit/f0de22566ff7769b02d3b7d7b75bde12a5b2c28a))
* optimize customescript ([f374760](https://github.com/zhangyuang/ssr/commit/f3747608d4684576875968394eca6315e2fa8dd1))
* plugin-midway remove luckyeye ([bb4b11f](https://github.com/zhangyuang/ssr/commit/bb4b11f289d060c8b332cf610bb6d8c4cf25142b))
* plugin-react add react-refresh, remove module.hot ([7bee211](https://github.com/zhangyuang/ssr/commit/7bee211ddfefaef688713f505756e1155320b844))
* remove plugin-nestjs deploy ([0ba16f8](https://github.com/zhangyuang/ssr/commit/0ba16f861b6dc679f216cbbcc931de75cdf79501))
* render add generic function overloading ([f03897f](https://github.com/zhangyuang/ssr/commit/f03897f07844d8fd5f9d2cf3eeef1a726da794bf))
* support htmlTemplate ([b240811](https://github.com/zhangyuang/ssr/commit/b2408114a6314ef4f96f4c06159d18fc6d881a57))
* support props.ssrApp in vue3 ([8985037](https://github.com/zhangyuang/ssr/commit/898503753cbe69187d27f91c70dff3f4cd4a0b2a))
* support vite + wasm vite otherConfig ([7e65899](https://github.com/zhangyuang/ssr/commit/7e658998bc404c28374645c3a8a433a3db171f36))
* support wasm in webpack, lock postcss-preset-env version ([8ad50a4](https://github.com/zhangyuang/ssr/commit/8ad50a41227a8eb5395c955e5deeda7eb56036b0))
* update chainBaseConfig ([51c1fbe](https://github.com/zhangyuang/ssr/commit/51c1fbe5a645d4701c7ebc035083096d50301891))
* update extraJsOrder extraCssOrder ([cd5ca99](https://github.com/zhangyuang/ssr/commit/cd5ca99a686ea565020500a6c4f77e310b422ce3))
* update midway deploy ([a473c59](https://github.com/zhangyuang/ssr/commit/a473c599657df42b4bf7a59f248b3c7c33907657))
* update plugin-vue3 support call pinia in fetch.ts ([958fdc7](https://github.com/zhangyuang/ssr/commit/958fdc787ab615593f3114a6bf2c6cea4823afc2))
* update ssr-common-utils ([c7cadc1](https://github.com/zhangyuang/ssr/commit/c7cadc14922383f8fdaa6c76b4dbe9c220d0ac72))
* update turbo ([9ee14f5](https://github.com/zhangyuang/ssr/commit/9ee14f59359187e35f4ef990998846ac3847347b))
* update vite config ([0596573](https://github.com/zhangyuang/ssr/commit/05965738898d96d53dedbd41746b8100dcc5653b))
* upgrade midway example to v3 ([572f7c5](https://github.com/zhangyuang/ssr/commit/572f7c5d171346cc17f5f6cdebe33aee76e0c146))
* upgrade vue-router^2 to vue-router^3 ([283ed9e](https://github.com/zhangyuang/ssr/commit/283ed9ec4f6d8a622bcc3599ca33f9b0885ed3e5))
* use pnpm replace yarn workspace and lerna ([#186](https://github.com/zhangyuang/ssr/issues/186)) ([d578506](https://github.com/zhangyuang/ssr/commit/d578506160712847c1dd021b7759c7e9ff3c03e8))
* use ssr-vite-plugin-style-import ([1c8cac2](https://github.com/zhangyuang/ssr/commit/1c8cac2ff9bb7ec0132c23203efa5c85a8c7492e))
* use terser minify plugin-react server bundle ([0a3c7fe](https://github.com/zhangyuang/ssr/commit/0a3c7fe61908fe24bcb2d8c6394daf2afd18ba82))
* vite build extra vendor ([#210](https://github.com/zhangyuang/ssr/issues/210)) ([3eb6e4f](https://github.com/zhangyuang/ssr/commit/3eb6e4fde592a6ef59a7fd6790b56e38c187960d))
* vite build extra vendor and client-entry ([#211](https://github.com/zhangyuang/ssr/issues/211)) ([41fb1fe](https://github.com/zhangyuang/ssr/commit/41fb1fef04a1c954828d42e4dfe40445bcea444f))
* vite mode support splitChunk dynamic module ([4157fc2](https://github.com/zhangyuang/ssr/commit/4157fc24176b69c9815450b3623742995feae144))
* vue3 add default isCustomElement ([44ab37c](https://github.com/zhangyuang/ssr/commit/44ab37c27908b5927578d78a834d2404d42c70dd))
* vue3 support pinia, replace props.fetchData to props.reactiveFetchData in vue2/3 ([eabcb50](https://github.com/zhangyuang/ssr/commit/eabcb50729517b7cb649729d52356a06a010a8fc))



# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [6.2.10](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.10) (2022-04-08)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.9](https://github.com/zhangyuang/ssr/compare/v6.2.8...v6.2.9) (2022-04-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.8](https://github.com/zhangyuang/ssr/compare/v6.2.7...v6.2.8) (2022-04-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.7](https://github.com/zhangyuang/ssr/compare/v6.2.6...v6.2.7) (2022-04-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.6](https://github.com/zhangyuang/ssr/compare/v6.2.4...v6.2.6) (2022-04-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.5](https://github.com/zhangyuang/ssr/compare/v6.2.4...v6.2.5) (2022-04-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.4](https://github.com/zhangyuang/ssr/compare/v6.2.3...v6.2.4) (2022-04-01)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.2.3](https://github.com/zhangyuang/ssr/compare/v6.2.1...v6.2.3) (2022-04-01)

**Note:** Version bump only for package ssr-plugin-nestjs





# [6.2.0](https://github.com/zhangyuang/ssr/compare/v6.2.0-alpha.0...v6.2.0) (2022-03-31)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.78](https://github.com/zhangyuang/ssr/compare/v6.1.77...v6.1.78) (2022-03-28)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.77](https://github.com/zhangyuang/ssr/compare/v6.1.76...v6.1.77) (2022-03-28)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.76](https://github.com/zhangyuang/ssr/compare/v6.1.75...v6.1.76) (2022-03-24)


### Features

* remove plugin.js ([a97ed3e](https://github.com/zhangyuang/ssr/commit/a97ed3e58cd239ba649f3bf3551e24ce3a96da44))





## [6.1.74](https://github.com/zhangyuang/ssr/compare/v6.1.73...v6.1.74) (2022-03-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.73](https://github.com/zhangyuang/ssr/compare/v6.1.72...v6.1.73) (2022-03-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.71](https://github.com/zhangyuang/ssr/compare/v6.1.70...v6.1.71) (2022-03-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.70](https://github.com/zhangyuang/ssr/compare/v6.1.68...v6.1.70) (2022-03-15)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.69](https://github.com/zhangyuang/ssr/compare/v6.1.68...v6.1.69) (2022-03-08)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.68](https://github.com/zhangyuang/ssr/compare/v6.1.67...v6.1.68) (2022-03-04)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.67](https://github.com/zhangyuang/ssr/compare/v6.1.66...v6.1.67) (2022-02-18)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.65](https://github.com/zhangyuang/ssr/compare/v6.1.62...v6.1.65) (2022-02-17)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.59](https://github.com/zhangyuang/ssr/compare/v6.1.58...v6.1.59) (2022-02-08)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.58](https://github.com/zhangyuang/ssr/compare/v6.1.57...v6.1.58) (2022-01-29)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.57](https://github.com/zhangyuang/ssr/compare/v6.1.56...v6.1.57) (2022-01-28)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.56](https://github.com/zhangyuang/ssr/compare/v6.1.55...v6.1.56) (2022-01-28)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.55](https://github.com/zhangyuang/ssr/compare/v6.1.54...v6.1.55) (2022-01-26)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.54](https://github.com/zhangyuang/ssr/compare/v6.1.53...v6.1.54) (2022-01-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.53](https://github.com/zhangyuang/ssr/compare/v6.1.52...v6.1.53) (2022-01-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.49](https://github.com/zhangyuang/ssr/compare/v6.1.48...v6.1.49) (2022-01-19)


### Features

* support nestjs mode pass argv ([4bfd92e](https://github.com/zhangyuang/ssr/commit/4bfd92ebd31f8e99aaa60e20e44a0e7684f42200))





## [6.1.48](https://github.com/zhangyuang/ssr/compare/v6.1.47...v6.1.48) (2022-01-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.47](https://github.com/zhangyuang/ssr/compare/v6.1.47-alpha.1...v6.1.47) (2022-01-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.47-alpha.1](https://github.com/zhangyuang/ssr/compare/v6.1.47-alpha.0...v6.1.47-alpha.1) (2022-01-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.47-alpha.0](https://github.com/zhangyuang/ssr/compare/v6.1.46...v6.1.47-alpha.0) (2022-01-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.46](https://github.com/zhangyuang/ssr/compare/v6.1.45...v6.1.46) (2022-01-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.45](https://github.com/zhangyuang/ssr/compare/v6.1.44...v6.1.45) (2022-01-06)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.44](https://github.com/zhangyuang/ssr/compare/v6.1.42...v6.1.44) (2022-01-05)


### Bug Fixes

* manualChunks ([663295c](https://github.com/zhangyuang/ssr/commit/663295c17693550301ac5a71ee78f68d3d11ecfa))





## [6.1.43](https://github.com/zhangyuang/ssr/compare/v6.1.42...v6.1.43) (2022-01-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.42](https://github.com/zhangyuang/ssr/compare/v6.1.41...v6.1.42) (2022-01-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.41](https://github.com/zhangyuang/ssr/compare/v6.1.40...v6.1.41) (2022-01-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.40](https://github.com/zhangyuang/ssr/compare/v6.1.39...v6.1.40) (2022-01-04)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.39](https://github.com/zhangyuang/ssr/compare/v6.1.38...v6.1.39) (2021-12-31)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.38](https://github.com/zhangyuang/ssr/compare/v6.1.37...v6.1.38) (2021-12-31)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.37](https://github.com/zhangyuang/ssr/compare/v6.1.36...v6.1.37) (2021-12-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.36](https://github.com/zhangyuang/ssr/compare/v6.1.35...v6.1.36) (2021-12-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.35](https://github.com/zhangyuang/ssr/compare/v6.1.34...v6.1.35) (2021-12-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.34](https://github.com/zhangyuang/ssr/compare/v6.1.33...v6.1.34) (2021-12-29)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.29](https://github.com/zhangyuang/ssr/compare/v6.1.28...v6.1.29) (2021-12-17)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.28](https://github.com/zhangyuang/ssr/compare/v6.1.25...v6.1.28) (2021-12-16)


### Bug Fixes

* alias ([0417457](https://github.com/zhangyuang/ssr/commit/0417457959a8159f045b18d0cd801ef10f1c68c3))





## [6.1.27](https://github.com/zhangyuang/ssr/compare/v6.1.26...v6.1.27) (2021-12-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.26](https://github.com/zhangyuang/ssr/compare/v6.1.25...v6.1.26) (2021-12-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.25](https://github.com/zhangyuang/ssr/compare/v6.1.24...v6.1.25) (2021-12-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.24](https://github.com/zhangyuang/ssr/compare/v6.1.23...v6.1.24) (2021-12-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.23](https://github.com/zhangyuang/ssr/compare/v6.1.22...v6.1.23) (2021-12-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.22](https://github.com/zhangyuang/ssr/compare/v6.1.22-alpha.1...v6.1.22) (2021-12-11)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.22-alpha.1](https://github.com/zhangyuang/ssr/compare/v6.1.22-alpha.0...v6.1.22-alpha.1) (2021-12-11)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.22-alpha.0](https://github.com/zhangyuang/ssr/compare/v6.1.21...v6.1.22-alpha.0) (2021-12-10)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.21](https://github.com/zhangyuang/ssr/compare/v6.1.20...v6.1.21) (2021-12-09)


### Bug Fixes

* listen port ([4cb3aa2](https://github.com/zhangyuang/ssr/commit/4cb3aa214b2c385ea66846f250bed81c73c86ab9))





## [6.1.19](https://github.com/zhangyuang/ssr/compare/v6.1.18...v6.1.19) (2021-12-08)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.18](https://github.com/zhangyuang/ssr/compare/v6.1.17...v6.1.18) (2021-12-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.17](https://github.com/zhangyuang/ssr/compare/v6.1.15...v6.1.17) (2021-12-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.15](https://github.com/zhangyuang/ssr/compare/v6.1.14...v6.1.15) (2021-12-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.14](https://github.com/zhangyuang/ssr/compare/v6.1.14-alpha.0...v6.1.14) (2021-12-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [6.1.14-alpha.0](https://github.com/zhangyuang/ssr/compare/v5.7.3...v6.1.14-alpha.0) (2021-12-04)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.12](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.11...ssr-plugin-nestjs@5.7.12) (2021-12-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.11](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.10...ssr-plugin-nestjs@5.7.11) (2021-12-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.10](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.9...ssr-plugin-nestjs@5.7.10) (2021-12-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.9](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.8...ssr-plugin-nestjs@5.7.9) (2021-12-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.8](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.7...ssr-plugin-nestjs@5.7.8) (2021-11-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.7](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.6...ssr-plugin-nestjs@5.7.7) (2021-11-22)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.6](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.5...ssr-plugin-nestjs@5.7.6) (2021-11-19)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.5](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.4...ssr-plugin-nestjs@5.7.5) (2021-11-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.4](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.3...ssr-plugin-nestjs@5.7.4) (2021-11-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.7.3](https://github.com/zhangyuang/ssr/compare/ssr-plugin-nestjs@5.7.2...ssr-plugin-nestjs@5.7.3) (2021-11-07)

**Note:** Version bump only for package ssr-plugin-nestjs





## 5.7.2 (2021-11-05)



## 5.7.1 (2021-11-01)



# 5.7.0 (2021-10-29)



## 5.6.33 (2021-10-22)



## 5.6.28 (2021-10-19)



## 5.6.27 (2021-10-14)



## 5.6.26 (2021-09-29)



## 5.6.25 (2021-09-24)



## 5.6.24 (2021-09-23)



## 5.6.23 (2021-09-23)



## 5.6.17 (2021-09-03)



## 5.6.15 (2021-08-27)



## 5.6.14 (2021-08-25)



## 5.6.13 (2021-08-25)



## 5.6.12 (2021-08-25)



## 5.6.10 (2021-08-24)



## 5.6.10-alpha.0 (2021-08-24)



## 5.6.9 (2021-08-24)



## 5.6.8 (2021-08-24)



## 5.6.7 (2021-08-24)



## 5.6.6 (2021-08-23)


### Bug Fixes

* lint ([1a647a7](https://github.com/zhangyuang/ssr/commit/1a647a73756fdb69c6cde0188e62ed782317e524))



## 5.6.4 (2021-08-13)



## 5.6.3 (2021-08-12)


### Bug Fixes

* 类型修复 nestjs 新增自定义提示 ([d17bf51](https://github.com/zhangyuang/ssr/commit/d17bf51e6a313a2f57abd87fde7ec014cf724da1))



## 5.6.2 (2021-08-11)



## 5.5.99 (2021-08-09)


### Bug Fixes

* stdout color force in child_process ([b6e5666](https://github.com/zhangyuang/ssr/commit/b6e5666aaa8aa45923b5f9f9bbc1cabef94fc244))



## 5.5.98 (2021-08-06)



## 5.5.97 (2021-08-06)



## 5.5.96 (2021-08-05)


### Bug Fixes

* ssr types ([742440f](https://github.com/zhangyuang/ssr/commit/742440f186af3577d0df0bf5fac25d665e43dbcd))



## 5.5.94 (2021-08-05)



## 5.5.92 (2021-08-03)



## 5.5.91 (2021-08-02)



## 5.5.90 (2021-08-02)



## 5.5.89 (2021-07-31)



## 5.5.88 (2021-07-30)



## 5.5.87 (2021-07-30)



## 5.5.84 (2021-07-26)



## 5.5.83 (2021-07-26)



## 5.5.80 (2021-07-25)



## 5.5.79 (2021-07-24)



## 5.5.77 (2021-07-22)



## 5.5.76 (2021-07-21)



## 5.5.75 (2021-07-19)


### Bug Fixes

* @types/node use peerdependencies ([93d3cbd](https://github.com/zhangyuang/ssr/commit/93d3cbd6fe0851062c09965b9572dedb0f1ce0a5))



## 5.5.74 (2021-07-16)



## 5.5.73 (2021-07-16)



## 5.5.72 (2021-07-15)



## 5.5.71 (2021-07-12)



## 5.5.70 (2021-07-05)



## 5.5.69 (2021-07-05)



## 5.5.68 (2021-07-05)



## 5.5.65 (2021-07-01)



## 5.5.63 (2021-06-25)



## 5.5.61 (2021-06-23)



## 5.5.60 (2021-06-23)



## 5.5.59 (2021-06-23)



## 5.5.58 (2021-06-23)



## 5.5.57 (2021-06-23)



## 5.5.55 (2021-06-22)



## 5.5.54 (2021-06-19)



## 5.5.53 (2021-06-18)



## 5.5.52 (2021-06-17)



## 5.5.51 (2021-06-17)



## 5.5.50 (2021-06-10)



## 5.5.49 (2021-06-10)



## 5.5.48 (2021-06-10)



## 5.5.46 (2021-06-02)



## 5.5.45 (2021-06-02)



## 5.5.44 (2021-06-02)



## 5.5.43 (2021-06-02)



## 5.5.41 (2021-05-27)



## 5.5.37 (2021-05-27)



## 5.5.34 (2021-05-21)



## 5.5.33 (2021-05-20)



## 5.5.32 (2021-05-20)



## 5.5.31 (2021-05-20)



## 5.5.30 (2021-05-20)



## 5.5.28 (2021-05-13)



## 5.5.26 (2021-05-12)



## 5.5.25 (2021-05-12)



## 5.5.24 (2021-05-11)


### Features

* nestjs support serverless deploy ([76787b1](https://github.com/zhangyuang/ssr/commit/76787b16640e255e13d158be6248505d156e9bc6))



## 5.5.23 (2021-05-10)


### Features

* add ssrVueLoaderOptions csrVueloaderOptions ssr-hoc-vue3 ([09c4dc5](https://github.com/zhangyuang/ssr/commit/09c4dc5a820e4c57ece73427a78968b75abea2f3))



## 5.5.22 (2021-05-06)



## 5.5.21 (2021-05-06)



## 5.5.20 (2021-05-04)



## 5.5.18 (2021-04-27)



## 5.5.16 (2021-04-21)



## 5.5.15 (2021-04-19)



## 5.5.14 (2021-04-17)



## 5.5.13 (2021-04-15)



## 5.5.11 (2021-04-14)



## 5.5.6 (2021-04-09)



## 5.5.5 (2021-04-07)



## 5.5.4 (2021-04-06)



## 5.5.2 (2021-04-05)



## 5.5.1 (2021-04-05)



# 5.5.0 (2021-04-05)



## 5.4.26 (2021-04-01)



## 5.4.25 (2021-03-29)



## 5.4.24 (2021-03-26)



## 5.4.22 (2021-03-22)



## 5.4.20 (2021-03-20)



## 5.4.16 (2021-03-20)



## 5.4.15 (2021-03-20)



## 5.4.14 (2021-03-19)



## 5.4.13 (2021-03-19)



## 5.4.12 (2021-03-19)



## 5.4.10 (2021-03-15)



## 5.4.9 (2021-03-14)



## 5.4.8 (2021-03-13)



## 5.4.7 (2021-03-13)



## 5.4.6 (2021-03-12)



## 5.4.4 (2021-03-10)



## 5.4.1 (2021-03-08)



# 5.4.0 (2021-03-08)



## 5.3.7 (2021-03-04)



## 5.3.4 (2021-03-03)



## 5.3.3 (2021-03-03)



## 5.3.2 (2021-03-01)



## 5.3.1 (2021-02-28)



## 5.2.3 (2021-02-24)



## 5.2.2 (2021-02-24)



## 5.2.1 (2021-02-24)


### Bug Fixes

* plugin-nestjs ([2db8da0](https://github.com/zhangyuang/ssr/commit/2db8da0aa16c1909e4dfa4244e544c67070837db))





## [5.7.1](https://github.com/zhangyuang/ssr/compare/v5.7.0...v5.7.1) (2021-11-01)

**Note:** Version bump only for package ssr-plugin-nestjs





# [5.7.0](https://github.com/zhangyuang/ssr/compare/v5.6.33...v5.7.0) (2021-10-29)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.33](https://github.com/zhangyuang/ssr/compare/v5.6.31...v5.6.33) (2021-10-22)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.32](https://github.com/zhangyuang/ssr/compare/v5.6.31...v5.6.32) (2021-10-22)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.27](https://github.com/zhangyuang/ssr/compare/v5.6.26...v5.6.27) (2021-10-14)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.26](https://github.com/zhangyuang/ssr/compare/v5.6.25...v5.6.26) (2021-09-29)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.25](https://github.com/zhangyuang/ssr/compare/v5.6.24...v5.6.25) (2021-09-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.24](https://github.com/zhangyuang/ssr/compare/v5.6.23...v5.6.24) (2021-09-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.23](https://github.com/zhangyuang/ssr/compare/v5.6.22...v5.6.23) (2021-09-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.17](https://github.com/zhangyuang/ssr/compare/v5.6.16...v5.6.17) (2021-09-03)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.15](https://github.com/zhangyuang/ssr/compare/v5.6.14...v5.6.15) (2021-08-27)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.14](https://github.com/zhangyuang/ssr/compare/v5.6.13...v5.6.14) (2021-08-25)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.13](https://github.com/zhangyuang/ssr/compare/v5.6.12...v5.6.13) (2021-08-25)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.12](https://github.com/zhangyuang/ssr/compare/v5.6.11...v5.6.12) (2021-08-25)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.10](https://github.com/zhangyuang/ssr/compare/v5.6.10-alpha.0...v5.6.10) (2021-08-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.9](https://github.com/zhangyuang/ssr/compare/v5.6.8...v5.6.9) (2021-08-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.8](https://github.com/zhangyuang/ssr/compare/v5.6.7...v5.6.8) (2021-08-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.7](https://github.com/zhangyuang/ssr/compare/v5.6.6...v5.6.7) (2021-08-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.6](https://github.com/zhangyuang/ssr/compare/v5.6.5...v5.6.6) (2021-08-23)


### Bug Fixes

* lint ([1a647a7](https://github.com/zhangyuang/ssr/commit/1a647a73756fdb69c6cde0188e62ed782317e524))





## [5.6.4](https://github.com/zhangyuang/ssr/compare/v5.6.3...v5.6.4) (2021-08-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.6.3](https://github.com/zhangyuang/ssr/compare/v5.6.2...v5.6.3) (2021-08-12)


### Bug Fixes

* 类型修复 nestjs 新增自定义提示 ([d17bf51](https://github.com/zhangyuang/ssr/commit/d17bf51e6a313a2f57abd87fde7ec014cf724da1))





## [5.6.2](https://github.com/zhangyuang/ssr/compare/v5.6.1...v5.6.2) (2021-08-11)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.99](https://github.com/zhangyuang/ssr/compare/v5.5.98...v5.5.99) (2021-08-09)


### Bug Fixes

* stdout color force in child_process ([b6e5666](https://github.com/zhangyuang/ssr/commit/b6e5666aaa8aa45923b5f9f9bbc1cabef94fc244))





## [5.5.98](https://github.com/zhangyuang/ssr/compare/v5.5.97...v5.5.98) (2021-08-06)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.97](https://github.com/zhangyuang/ssr/compare/v5.5.96...v5.5.97) (2021-08-06)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.96](https://github.com/zhangyuang/ssr/compare/v5.5.94...v5.5.96) (2021-08-05)


### Bug Fixes

* ssr types ([742440f](https://github.com/zhangyuang/ssr/commit/742440f186af3577d0df0bf5fac25d665e43dbcd))





## [5.5.95](https://github.com/zhangyuang/ssr/compare/v5.5.94...v5.5.95) (2021-08-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.94](https://github.com/zhangyuang/ssr/compare/v5.5.93...v5.5.94) (2021-08-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.92](https://github.com/zhangyuang/ssr/compare/v5.5.91...v5.5.92) (2021-08-03)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.91](https://github.com/zhangyuang/ssr/compare/v5.5.90...v5.5.91) (2021-08-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.90](https://github.com/zhangyuang/ssr/compare/v5.5.89...v5.5.90) (2021-08-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.89](https://github.com/zhangyuang/ssr/compare/v5.5.88...v5.5.89) (2021-07-31)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.88](https://github.com/zhangyuang/ssr/compare/v5.5.87...v5.5.88) (2021-07-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.87](https://github.com/zhangyuang/ssr/compare/v5.5.86...v5.5.87) (2021-07-30)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.84](https://github.com/zhangyuang/ssr/compare/v5.5.83...v5.5.84) (2021-07-26)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.83](https://github.com/zhangyuang/ssr/compare/v5.5.82...v5.5.83) (2021-07-26)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.80](https://github.com/zhangyuang/ssr/compare/v5.5.79...v5.5.80) (2021-07-25)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.79](https://github.com/zhangyuang/ssr/compare/v5.5.78...v5.5.79) (2021-07-24)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.77](https://github.com/zhangyuang/ssr/compare/v5.5.76...v5.5.77) (2021-07-22)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.76](https://github.com/zhangyuang/ssr/compare/v5.5.75...v5.5.76) (2021-07-21)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.75](https://github.com/zhangyuang/ssr/compare/v5.5.74...v5.5.75) (2021-07-19)


### Bug Fixes

* @types/node use peerdependencies ([93d3cbd](https://github.com/zhangyuang/ssr/commit/93d3cbd6fe0851062c09965b9572dedb0f1ce0a5))





## [5.5.74](https://github.com/zhangyuang/ssr/compare/v5.5.73...v5.5.74) (2021-07-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.73](https://github.com/zhangyuang/ssr/compare/v5.5.73-alpha.3...v5.5.73) (2021-07-16)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.72](https://github.com/zhangyuang/ssr/compare/v5.5.71...v5.5.72) (2021-07-15)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.71](https://github.com/zhangyuang/ssr/compare/v5.5.70...v5.5.71) (2021-07-12)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.70](https://github.com/zhangyuang/ssr/compare/v5.5.69...v5.5.70) (2021-07-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.69](https://github.com/zhangyuang/ssr/compare/v5.5.68...v5.5.69) (2021-07-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.68](https://github.com/zhangyuang/ssr/compare/v5.5.67...v5.5.68) (2021-07-05)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.65](https://github.com/zhangyuang/ssr/compare/v5.5.64...v5.5.65) (2021-07-01)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.63](https://github.com/zhangyuang/ssr/compare/v5.5.62...v5.5.63) (2021-06-25)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.61](https://github.com/zhangyuang/ssr/compare/v5.5.60...v5.5.61) (2021-06-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.60](https://github.com/zhangyuang/ssr/compare/v5.5.59...v5.5.60) (2021-06-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.59](https://github.com/zhangyuang/ssr/compare/v5.5.58...v5.5.59) (2021-06-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.58](https://github.com/zhangyuang/ssr/compare/v5.5.57...v5.5.58) (2021-06-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.57](https://github.com/zhangyuang/ssr/compare/v5.5.56...v5.5.57) (2021-06-23)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.55](https://github.com/zhangyuang/ssr/compare/v5.5.54...v5.5.55) (2021-06-22)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.54](https://github.com/zhangyuang/ssr/compare/v5.5.53...v5.5.54) (2021-06-19)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.53](https://github.com/zhangyuang/ssr/compare/v5.5.52...v5.5.53) (2021-06-18)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.52](https://github.com/zhangyuang/ssr/compare/v5.5.51...v5.5.52) (2021-06-17)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.51](https://github.com/zhangyuang/ssr/compare/v5.5.50...v5.5.51) (2021-06-17)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.50](https://github.com/zhangyuang/ssr/compare/v5.5.49...v5.5.50) (2021-06-10)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.49](https://github.com/zhangyuang/ssr/compare/v5.5.48...v5.5.49) (2021-06-10)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.48](https://github.com/zhangyuang/ssr/compare/v5.5.47...v5.5.48) (2021-06-10)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.46](https://github.com/zhangyuang/ssr/compare/v5.5.45...v5.5.46) (2021-06-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.45](https://github.com/zhangyuang/ssr/compare/v5.5.44...v5.5.45) (2021-06-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.44](https://github.com/zhangyuang/ssr/compare/v5.5.43...v5.5.44) (2021-06-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.43](https://github.com/zhangyuang/ssr/compare/v5.5.42...v5.5.43) (2021-06-02)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.41](https://github.com/zhangyuang/ssr/compare/v5.5.40...v5.5.41) (2021-05-27)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.37](https://github.com/zhangyuang/ssr/compare/v5.5.36...v5.5.37) (2021-05-27)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.34](https://github.com/zhangyuang/ssr/compare/v5.5.33...v5.5.34) (2021-05-21)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.33](https://github.com/zhangyuang/ssr/compare/v5.5.32...v5.5.33) (2021-05-20)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.32](https://github.com/zhangyuang/ssr/compare/v5.5.31...v5.5.32) (2021-05-20)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.31](https://github.com/zhangyuang/ssr/compare/v5.5.30...v5.5.31) (2021-05-20)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.30](https://github.com/zhangyuang/ssr/compare/v5.5.29...v5.5.30) (2021-05-20)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.28](https://github.com/zhangyuang/ssr/compare/v5.5.27...v5.5.28) (2021-05-13)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.26](https://github.com/zhangyuang/ssr/compare/v5.5.25...v5.5.26) (2021-05-12)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.25](https://github.com/zhangyuang/ssr/compare/v5.5.24...v5.5.25) (2021-05-12)

**Note:** Version bump only for package ssr-plugin-nestjs





## [5.5.24](https://github.com/zhangyuang/ssr/compare/v5.5.23...v5.5.24) (2021-05-11)


### Features

* nestjs support serverless deploy ([76787b1](https://github.com/zhangyuang/ssr/commit/76787b16640e255e13d158be6248505d156e9bc6))





## [5.5.23](https://github.com/zhangyuang/ssr/compare/v5.5.22...v5.5.23) (2021-05-10)


### Features

* add ssrVueLoaderOptions csrVueloaderOptions ssr-hoc-vue3 ([09c4dc5](https://github.com/zhangyuang/ssr/commit/09c4dc5a820e4c57ece73427a78968b75abea2f3))





## [5.5.23](https://github.com/zhangyuang/ssr/compare/v5.5.22...v5.5.23) (2021-05-10)

**Note:** Version bump only for package ssr-plugin-nestjs
