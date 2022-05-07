// serverless 部署使用
const WebFramework = require('@midwayjs/koa').Framework
const { Bootstrap } = require('@midwayjs/bootstrap')

module.exports = async () => {
  // 加载框架并执行
  await Bootstrap.run()
  // 获取依赖注入容器
  const container = Bootstrap.getApplicationContext()
  // 获取 koa framework
  const framework = container.get(WebFramework)
  // 返回 app 对象
  return framework.getApplication()
}
