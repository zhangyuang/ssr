# 官方文档

官方文档请查看 [https://github.com/ykfe/ssr](https://github.com/ykfe/ssr)

## react-hoc

由于 SSR 的特殊性，打包的时候需要开启 externals 选项，导致一些 hoc 相关的依赖必须在生产环境安装。这里独立出一个包用于存放在服务端客户端都会用到的 hoc，否则打包的处理以及依赖分离的处理会非常麻烦。