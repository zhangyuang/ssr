# Quick Start

This chapter will introduce how to quickly create a project based on the `ssr` framework locally. Due to our plugin-based architecture, we can support any combination of frontend frameworks and server-side frameworks. Currently, the official provides default integration examples of frontend frameworks `React`, `Vue2`, `Vue3` with server-side frameworks [Midway.js](https://midwayjs.org/) and [Nest.js](https://nestjs.com/) for quick creation.

If you want to use other server-side frameworks such as [daruk.js](https://github.com/darukjs/daruk), you can refer to the default server-side framework plugin [examples](./features$plugin) to quickly write a server-side plugin. This is a very simple task because our server-side plugins have no additional logic.

## create-ssr-app

We provide the [create-ssr-app](https://github.com/zhangyuang/create-ssr-app) scaffolding tool to let users quickly create different types of applications.

Currently, the official provides the following types of templates for developers to use directly. Users can choose different templates for development based on their actual technology stack.

Although the technology stacks are different, the development philosophy is consistent. In any technology stack combination, our development commands, build commands, and rendering principles are completely consistent.

Note: In `Midway.js` and `Nest.js` scenarios, we have implemented one-click deployment to `Serverless` platforms. However, the underlying implementations are slightly different. For more detailed introduction, please read the [Deployment](./features$deploy) chapter. If you need to use a lot of `Serverless` platform capabilities, we recommend creating `Midway.js` type applications.

- [nestjs-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react-ssr)
- [nestjs-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-react18-ssr)
- [nestjs-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue-ssr)
- [nestjs-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/nestjs-vue3-ssr)
- [nestjs-vue3-ssr-pinia](https://github.com/zhangyuang/nestjs-vue3-ssr-pinia)
- [midway-react-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react-ssr)
- [midway-react18-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-react18-ssr)
- [midway-vue-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue-ssr)
- [midway-vue3-ssr](https://github.com/zhangyuang/ssr/tree/dev/example/midway-vue3-ssr)

Developers can create different types of applications according to their actual technology stack needs to get started quickly.

### Creating Projects via Command Line

Through the `npm init` command, we can create any of the above templates

```shell
$ npm init ssr-app my-ssr-project
$ cd my-ssr-project
$ npm install # You can use yarn, don't use cnpm
$ npm start
$ open http://localhost:3000 # Access the application
$ npm run build # Resource building, equivalent to npx ssr build
$ npm run start:vite # Start in vite mode, equivalent to npx ssr start --tools vite
```

![](http://doc.ssr-fc.com/images/resume3.svg)

### Quickly Write a Server-Side Rendering Service

Through the `render` method provided by the `core` module, we can quickly provide a page rendering service. This is very simple and can run in all `Node.js` frameworks. For specific rendering principles, see the [Local Development](./features$develop) chapter.

```js
import {
    render
} from 'ssr-core-xxx'

@Provide()
@Controller('/')
export class Index {
    @Inject()
    ctx: Context

    @Get('/') // http://localhost:3000
    @Get('/page') // http://localhost:3000/page, need to create web/page/user/render.vue|tsx file. Midway framework supports multiple decorators, NestJS can use middleware to attach the same logic to multiple paths
    async handler(): Promise < void > {
        try {
            // Just pass ctx as parameter
            // If there's no native ctx, you can manually construct ctx through request, response
            const stream = await render < Readable > (this.ctx, {
                stream: true
            })
            this.ctx.body = stream
        } catch (error) {
            console.log(error)
            this.ctx.body = error
        }
    }
}
```

### Quickly Write an API Service

Developers can use `Node.js` as a `BFF` layer to call APIs in other languages or directly call databases to get data and return it.

```js
@Provide()
@Controller('/api')
export class Index {
    @Inject()
    ctx: Context

    @Get('/data') // http://localhost:3000/api/data
    async handler(): Promise < void > {
        try {
            const data = await axios.get('xxx') // HTTP request to other APIs
            const data = await this.service.rpc.call('xxx') // RPC request to other APIs
            this.ctx.body = data
        } catch (error) {
            console.log(error)
            this.ctx.body = error
        }
    }
}
```

## Application Deployment

We provide both traditional Node.js application deployment and Serverless deployment methods.

When you choose a template based on `Midway.js`, we additionally provide the `ssr deploy` command to quickly publish your application to Alibaba Cloud or Tencent Cloud. For detailed publishing process, please read the [Application Deployment](./features$deploy) chapter.

### Serverless Deployment

Quickly publish applications in Serverless form

```shell
$ npm run deploy # Application deployment, equivalent to npx ssr deploy
```

### Traditional Node.js Application Deployment

In `Midway.js` scenarios, we use [egg-scripts](https://eggjs.org/zh-cn/core/deployment.html) for deployment

In `Nest.js` scenarios, we use [pm2](https://pm2.keymetrics.io/) for deployment

```shell
$ npm run prod
```
