export const normalizePath = (path: string, prefix: string) => {
  // 移除 prefix 保证 path 跟路由表能够正确匹配
  const res = normalizeStartPath(path.replace(prefix, ''))
  return res
}

export const normalizeStartPath = (path: string) => {
  if (path.startsWith('//')) {
    path = path.replace('//', '/')
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return path
}
export const normalizeEndPath = (path: string) => {
  if (!path.endsWith('/')) {
    path = `${path}/`
  }
  return path
}

export const isMicro = () => {
  return !!(window.microApp)
}
