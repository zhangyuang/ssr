import shell from 'shelljs'
import * as path from 'path'
import * as fs from 'fs'

const reactExamples = [
  'nestjs-react-ssr',
  'nestjs-react18-ssr', 
  'midway-react-ssr',
  'midway-react18-ssr'
]

function createValtioSymlinks() {
  console.log('开始为 React example 项目创建 valtio 软连接...')
  
  // 根目录 valtio 路径
  const rootValtioPath = path.resolve('node_modules', 'valtio')
  
  // 检查根目录是否存在 valtio
  if (!fs.existsSync(rootValtioPath)) {
    console.error('❌ 根目录下未找到 valtio，请先执行 pnpm install')
    return
  }
  
  console.log(`✅ 发现根目录 valtio: ${rootValtioPath}`)
  
  reactExamples.forEach(exampleName => {
    const exampleDir = path.resolve('example', exampleName)
    shell.ln('-s', rootValtioPath, path.resolve(exampleDir, 'node_modules', 'valtio'))
  })
  shell.ln('-s', rootValtioPath, path.resolve(path.resolve('packages'), 'plugin-react', 'node_modules', 'valtio'))
  console.log('\n🎉 valtio 软连接处理完成!')
}



createValtioSymlinks()
