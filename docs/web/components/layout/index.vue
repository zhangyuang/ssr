<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
  <!-- 页面初始化数据注入内容已经过 serialize-javascript 转义 防止 xss -->
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <meta name="description" content="最小而美的服务端渲染应用骨架">
      <link rel="icon" href="https://avatars1.githubusercontent.com/u/50347314?s=200&amp;v=4">
      <meta name="keywords" itemprop="keywords" content="服务端渲染, React, Egg, Midway, Nestjs, Vue, VueSSR, SSR, ReactSSR">
      <meta property="og:title" content="Vue, React, SSR 服务端渲染">
      <meta property="og:description" content="Vue, React, SSR 服务端渲染">
      <title>ssr 框架官方文档</title>
      <slot name="viteClient" />
      <!-- 用于通过配置插入自定义的 script 为了避免影响期望功能这块内容不做 escape，为了避免 xss 需要保证插入脚本代码的安全性  -->
      <slot name="customeHeadScript" />
      <slot name="cssInject" />
    </head>
    <body class="lei-md">
      <div id="app">
        <slot name="children" />
      </div>
      <slot name="initialData" />
      <slot name="jsInject" />
    </body>
  </html>
</template>

<style lang="less">
@import './index.less';
@import './drake.less';
</style>
