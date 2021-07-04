import { config } from '@/pages/docs/config'
import { handleMarkdown } from './markdownUtils'

interface ISearchItem {
  title: string
  text: string
  textHtml: string
  path: string
  isTitle: boolean
}

interface IContentItem {
  title: string
  text: string
}

interface IFileConfig {
  title: string
  path: string
  routes: IFileConfig[]
  rawFile?: string
  contentList: any[]
}

const standardConfig: IFileConfig[] = []

// 读取文件内容
const readFile = async (path: string) => {
  try {
    return (await import(`../../../markdown/${path}.md`)).default
  } catch (e) {
    console.log('readFile error:', e, '.path:', path)
    return ''
  }
}

// 初始化config
const initConfig = async () => {
  if (standardConfig.length !== 0) {
    return
  }
  for (const item of config) {
    const newItem: any = {
      ...item
    }
    if (newItem.path) {
      const rawFile = await readFile(newItem.path.replace(/\$/g, '/'))
      newItem.contentList = handleMarkdown(rawFile)
    }
    if (newItem.routes) {
      for (const routeItem of newItem.routes) {
        const rawFile = await readFile(routeItem.path.replace(/\$/g, '/'))
        routeItem.contentList = handleMarkdown(rawFile)
      }
    }
    standardConfig.push(newItem)
  }
}

// 全局搜索
const match: (query: string, config: any) => Promise<any[]> = async (query: string) => {
  const beginTime = Date.now()
  await initConfig()
  const resultList: any[] = []
  const getDataList = (file: IFileConfig, dataList: any[]) => {
    const matchData = matchFile(query, file)
    if (matchData.length) {
      return [...dataList, {
        title: file.title,
        list: matchData
      }]
    }
    return dataList
  }
  for (const item of standardConfig) {
    let dataList: any[] = []
    if (item?.contentList?.length) {
      dataList = getDataList(item, dataList)
    }
    if (item.routes) {
      let dataTwoList: any[] = []
      for (const itemTwo of item.routes) {
        dataTwoList = getDataList(itemTwo, dataTwoList)
      }
      dataList = [...dataList, ...dataTwoList]
    }
    if (dataList.length) {
      resultList.push({
        title: item.title,
        list: dataList
      })
    }
  }
  console.log('关键词', query)
  console.log('搜索结果', resultList)
  console.log(`搜索耗时: ${Date.now() - beginTime}ms`)
  return resultList
}

// 搜一个文件
const matchFile = (query: string, file: IFileConfig) => {
  const resultTitleList = matchFileTitle(query, file, file.contentList)
  const resultContentList = matchFileText(query, file, file.contentList)
  return [...resultTitleList, ...resultContentList]
}

// 搜一个文件的标题
const matchFileTitle = (query: string, file: IFileConfig, contentList: IContentItem[]) => {
  const resultList: ISearchItem[] = []
  const matchTitleData = matchText(query, file.title, 5, 3)
  if (matchTitleData.result) {
    resultList.push({
      title: file.title,
      text: file.title,
      textHtml: matchTitleData.textHtml,
      path: file.path,
      isTitle: true
    })
  }
  contentList.forEach((item, index) => {
    if (index === 0) return
    const matchData = matchText(query, item.title, 5, 3)
    if (matchData.result) {
      resultList.push({
        title: item.title,
        text: item.title,
        textHtml: matchData.textHtml,
        path: file.path,
        isTitle: true
      })
    }
  })
  return resultList
}

// 搜一个文件的内容
const matchFileText = (query: string, file: IFileConfig, contentList: IContentItem[]) => {
  const resultList: ISearchItem[] = []
  contentList.forEach((item) => {
    const matchData = matchText(query, item.text, 5, 3)
    if (matchData.result) {
      resultList.push({
        title: item.title,
        text: matchData.text,
        textHtml: matchData.textHtml,
        path: file.path,
        isTitle: false
      })
    }
  })
  return resultList
}

// 搜索一段文本
const matchText = (query: string, totalText: string, frontSize: number, backSize: number) => {
  const index = totalText.toLowerCase().indexOf(query.toLowerCase())
  if (index === -1) {
    return {
      result: false,
      text: '',
      textHtml: ''
    }
  }
  const begin: number = Math.max(0, index - frontSize)
  const end: number = Math.min(query.length + index + backSize, totalText.length)
  const text = totalText.slice(begin, end)
  const validQuery = totalText.substr(index, query.length)
  return {
    result: true,
    text,
    textHtml: text.replace(validQuery, `<span class="matchTextHighlight">${validQuery}</span>`)
  }
}

export { match, initConfig }
