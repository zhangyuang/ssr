# 升级步骤

按照本篇描述进行 `plugin-react` 从 `v5.x` 到 `v6.x` 的升级。`v5.x` 版本仍可正常运行，但有一些不优雅的写法在 `v6.x` 版本中统一进行了完善。后续新的 `feature` 将会在 `v6.x` 版本进行更新

## 最新 example

可以通过 `npm init` 命令创建最新的 `react` 类型的 `example` 来获取最新代码。

```shell
$ npm init ssr-app my-ssr-project
$ cd my-ssr-project
$ npm install # 可以使用 yarn 不要使用 cnpm
$ npm start
$ open http://localhost:3000 # 访问应用
$ npm run build # 资源构建，等价于 npx ssr build
$ npm run start:vite # 以 vite 模式启动，等价于 npx ssr start --vite
```

## 改动详情

从老版本升级的用户具体需要改动代码如下

### 修改依赖版本号

`ssr-plugin-react@^5.0.0` => `ssr-plugin-react@^6.0.0`

### 修改 context 获取方式

在老版本中我们通过将 `STORE_CONTEXT` 挂在了 `window` 上可以在任何地方使用，但这种方式很不优雅。在新版本中我们按照如下方式进行 `context` 获取

```js
import { useStoreContext } from 'ssr-common-utils'

export default function Index (props: SProps) {
  const { state, dispatch } = useContext<IContext<IData>>(useStoreContext())
  return (
    <div>
      <Search></Search>
      {
        state?.indexData?.data?.[0]?.components ? <div>
          <Slider {...props} data={state.indexData.data[0].components} />
          <Rectangle {...props} data={state.indexData.data[1].components} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
```

### 修改 web/tsconfig.json

修改 `web/tsconfig.json` 获得正确的类型提示

```js
"paths": {
  "@/*": ["./*"],
  "~/*": ["../*"],
  "_build/*": ["../build/*"] // 这里新增一行
}
```

### 移动类型声明

建议把公共类型全部放在根目录下的 `typings` 文件夹并以 `d.ts` 为文件后缀名结尾

### 修改 fetch 方法入参

为了更好的得到类型提示，在新版本中我们 `fetch` 方法的入参形式改为如下代码

```js
import { ReactMidwayFetch } from 'ssr-types'
import { IndexData } from '~/typings/data'

const fetch: ReactMidwayFetch<{
  apiService: {
    index: () => Promise<IndexData>
  }
}> = async ({ ctx, routerProps }) => {
  // 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
  const data = __isBrowser__ ? await (await window.fetch('/api/index')).json() : await ctx!.apiService?.index()
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    indexData: data
  }
}

export default fetch
```

当需要获取动态参数时

```js
import { ReactMidwayFetch } from 'ssr-types'
import { Ddata } from '~/typings/data'

const fetch: ReactMidwayFetch<{
  apiDeatilservice: {
    index: (id: string) => Promise<Ddata>
  }
}, {id: string}> = async ({ ctx, routerProps }) => {
  // 阅读文档获得更多信息 http://doc.ssr-fc.com/docs/features$fetch#%E5%88%A4%E6%96%AD%E5%BD%93%E5%89%8D%E7%8E%AF%E5%A2%83
  const data = __isBrowser__ ? await (await window.fetch(`/api/detail/${routerProps!.match.params.id}`)).json() : await ctx!.apiDeatilservice.index(ctx!.params.id)
  return {
    // 建议根据模块给数据加上 namespace防止数据覆盖
    detailData: data
  }
}
export default fetch
```