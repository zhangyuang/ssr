import * as React from 'react'

function wrapLayout (WrappedComponent: React.FC, __isBrowser__: boolean): React.ComponentClass { // tslint:disable-line
  class WrapLayoutClass extends React.Component<any, {}> {
    constructor (props: any) {
      super(props)
    }

    render () {
      return __isBrowser__ ? this.props.children : <WrappedComponent {...this.props}></WrappedComponent>
    }
  }

  return WrapLayoutClass
}

export {
  wrapLayout
}
