<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
  <!-- 页面初始化数据注入内容已经过 serialize-javascript 转义 防止 xss -->
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <meta name="description" content="server side render, 最小而美的服务端渲染应用骨架, Vue SSR, React SSR, 服务端渲染">
      <link rel="icon" href="https://gw.alicdn.com/tfs/TB1ckATCGL7gK0jSZFBXXXZZpXa-540-540.jpg">
      <meta name="keywords" itemprop="keywords" content="server side render, 服务端渲染, React, Egg, Midway, Nestjs, Vue, VueSSR, SSR, ReactSSR">
      <meta property="og:title" content="server side render, Vue, React, SSR 服务端渲染">
      <meta property="og:description" content="server side render, Vue, React, SSR 服务端渲染">
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
      <slot name="customeFooterScript" />
      <slot name="jsInject" />
    </body>
  </html>
</template>

<style lang="less">
@import './index.less';
@import './drake.less';
</style>
