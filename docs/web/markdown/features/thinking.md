# 设计思路

本章节分享本框架在设计时候的一些思路来帮助开发者更好的理解设计目的以及原理。由于代码是不断的变化的，若本章节图片内容不是最新的，可提 `issue` 进行反馈更新。我们欢迎其他框架参考我们的思路，但请注明来源。如果你觉得设计有改进的地方在不影响已有功能和上层业务代码的前提下，请提 `issue` 讨论

## 插件化设计

插件分为前端插件和服务端插件，主要逻辑都在前端插件当中

### 前端插件

![](/images/plugin1.png)

### 总体设计

![](/images/plugin2.png)

## 渲染降级

怎么实现一个成熟的降级功能
### 什么情况下进行降级

![](/images/csr1.png)

![](/images/csr2.png)

### 业界普遍方案是怎么做的

通常是错误时把请求打到一个静态 `html` 文件来实现

![](/images/csr3.png)

![](/images/csr4.png)

### 我们是怎么做的

![](/images/csr5.png)

![](/images/csr6.png)

## 异步 chunk 如何收集并预加载

### 为什么会有异步 chunk

![](/images/chunk1.png)

### vue-renderer 怎么做的

![](/images/chunk2.png)

### 我们是怎么做的

![](/images/chunk3.png)

### 有什么优势

![](/images/chunk4.png)

## 怎么接 Vite

### 分析流程

![](/images/vite1.png)

### 我们是怎么做的

如前面内容提到，当 `vite` 这块成熟后不排除会完全分离 `webpack/vite`

![](/images/vite2.png)
