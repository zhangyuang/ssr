<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑，不要删除 rem 初始化以外的任何初始设置 -->
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Serverless Side Render for Vue3</title>
      <!-- 初始化移动端 rem 设置，如不需要可自行删除 -->
      <slot name="remInitial" />
      <slot name="injectHeader" />
    </head>
    <body>
      <slot name="content" />
    </body>
  </html>
</template>