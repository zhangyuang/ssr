<template>
  <html>
    <head>
      <meta charSet="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
      <meta name="theme-color" content="#000000">
      <title>Serverless Side Render</title>
      <slot name="script" />
    </head>
    <body>
      <div id="app">
        <slot name="children" />
      </div>
    </body>
  </html>
</template>

<script>

</script>

<style>

</style>
