import React from 'react'
import { matchPath } from 'react-router-dom'
import { FC } from './interface/fc'
import { Config } from './interface/config'
import { RouteItem } from './interface/route'

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

export default getComponent
