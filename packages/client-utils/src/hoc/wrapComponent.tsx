import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC, IWindow } from 'ssr-types'

// declare const window: IWindow

let _this: any = null
let routerChanged = false

const popStateFn = (e: PopStateEvent) => {
  // historyPop的时候需要调用fetch
  routerChanged = true
  // 使用popStateFn保存函数防止addEventListener重复注册,排除hashchange的情况
  if (!location.hash && _this && _this.fetch) {
    _this.fetch()
  }
}

interface IState {
  asyncData: Object
}

function wrapComponent (WrappedComponent: FC): React.ComponentClass {
  class WrapComponentClass extends React.Component<RouteComponentProps<{}>, IState> {
    constructor (props: RouteComponentProps) {
      super(props)
      this.state = {
        asyncData: {}
      }
      if (!routerChanged) {
        routerChanged = !window.__USE_SSR__ || (props.history && props.history.action === 'PUSH')
      }
      if (window.__USE_SSR__) {
        _this = this // 修正_this指向，保证_this指向当前渲染的页面组件
        window.addEventListener('popstate', popStateFn)
      }
    }

    async componentDidMount () {
      // history push的时候需要调用fetch
      if (this.props?.history.action !== 'POP' || !window.__USE_SSR__) {
        await this.fetch()
      }
    }

    async fetch () {
      // csr首次进入页面以及csr/ssr切换路由时才调用fetch
      const props = this.props
      const asyncData = WrappedComponent.fetch ? await WrappedComponent.fetch(props) : {}
      this.setState({
        asyncData
      })
    }

    render () {
      // 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
      const context = { ...Object.assign({}, routerChanged ? {} : window.__INITIAL_DATA__, this.state.asyncData) }
      const WrapContext = React.createContext(context)
      window.STORE_CONTEXT = WrapContext
      return <WrapContext.Provider value={context}>
        <WrappedComponent {...this.props} />
      </WrapContext.Provider>
    }
  }
  return withRouter(WrapComponentClass)
}

export {
  wrapComponent
}
