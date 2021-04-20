# 本地开发

```bash
$ npm i
$ npm start # 等价于 ssr start
$ open http://localhost:3000
```

## 本地调试

借助 [debug](https://github.com/visionmedia/debug) 模块的能力，开发者可以在本地开发过程中获取一些构建渲染过程的信息。

```bash
# 打印所有的 ssr 模块提供的 debug 信息
$ DEBUG=ssr:* npm start 
```