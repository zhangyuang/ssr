# 数据获取

数据获取是服务端渲染应用中非常重要的一个环节。通过本章节的内容，读者可以了解服务端渲染应用的一些深层次的知识

## 静态方法获取数据

`ssr` 框架提出定义 `fetch.ts` 文件用于获取数据，本质上与 `Vue` 提出的 `asyncData`, `Next.js` 提出的 `getInitialProps` 意义一致，都属于一个静态方法。

关于什么是 `static method`, 即不需要将类实例化便可以拿到的方法。例如下面的代码

```js
class Foo {}

Foo.bar = () => {}
```

此时的 `bar` 函数即为 `static method`, 我们可以直接通过 `Foo.bar()` 来调用它，而不需要 `new Foo()`。这里大部分用户可能会有疑惑，为什么要使用一个静态方法来进行数据的获取，而不是像传统 SPA 应用一样直接写在组件的生命周期当中呢。

对服务端渲染有一定了解的同学会知道，在服务端会执行的生命周期只有 `created/componentWillMount`，而像 `mounted/componentDidMount` 这样的生命周期是不会被执行的。那么我们将获取数据的逻辑写在 `created` 当中是否可行呢。答案也是否定的

由于我们获取数据的逻辑一般都是异步的。在服务端渲染的过程中，并不会像客户端应用那样，当 `props/state` 改变时组件重新 `render`。举个例子，下面的代码是无法拿到正确的渲染结果的

```js
class Foo extends React.component {
    construtor (props) {
        super(props)
        this.state = {
            value: 'foo'
        }
    }
    async componentWillMount() {
        const newValue = await Promise.resolve('bar')
        this.setState({
            value: newValue
        })
    }
    render() {
        return (
            <div>{this.state.value}</div>
        )
    }
}
```

上述代码我们期望的渲染结果是 `value=bar` 但是实际的结果却并不是这样。有兴趣的同学可以实际运行一下上述代码来观察一下具体的现象。同理在 `Vue` 当中我们也不能够拿到正确的数据。所以我们需要定义一个静态方法来获取数据

## fetch.ts 规范

我们定义 `fetch.ts` 文件来作为获取数据的入口文件。因为对一些大团队来说，我们在服务端通常可以采用 `rpc` 类型的调用，或是直接调用 `Node Service` 的代码来获取数据，无需通过 `http` 请求，所以在 `fetch.ts` 中，我们可能会编写服务端相关代码，故独立出一个文件来进行维护。

`fetch.ts` 的定义是页面级别的组件进行数据获取的入口文件，不包括子组件。由于在服务端一个组件被真正的 `render` 之前，我们并不知道它依赖哪些子组件。所以我们没有办法调用子组件的 `fetch`, 当然也有其他方式可以解决这个问题。见本文最后的补充内容。