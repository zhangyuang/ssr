import * as React from 'react'
import { LayoutProps } from 'ssr-types'

function wrapLayout (WrappedComponent: React.FC, __isBrowser__: boolean): React.ComponentClass<LayoutProps, {}> { // tslint:disable-line
  class WrapLayoutClass extends React.Component<LayoutProps, {}> {
    render () {
      return __isBrowser__ ? this.props.children : <WrappedComponent {...this.props}></WrappedComponent>
    }
  }

  return WrapLayoutClass
}

export {
  wrapLayout
}
