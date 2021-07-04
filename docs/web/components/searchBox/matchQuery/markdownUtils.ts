import markdownIt from 'markdown-it'
import { flatArray } from '@/utils/flatArray'

interface IAst {
    level: number
    title: string
    children: Array<IAst>
    startTokenIndex?: number
    text?: string
}

interface IToken {
    attrs: null | any
    block: boolean
    children: Array<IToken>
    content: string
    hidden: boolean
    info: string
    level: number
    map: null | Array<number>,
    markup: string
    meta: null | any
    nesting: number
    tag: string
    type: string
}

// 插件: 按标题拆分文章内容
const headerAst = (tokens: IToken[]) => {
    const ast: IAst = { level: 0, title: '', children: [] }
    const stack: Array<IAst> = [ast]
  
    const getContent = (startIndex: number, endIndex: number) => {
      let beginIndex = startIndex
      for(let j = startIndex; j < endIndex; j++){
        if (tokens[j].type === 'heading_close') {
          beginIndex = j
          break;
        }
      }
      const newList = beginIndex < endIndex ? tokens.slice(beginIndex, endIndex) : []
      return newList.reduce( (s, t) => { return s + t.content }, '').replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\：\.\，\、\。\；]/g, '')
    }

    let lastNode:any = {}
  
    for (let i = 0; i < tokens.length; i++) {
        const token: IToken = tokens[i]
        if (token.type === 'heading_open') {
            const title: string = tokens[i + 1]
                .children
                .filter( (item: IToken) => { return item.type === 'text' || item.type === 'code_inline' })
                .reduce( (s: string, t: IToken) => { return s + t.content }, '')

            const node: IAst = {
                level: Number(token.tag.slice(1)),
                title,
                children: [],
                startTokenIndex: i,
            }
            if (node.level > stack[0].level) {
                stack[0].children.push(node)
                stack.unshift(node)
            } else if (node.level === stack[0].level) {
                stack[1].children.push(node)
                stack[0] = node
            } else {
                while (node.level <= stack[0].level) stack.shift()
                stack[0].children.push(node)
                stack.unshift(node)
            }
            lastNode.text = getContent(lastNode.startTokenIndex, i)
            lastNode = node
        }
    }
    if(!lastNode.text) {
      lastNode.text = getContent(lastNode.startTokenIndex, tokens.length)
    }
    return ast
}

// 处理markdown文件
const handleMarkdown = (rawFile: string) => {
    let list: any = []
    const md = markdownIt({
        highlight: function () {
            return ''
        }
    })
    md.use((md) => {
        md.core.ruler.push('generateHeaderAst', function (state: any) {
            const tokens = state.tokens
            list = headerAst(tokens)
            return true
        })
    })
    md.render(rawFile)
    return flatArray(list.children, 'children')
}

export { handleMarkdown }