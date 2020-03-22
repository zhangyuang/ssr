# 基于TypeScript的实现

这一章主要讲述在TypeScript的环境下使用React SSR，以及使用TypeScript相较之前的JavaScript版本实现的一些差异和需要注意的点。详见[example](https://github.com/ykfe/egg-react-ssr/tree/dev/example/ssr-with-ts)

## 什么是TypeScript

![](../image/TypeScript.png)

TypeScript = Type + Script（标准JS）。我们从TS的官方网站上就能看到定义：TypeScript is a typed superset of JavaScript that compiles to plain JavaScript。TypeScript是一个编译到纯JS的有类型定义的JS超集。

## 为什么要使用TypeScript

TS适合大规模JavaScript应用，正如他的官方宣传语JavaScript that scales。从以下几点可以看到TS在团队协作、可维护性、易读性、稳定性（编译期提前暴露bug）等方面上有着明显的好处。

- 从开发效率上看，虽然需要多写一些类型定义代码，但TS在VSCode、WebStorm等IDE下可以做到智能提示，智能感知bug，同时我们项目常用的一些第三方类库框架都有TS类型声明，我们也可以给那些没有TS类型声明的稳定模块写声明文件，这在团队协作项目中可以提升整体的开发效率。

- 从可维护性上看，长期迭代维护的项目开发和维护的成员会有很多，团队成员水平会有差异，而软件具有`熵`的特质，长期迭代维护的项目总会遇到可维护性逐渐降低的问题，有了强类型约束和静态检查，以及智能IDE的帮助下，可以降低软件腐化的速度，提升可维护性，且在重构时，强类型和静态类型检查会帮上大忙，甚至有了类型定义，会不经意间增加重构的频率（更安全、放心）。

- 从线上运行时质量上看，我们现在的SPA项目的很多bug都是由于一些调用方和被调用方（如组件模块间的协作、接口或函数的调用）的数据格式不匹配引起的，由于TS有编译期的静态检查，让我们的bug尽可能消灭在编译器，加上IDE有智能纠错，编码时就能提前感知bug的存在，我们的线上运行时质量会更为稳定可控。

## 为什么要使用midway

这里我们使用了淘宝出品的[midway](https://midwayjs.org/midway/guide.html#%E5%88%9B%E5%BB%BA%E6%96%B0%E5%BA%94%E7%94%A8)框架来作为服务端的Node.js框架。Midway可以简单理解为TS版本的egg，也可以把它看做egg的未来传承者，它保持了egg原有的全部特性，同时拓展了面向对象的上的一些特性，它的详细特性如下：

- 基于 IoC 体系业务代码进行解耦，依赖统一管理统一初始化

- 常见的 web 场景装饰器简化业务开发

- 支持 Egg.js 的所有插件体系，框架装饰器统一编码风格

- 基于 TypeScript ，面向接口编程的编码体验

所以对于熟悉egg和TypeScript的人来说，使用midway的上手成本非常低。

## 基于midway的目录结构

由于midway框架的目录结构相比egg发生了一些变化，所以我们的目录结构也做了相应的调整。目录结构如下所示：

```
├── README.md
├── src
│   ├── app // midway核心目录
│   ├── controller
│   ├── extend
│   ├── app.ts // midway启动入口文件
│   ├── middleware
│   ├── config // midway配置文件目录
│   │   ├── config.default.ts
│   │   ├── config.local.ts
│   │   ├── config.prod.ts
│   │   ├── config.staging.ts
│   │   ├── plugin.ts
│   │   └── plugin.local.ts
│   └── router.ts // 原egg路由文件，用于在控制器上自动绑定前端路由，无特殊需求不需要修改内容
├── build // webpack配置目录
│   ├── paths.js
│   ├── util.js
│   ├── webpack.config.base.js // 通用的webpack配置
│   ├── webpack.config.client.js // webpack客户端打包配置
│   └── webpack.config.server.js // webpack服务端打包配置
├── config // 服务端渲染配置文件目录
│   └── config.ssr.js // 服务端渲染配置文件
├── dist // midway打包文件目录
├── output // build生成前端静态资源文件目录，因dist目录被midway占用，这里我们改为output
│   ├── Page.server.js // 服务端打包后文件(即打包后的serverRender方法)
│   └── static // 前端打包后静态资源目录
└── web // 前端文件目录
    ├── assets
    │   └── common.less
    ├── entry.tsx // webpack打包入口文件，分环境导出不同配置
    ├── layout
    │   ├── index.tsx // 页面布局
    │   └── index.less
    └── page
        ├── index
        └── news
```

## 同时支持传统路由绑定和midway路由装饰器

midway的一个重要特性是使用的路由装饰器机制来进行路由绑定，但本次示例依然保留了原egg的router.js的配置文件，使得我们可以在一个地方同时配置前后端路由，同时支持使用midway的路由装饰器对控制器进行路由绑定，开发者可根据项目实际情况进行选择。具体装饰器的用法可以参考[midway官方文档](https://midwayjs.org/midway/guide.html#%E8%B7%AF%E7%94%B1%E8%A3%85%E9%A5%B0%E5%99%A8)

## TypeScript 下的React组件模式

在TypeScript下编写react组件相较于js存在部分差异，具体如下：

### 有状态组件

```js
import React from 'react';

export interface DemoState {
  name: string;
}

class DemoComponent extends React.Component<{}, DemoState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      name: "",
    };
  }

  public setName = () => {
    this.setState({
      name: "ykfe",
    });
  }
  
  public render(){
    const { name } = this.state;
    return (
      <div>
         <button onClick={this.setName}> set name </button>
         <span>{name}</span>
      </div>
    )
  }
}
Props & State 组件

```
### 无状态组件

```js
import React from 'react';

export interface DemoProps {
  title: string;
}

export const Demo: React.SFC<DemoProps> = (props: DemoProps) => {
  const { title } = props;
  return (
    <div>
      <h1>{title}</h1>
    </div>
  );
};

```

如何写出高质量的基于TypeScript代码，具体可以参考下面的文章

- [TypeScript 2.8下的终极React组件模式](https://juejin.im/post/5b07caf16fb9a07aa83f2977)
- [复杂 React 应用中的TypeScript 3.0实践](https://zhuanlan.zhihu.com/p/42141179)

