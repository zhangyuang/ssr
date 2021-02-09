<template>
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
      <div id="app" data-server-rendered="true">
        <slot name="children" />
      </div>
      <slot name="jsInject" />
    </body>
  </html>
</template>

<script>
export default {
  data () {
    return {
      foo: 'bar'
    }
  }
}
</script>

<style lang="less">
@import './index.less';
</style>
