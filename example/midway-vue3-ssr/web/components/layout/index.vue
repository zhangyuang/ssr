<template>
  <!-- 注：Layout 只会在服务端被渲染，不要在此运行客户端有关逻辑 -->
  <!-- 页面初始化数据注入内容已经过 serialize-javascript 转义 防止 xss -->
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Serverless Side Render for Vue3</title>
      <slot name="viteClient" />
      <!-- 初始化移动端 rem 设置，如不需要可自行删除 -->
      <slot name="remInitial" />
      <!-- 用于通过配置插入自定义的 script 为了避免影响期望功能这块内容不做 escape，为了避免 xss 需要保证插入脚本代码的安全性  -->
      <slot name="customeHeadScript" />
      <slot name="cssInject" />
    </head>
    <body>
      <div id="app">
        <slot name="children" />
      </div>
      <slot name="initialData" />
      <slot name="customeFooterScript" />
      <slot name="jsInject" />
    </body>
  </html>
</template>
