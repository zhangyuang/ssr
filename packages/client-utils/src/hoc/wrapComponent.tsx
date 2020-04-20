import * as React from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC, IWindow } from 'ssr-types'

declare const window: IWindow

let _this: any = null

const popStateFn = (e: PopStateEvent) => {
  // historyPop的时候需要调用fetch
  // 使用popStateFn保存函数防止addEventListener重复注册,排除hashchange的情况
  if (!location.hash && _this && _this.fetch) {
    _this.fetch()
  }
}

interface IState {
  extraProps: Object
}

function wrapComponent (WrappedComponent: FC): React.ComponentClass {
  class WrapComponentClass extends React.Component<RouteComponentProps<{}>, IState> {
    constructor (props: RouteComponentProps) {
      super(props)
      this.state = {
        extraProps: {}
      }

      if (window.__USE_SSR__) {
        _this = this // 修正_this指向，保证_this指向当前渲染的页面组件
        window.addEventListener('popstate', popStateFn)
      }
    }

    async componentDidMount () {
      // history push|replace 或者客户端渲染的时候需要调用fetch
      if ((this.props.history && this.props.history.action !== 'POP') || !window.__INITIAL_DATA__) {
        await this.fetch()
      }
    }

    async fetch () {
      delete window.__INITIAL_DATA__
      // csr首次进入页面以及csr/ssr切换路由时才调用fetch
      const props = this.props
      const extraProps = WrappedComponent.fetch ? await WrappedComponent.fetch(props) : {}
      this.setState({
        extraProps
      })
    }

    render () {
      // 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
      return <WrappedComponent {...Object.assign({}, this.props, window.__INITIAL_DATA__ || {}, this.state.extraProps)} />
    }
  }
  return withRouter(WrapComponentClass)
}

export {
  wrapComponent
}
