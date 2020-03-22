export interface Optional {
    /** 执行的指令 */
  action?: string

    /** 命令行 */
  command?: string[]

    /** 包管理工具 */
  tool?: string

    /** 应用名称 */
  appName: string

    /** 样式预处理 */
  style?: 'less' | 'sass' | 'css'

    /** 状态管理的中间件 */
  store?: string

    /** 项目语言 */
  language: 'typescript' | 'javascript'
}
