/**
 * @jest-environment jsdom
 */

import React from 'react'
import { mount } from 'enzyme'
import { renderToString }from 'react-dom/server'
import onlyCsr from '../src/components/onlyCsr'
import { FC } from '../src/interface/fc'

describe('test onlyCsr', () => {
  const { createElement } = React
  const Page: FC = () => {
    return (
    <div>Page</div>
    )
  }

  Page.getInitialProps = () => Promise.resolve('data')

  const Wrap = onlyCsr(Page)

  test('component shouldn\'t render in server', () => {
    expect(renderToString(createElement(Wrap))).toEqual('<div data-reactroot=""></div>')
  })

  test('component should render in client', () => {
    const WrapElement = mount(createElement(Wrap))
    expect(WrapElement.text()).toEqual('Page')
  })

  test('static props and method can be transferring', async () => {
    // @ts-ignore for this issue https://github.com/Microsoft/TypeScript/issues/6480
    const data = await Wrap.getInitialProps()
    expect(data).toEqual('data')
  })
})
