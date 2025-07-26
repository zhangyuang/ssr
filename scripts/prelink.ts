import shell from 'shelljs'
import * as path from 'path'

const example = process.env.EXAMPLE
function createReactSymlink() {

  const examplePath = path.resolve('example', example!)
  const pluginReactPath = path.resolve('packages/plugin-react')
  
  shell.ln('-s', 
    path.resolve(examplePath, 'node_modules/valtio'),
    path.resolve(pluginReactPath, 'node_modules/valtio')
  )

  shell.ln('-s', 
    path.resolve(examplePath, 'node_modules/valtio'),
    path.resolve(process.cwd(), 'node_modules/valtio')
  )
  
  shell.ln('-s',
    path.resolve(examplePath, 'node_modules/react'), 
    path.resolve(pluginReactPath, 'node_modules/react')
  )

  shell.ln('-s',
    path.resolve(examplePath, 'node_modules/react'), 
    path.resolve(process.cwd(), 'node_modules/react')
  )
}

createReactSymlink()
