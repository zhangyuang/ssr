import React, { Component } from 'react'
import { withRouter,RouteComponentProps } from 'react-router-dom'
import { FC } from '../interface/fc'

let _this: any = null
const popStateFn = () => {
  // 使用popStateFn保存函数防止addEventListener重复注册
  if (_this && _this.getInitialProps) {
    _this.getInitialProps()
  }
}

interface IState {
  getProps: boolean,
  extraProps: Object
}

function GetInitialProps (WrappedComponent: FC): React.ComponentClass {
  class GetInitialPropsClass extends Component<RouteComponentProps<{}>, IState> {
    constructor (props: RouteComponentProps) {
      super(props)
      this.state = {
        extraProps: {},
        getProps: false
      }
    }

    async componentDidMount () {
      const props = this.props
      if (window.__USE_SSR__) {
        _this = this // 修正_this指向，保证_this指向当前渲染的页面组件
        window.addEventListener('popstate', popStateFn)
      }
      const getProps = !window.__USE_SSR__ || (props.history && props.history.action === 'PUSH')
      if (getProps) {
        await this.getInitialProps()
      }
    }

    async getInitialProps () {
      // csr首次进入页面以及csr/ssr切换路由时才调用getInitialProps
      const props = this.props
      if (WrappedComponent.preload) {
        // react-loadable 情况
        WrappedComponent = (await WrappedComponent.preload()).default
      }
      const extraProps = WrappedComponent.getInitialProps ? await WrappedComponent.getInitialProps(props) : {}
      this.setState({
        extraProps,
        getProps: true
      })
    }

    render () {
      // 只有在首次进入页面需要将window.__INITIAL_DATA__作为props，路由切换时不需要
      return <WrappedComponent {...Object.assign({}, this.props, this.state.getProps ? {} : window.__INITIAL_DATA__, this.state.extraProps)} />
    }
  }
  return withRouter(GetInitialPropsClass)
}

export default GetInitialProps
