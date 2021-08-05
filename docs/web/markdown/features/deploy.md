# 应用部署

本篇章将会介绍在 `ssr` 框架的场景下，如何以传统 `Node.js Server` 的方式以及 `Serverless` 的形式进行部署

## Midway Serverless 形式部署

如果你选择了 `Midway.js` 作为服务端框架，那么你的应用便具备了一站式的发布能力。这里我们在 `deploy` 方法的底层封装了 [Midway.js@2.0](https://www.yuque.com/midwayjs/midway_v2/introduction) 的发布能力。

当开发者执行 `npm run deloy` 命令时，会自动执行构建命令以及发布命令。同样在发布代码时，我们只会安装生产环境的依赖来保证代码包的体积最小。用户可以注意到在生产环境我们只会安装 `ssr-core-xxx` 模块，而我们的插件依赖只会在本地开发时进行安装。在生产环境发布时并不需要

### 在阿里云使用

我们默认发布到阿里云，同样也可以支持发布到腾讯云

```shell
$ npm run deploy # 支持发布多个平台默认发布到阿里云 等价于 ssr deploy
```

首次发布需要输入阿里云账户信息，并且在阿里云控制台开通函数计算服务。账户信息在函数计算[控制台](https://fc.console.aliyun.com/fc)查看。

![](https://img.alicdn.com/tfs/TB1fZzQB.z1gK0jSZLeXXb9kVXa-1446-1262.jpg)

将 AccountId 以及 Key Secret 在下面输入，只需要输入一次信息会储存在本地的 `~/.fcli/config.yaml` 文件当中同样我们发布的超时时间限制也可以在该文件进行配置，之后再次 `deploy` 无需做该操作。

![](https://img.alicdn.com/tfs/TB10vYVBYY1gK0jSZTEXXXDQVXa-2044-528.jpg)

#### 阿里云配置域名

发布成功后得到一个临时的 http 地址`http://xxxx.test.functioncompute.com`。可以暂时用来预览服务。

之后我们需要配置自己的域名通过 `CNAME` 的形式转发到该服务。接着在阿里云函数计算控制台设置域名对应的函数即可在公网通过域名来访问该函数。`阿里云控制台域名服务` -> `域名解析设置` -> `函数计算控制台` -> `自定义域名`。之后打开[域名](http://ssr-fc.com)便能够访问发布的函数。

![](https://res.wx.qq.com/op_res/GDCAu3r8xuYV5Bgvw8zZO5rzihDpXqBL-SpfARK_fo4iB3tzatF1vHJak0QCiNcRZpeggLEDlnhgzywCx2FxMQ)

![](https://gw.alicdn.com/tfs/TB1g_CwB7P2gK0jSZPxXXacQpXa-1254-698.jpg)

![](https://gw.alicdn.com/tfs/TB1JZGyB1H2gK0jSZFEXXcqMpXa-1468-1012.jpg)

### 在腾讯云使用

无需做任何配置文件的修改即可一键发布到腾讯云！

发布命令

```shell
$ npm run deploy:tencent # 发布到腾讯云 等价于 ssr deploy --tencent
```

首次发布时需要使用微信扫终端展示的二维码注册/登陆腾讯云服务。如果想详细的了解腾讯云发布功能可参考[文档](https://www.yuque.com/midwayjs/faas/deploy_tencent_faq)

发布后同样我们可以得到平台返回的一个地址, 需要绑定域名后才能正确的访问页面渲染服务。否则默认的发布环境腾讯云会在后面加上 `/test` `/pre` 的 `path` 来代表当前的函数环境。但这些 `path` 可能会造成服务端路由和客户端路由不一致会导致页面内容闪现后白屏。

![](https://res.wx.qq.com/op_res/mbNMsqF_px3tS0x_x1fryyR3Z5RipX3Lo8PIzvcAVxyXwoQyvQz0lQev-W2io3AP)

默认发布到测试环境, 这里建议在第一次发布后显示在 `yml` 中指定要发布的[serviceID](https://www.yuque.com/midwayjs/faas/deploy_tencent_faq), 否则每次发布将会创建一个新的 server 实例。

在腾讯云[API](https://console.cloud.tencent.com/apigateway/service-detail)网关平台进行域名的绑定以及函数发布到正式环境的操作

在腾讯云[SCF](https://console.cloud.tencent.com/scf)平台可以进行函数的管理调试以及日志查看
如何复用 serviceId 如下

```yml
service:
  name: serverless-ssr-spa
provider:
  name: aliyun # 无需修改 name 通过 ssr deploy --tencent 指定腾讯云即可
  region: ap-hongkong # 部署在香港 region，无需域名备案，方便测试
  serviceId: service-xxx
```
#### 腾讯云配置域名

在发布到腾讯云时 midway-faas 支持通过 [provider.region](https://www.yuque.com/midwayjs/faas/serverless_yml) 来设置发布的服务器区域。

如果发布的区域是国内则绑定的域名需要在腾讯云进行备案服务，如果是香港则无需备案。开发者可以选择香港的 `region` 来迅速测试应用是否发布成功

默认绑定域名后需要通过 [tx.ssr-fc.com/release](http://tx.ssr-fc.com) 来访问具体的环境。

也可以通过自定义路径映射使得不需要添加 `/release` 也可以访问到具体的环境。

![](https://res.wx.qq.com/op_res/Ln1MuNWmmfNDyTuJlooXiGdhwtCtz_4rVDi_qvmuUEoL_mo6PNsd3z4d7z9RBj17)

## Nest.js Serverless 形式部署

与 `Midway.js` 不同， `Nest.js` 场景下调用 `deploy` 命令我们会直接使用底层的阿里云提供的 [fun](https://github.com/alibaba/funcraft) 工具进行部署。在 `template.yml` 的可读性上比起 `Midway.js` 的 `f.yml` 文件有一定差异。部署成功后的域名配置方式与 `Midway.js` 一致

## 传统 Node.js 形式部署

如果你不需要使用 Serverless 的能力进行部署，有一套自己的部署方案。常见于公司内部应用部署。我们同样提供了以传统 Node.js 形式部署的脚本

### Midway 应用部署

在 `Midway.js` 类型的应用中，我们提供了 `npm run prod` 命令。该命令将会直接调用 [egg-script](https://eggjs.org/zh-cn/core/deployment.html) 进行生产环境多进程模式部署。

### Nest.js 应用部署

在 `Nest.js` 类型的应用中，我们提供了 `npm run prod` 命令。该命令将会直接调用 [pm2](https://pm2.keymetrics.io/) 进行生产环境多进程模式部署。使用 `pm2` 部署时需要注意 `NODE_ENV` 需要设置为 `production`


## 与传统 SPA 应用部署的区别 (重点！！！)

不要用传统 `SPA` 应用的部署思路来部署 `ssr` 应用或者说是 `Node.js` 应用

不要用传统 `SPA` 应用的部署思路来部署 `ssr` 应用或者说是 `Node.js` 应用

不要用传统 `SPA` 应用的部署思路来部署 `ssr` 应用或者说是 `Node.js` 应用

重要的事情说三遍！！！

如果你是小白什么都不懂，那么你部署的时候要么用 `ssr deploy` 来部署到阿里云或者腾讯云。

如果你一定要部署在自建服务上，如果你什么都不懂，那你就把本地运行成功的整个项目 `repo` 扔到服务器上去执行 `npm run prod` 命令。必须确保存在的文件夹是 

- `node_modules` 你可以在服务器上去 `npm i` 或者本地 `npm i` 之后扔上去
- `build` 前端静态资源文件夹，你可以本地构建完扔上去。也可以在服务器执行 `ssr build`，当然这一步必须要在 `npm i` 之后执行
- `dist` 服务端 `Node.js` 部署文件。你可以本地构建完扔上去。也可以在服务器执行 `ssr build`，当然这一步必须要在 `npm i` 之后执行