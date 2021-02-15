<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
  <!-- 注入内容已经过 serialize-javascript 转义 防止 xss -->
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Serverless Side Render for Vue</title>
      <slot name="remInitial" />
      <slot name="cssInject" />
    </head>
    <body>
      <slot name="children" />
      <slot name="initialData" />
      <slot name="jsInject" />
    </body>
  </html>
</template>

<style lang="less">
@import './index.less';
</style>
