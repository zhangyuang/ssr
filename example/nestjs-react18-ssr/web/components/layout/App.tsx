// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作
import { LayoutProps } from 'ssr-types'

export default function App (props: LayoutProps) {
  return props.children!
}
