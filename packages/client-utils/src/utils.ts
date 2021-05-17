export const normalizePath = (path: string, prefix: string) => {
  path = path.replace(prefix!, '')
  if (path.startsWith('//')) {
    path = path.replace('//', '/')
  }
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  return path
}
