import React, { Component } from 'react'
import { withRouter, RouteComponentProps } from 'react-router-dom'
import { FC,IWindow } from '@ssr/types'

let getProps = false
interface IState {
  extraProps: Object
}
declare const window: IWindow

function wrapComponent (WrappedComponent: FC): React.ComponentClass {
  class GetInitialPropsClass extends Component<RouteComponentProps<{}>, IState> {
    constructor (props: RouteComponentProps) {
      super(props)
      this.state = {
        extraProps: {}
      }
      if (!getProps) {
        // csr渲染模式下无论是首次打开页面还是路由跳转都需要客户端需要调用getInitialProps
        // 进行过history push或者reaplace操作之后，每次进行单页跳转客户端都需要调用getInitialProps
        getProps = !window.__USE_SSR__ || props.history && props.history.action === ('PUSH' || 'REPLACE')
      }
    }

    async componentDidMount () {
      if (getProps) {
        await this.getInitialProps()
      }
    }

    async getInitialProps () {
      const props = this.props
      if (WrappedComponent.preload) {
        // react-loadable 情况
        WrappedComponent = (await WrappedComponent.preload()).default
      }
      const extraProps = WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(props) : {}
      this.setState({
        extraProps
      })
    }

    render () {
      // 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
      return <WrappedComponent {...Object.assign({}, this.props, getProps ? {} : window.__INITIAL_DATA__, this.state.extraProps)} />
    }
  }
  return withRouter(GetInitialPropsClass)
}

export {
  wrapComponent
}
