import * as React from 'react'
import { matchPath } from 'react-router-dom'
import { FC, RouteItem } from 'ssr-types'

const NotFound: FC = () => {
  return (
    <div>路由查询404</div>
  )
}

const getComponent = (Routes: RouteItem[], path: string) => {
  // 根据请求的path来匹配到对应的component
  const activeRoute = Routes.find(route => matchPath(path, route)) || { Component: () => NotFound } // 找不到对应的组件时返回NotFound组件
  const activeComponent = activeRoute.Component
  return activeComponent
}

export {
  getComponent
}
