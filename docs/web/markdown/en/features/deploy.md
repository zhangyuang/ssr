# Application Deployment

This chapter will introduce how to deploy in the form of traditional `Node.js Server` and `Serverless` under the `ssr` framework scenario.

## Serverless for Frontend

> Serverless liberates the productivity of frontend developers (not just Web developers), allowing frontend developers to develop various frontend applications faster, better, and more flexibly, without investing too much energy in focusing on backend service implementation."

Traditional Application Development Process

![](https://img.alicdn.com/tfs/TB1CE7FB5_1gK0jSZFqXXcpaXXa-1402-150.png)

Serverless Application Development Process

![](https://img.alicdn.com/tfs/TB1hZgHB7T2gK0jSZPcXXcKkpXa-1136-174.png)

Serverless SSR Application Development Process Using This Framework

![](https://img.alicdn.com/tfs/TB1wzqpCkP2gK0jSZPxXXacQpXa-1880-256.jpg)

Compared to traditional server-side application development, we smooth out the details uniformly at the underlying layer. Frontend developers only need to focus on business logic without needing to perceive the server's operational status. Costs and mental burden are greatly reduced - you only need to apply for a domain name to publish the application to the public network for all users to access. For more deployment details, please read the [Application Deployment](./features$deploy) chapter.

## Midway Serverless Deployment

If you choose `Midway.js` as the server-side framework, your application will have one-stop publishing capabilities. Here we encapsulate the publishing capabilities of [Midway.js@2.0](https://www.yuque.com/midwayjs/midway_v2/introduction) at the underlying layer of the `deploy` method.

When developers execute the `npm run deploy` command, build commands and publish commands will be automatically executed. Similarly, when publishing code, we only install production environment dependencies to ensure minimum code package size. Users can notice that in production environments we only install `ssr-core-xxx` modules, while our plugin dependencies are only installed during local development. They are not needed when publishing to production environments.

### Using on Alibaba Cloud

We deploy to Alibaba Cloud by default, and also support deployment to Tencent Cloud. Due to `Midway`'s official focus, we more recommend deploying to Alibaba Cloud to enjoy more stable services.

```shell
$ npm run deploy # Supports publishing to multiple platforms, deploys to Alibaba Cloud by default, equivalent to ssr deploy
```

First-time publishing requires inputting Alibaba Cloud account information and enabling Function Compute service in the Alibaba Cloud console. Account information can be viewed in the Function Compute [console](https://fc.console.aliyun.com/fc).

![](https://img.alicdn.com/tfs/TB1fZzQB.z1gK0jSZLeXXb9kVXa-1446-1262.jpg)

Enter the AccountId and Key Secret below. You only need to input the information once - it will be stored in the local `~/.fcli/config.yaml` file. Similarly, our publishing timeout limits can also be configured in this file. No need to do this operation again for subsequent `deploy`s.

![](https://img.alicdn.com/tfs/TB10vYVBYY1gK0jSZTEXXXDQVXa-2044-528.jpg)

#### Alibaba Cloud Domain Configuration

After successful publishing, you get a temporary http address `http://xxxx.test.functioncompute.com`. This can be used temporarily to preview the service.

After that, we need to configure our own domain to forward to this service through `CNAME` form. Then set the function corresponding to the domain in the Alibaba Cloud Function Compute console to access this function through the domain on the public network. `Alibaba Cloud Console Domain Service` -> `Domain Resolution Settings` -> `Function Compute Console` -> `Custom Domain`. After that, opening the [domain](http://ssr-fc.com) will be able to access the published function.

![](https://res.wx.qq.com/op_res/GDCAu3r8xuYV5Bgvw8zZO5rzihDpXqBL-SpfARK_fo4iB3tzatF1vHJak0QCiNcRZpeggLEDlnhgzywCx2FxMQ)

![](https://gw.alicdn.com/tfs/TB1g_CwB7P2gK0jSZPxXXacQpXa-1254-698.jpg)

![](https://gw.alicdn.com/tfs/TB1JZGyB1H2gK0jSZFEXXcqMpXa-1468-1012.jpg)

### Using on Tencent Cloud

Refer to the [midway3.0](https://www.midwayjs.org/docs/serverless/serverless_yml) documentation to modify the `provider`

Publish command:

```shell
$ npm run deploy
```

First-time publishing requires using WeChat to scan the QR code displayed in the terminal to register/login to Tencent Cloud services. If you want to understand Tencent Cloud publishing functionality in detail, you can refer to the [documentation](https://www.yuque.com/midwayjs/faas/deploy_tencent_faq).

After publishing, we can also get an address returned by the platform. You need to bind a domain name to correctly access the page rendering service. Otherwise, the default publishing environment of Tencent Cloud will add `/test` `/pre` paths at the end to represent the current function environment. But these `paths` may cause server-side routes and client-side routes to be inconsistent, which will cause page content to flash and then go white screen. For example, when we need to deploy on the `/test` path, we need to additionally configure in the `config.js` file:

```js
module.exports = {
  publicPath: "/test",
  prefix: "/test",
};
```

![](https://res.wx.qq.com/op_res/mbNMsqF_px3tS0x_x1fryyR3Z5RipX3Lo8PIzvcAVxyXwoQyvQz0lQev-W2io3AP)

It deploys to the test environment by default. It's recommended to explicitly specify the [serviceID](https://www.yuque.com/midwayjs/faas/deploy_tencent_faq) to be published in the `yml` after the first publication, otherwise each publication will create a new server instance.

Perform domain binding and function publishing to production environment operations on Tencent Cloud [API](https://console.cloud.tencent.com/apigateway/service-detail) Gateway platform.

Function management, debugging, and log viewing can be performed on the Tencent Cloud [SCF](https://console.cloud.tencent.com/scf) platform.
How to reuse serviceId is as follows:

```yml
service:
  name: serverless-ssr-spa
provider:
  name: aliyun # No need to modify name, specify Tencent Cloud through ssr deploy --tencent
  region: ap-hongkong # Deploy in Hong Kong region, no need for domain filing, convenient for testing
  serviceId: service-xxx
```

#### Tencent Cloud Domain Configuration

When publishing to Tencent Cloud, midway-faas supports setting the published server region through [provider.region](https://www.yuque.com/midwayjs/faas/serverless_yml).

If the published region is domestic, the bound domain needs to be filed with Tencent Cloud. If it's Hong Kong, no filing is required. Developers can choose Hong Kong `region` to quickly test whether the application is successfully published.

After binding the domain by default, you need to access the specific environment through [tx.ssr-fc.com/release](http://tx.ssr-fc.com).

You can also use custom path mapping so that you don't need to add `/release` to access the specific environment.

![](https://res.wx.qq.com/op_res/Ln1MuNWmmfNDyTuJlooXiGdhwtCtz_4rVDi_qvmuUEoL_mo6PNsd3z4d7z9RBj17)

If function access is too slow, you can try to optimize performance by adjusting function runtime memory through the platform.

## Nest.js Serverless Deployment

Unlike `Midway.js`, in `Nest.js` scenarios, when calling the `deploy` command, we directly use the underlying [fun](https://github.com/alibaba/funcraft) tool provided by Alibaba Cloud for deployment. In terms of readability of `template.yml`, there are some differences compared to `Midway.js`'s `f.yml` file. The domain configuration method after successful deployment is the same as `Midway.js`.

## Traditional Node.js Deployment

If you don't need to use Serverless capabilities for deployment and have your own deployment solution, this is common in internal company application deployments. We also provide scripts for deploying in traditional Node.js form.

### Two Deployment Methods

- CI build, server installs all dependencies + executes `npm run prod`. This mode will hardly have any problems, the only disadvantage is installing more dependencies.
- Local build, locally execute `ssr build` and commit the `build/dist` directory to the `git` repository. Server installs production environment dependencies `npm i --production`, then remove the `ssr build` part from the `script prod` script, then execute `npm run prod`.

### Midway Application Deployment

In `Midway.js` type applications, we provide the `npm run prod` command. This command will directly call [egg-script](https://eggjs.org/zh-cn/core/deployment.html) for production environment multi-process mode deployment.

### Nest.js Application Deployment

In `Nest.js` type applications, we provide the `npm run prod` command. This command will directly call [pm2](https://pm2.keymetrics.io/) for production environment multi-process mode deployment. When using `pm2` for deployment, note that `NODE_ENV` needs to be set to `production`.

## Differences from Traditional SPA Application Deployment (Important!!!)

Don't use traditional `SPA` application deployment thinking to deploy `ssr` applications or `Node.js` applications

Don't use traditional `SPA` application deployment thinking to deploy `ssr` applications or `Node.js` applications

Don't use traditional `SPA` application deployment thinking to deploy `ssr` applications or `Node.js` applications

Important things need to be said three times!!! Compared to the mode of deploying by dropping an `html` file, `Node.js` application deployment is slightly more complex.

If you're a newbie who doesn't understand anything, then when deploying, either use `ssr deploy` to deploy to Alibaba Cloud or Tencent Cloud.

If you must deploy on self-built servers, and if you don't understand anything, then just put the entire locally successful project `repo` on the server and execute the `npm run prod` command. Must ensure the following folders exist:

- `node_modules` You can do `npm i` on the server or do `npm i` locally and then upload it
- `build` Frontend static resource folder, you can build locally and upload it. You can also execute `ssr build` on the server, but this step must be executed after `npm i`
- `dist` Server-side `Node.js` deployment files. You can build locally and upload them. You can also execute `ssr build` on the server, but this step must be executed after `npm i`
- `config.js` Application configuration file, must exist
