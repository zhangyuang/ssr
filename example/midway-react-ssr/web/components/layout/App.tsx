
import { LayoutProps } from 'ssr-types'
// 需要在文件中真实引用 styles 变量，相关样式代码才会被打包
import styles from './index.less'

// 此文件将会在服务端/客户端都将会用到
// 可通过 __isBrowser__ 或者 useEffect 判断当前在 浏览器环境做一些初始化操作

export default (props: LayoutProps) => {
  return props.children!
}
