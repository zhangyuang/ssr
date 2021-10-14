import { createContext } from 'react'
import { IContext } from 'ssr-types-react'

// 服务端需要为每一个请求创建全新的 context 方式请求污染
const serverContext = (context?: any) => {
  return createContext(context)
}

// 客户端的 context  只需要创建一次，在页面整个生命周期内共享
const clientContext = createContext<IContext>({
  state: {}
})

export {
  serverContext,
  clientContext
}
