---
home: true
actionText: 快速上手 →
actionLink: /guide/
features:
- title: 小
  details: 生产环境构建出来的bundle为同等复杂度的next.js项目的0.4倍，文件数量相比于next.js减少非常多
- title: 全
  details: 支持HMR，同时支持本地开发以及生产环境CSR/SSR两种渲染模式无缝切换，支持定制特定组件的渲染模式
- title: 美
  details: 配置非黑盒，且一切关键位置皆可通过config.default.js来配置
footer: MIT Licensed | Copyright © 2019-present YKFE 版权所有
---


<center style="fontSize: 14px; ">推荐使用<a href="https://umijs.org/zh/">UmiJS(最新版已经支持SSR以及PreRender)，实现方式与本骨架一致，两者不冲突，互相补位</a></center>

## Getting started

```bash
$ npm install yk-cli -g
$ ykcli init <Your Project Name>
$ cd <Your Project Name>
$ npm i
$ npm start
$ open http://localhost:7001
```

## 用法

- render是react的视图渲染方法
- getInitialProps是获取数据方法，将返回值赋值给组件状态
    - csr通过高阶组件实现
    - ssr通过node执行

```js
function Page(props) {
  return <div> {props.name} </div>
}

Page.getInitialProps = async (ctx) => {
  return Promise.resolve({
    name: 'Egg + React + SSR'
  })
}

export default Page
```

## 社区交流

| Pull Request                                                | Github Issue                                            | 钉钉群                                                                                                       |
| ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| [egg-react-ssr/pulls](https://github.com/ykfe/egg-react-ssr/pulls) | [egg-react-ssr/issues](https://github.com/ykfe/egg-react-ssr/issues) | <img src="https://img.alicdn.com/tfs/TB15zfha79E3KVjSZFGXXc19XXa-750-990.jpg" width="60" /> |



