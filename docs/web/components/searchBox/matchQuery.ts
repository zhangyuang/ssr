import markdownIt from 'markdown-it'
import markdownItTocDoneRight from 'markdown-it-toc-done-right'
import {flatArray} from '@/utils/flatArray'

interface ISearchItem {
    title: string;
    text: string;
    textHtml: string;
    path: string;
    isTitle: boolean;
}

interface IContentItem {
    title: string;
    text: string;
}

interface IFile {
    path:string, 
    title:string
}

interface IFileConfig {
    title: string;
    path: string;
    routes: Array<IFileConfig>
    rawFile?: string;
}

interface IMatchQuery {
    fileConfig: Array<IFileConfig>;
    match: (query:string, config:any) => Promise<Array<any>>
}

class matchQuery implements IMatchQuery {

    public fileConfig: Array<IFileConfig> = []

    // 读取文件内容
    public async readFileConfigList(config: any) {
        if (this.fileConfig.length > 0) return
        const fileConfig = JSON.parse(JSON.stringify(config))
        const readFile = async (path: string) => {
            try {
                return (await import(`../../markdown/${path}.md`)).default
            }catch(e){
                console.error('readFile', e);
                return ''
            }
        }
        for (let item of fileConfig){
            if(item.path){
                item.rawFile = await readFile(item.path.replace(/\$/g, '/'))
            }
            if(item.routes){
                for (let itemTwo of item.routes){
                    itemTwo.rawFile = await readFile(itemTwo.path.replace(/\$/g, '/'))
                }
            }
        }
        this.fileConfig = fileConfig
    }

    // 全局搜索
    public match = async (query:string, config:any) => {
        await this.readFileConfigList(config)
        let resultList: Array<any> = []
        for (let item of this.fileConfig){
            let dataList: Array<any> = []
            if(item.rawFile){
                const matchData = this.matchFile(query, item)
                if(matchData.length){
                    dataList = [...dataList, {
                        title: item.title,
                        list: matchData
                    }]
                }
            }
            if(item.routes){
                let dataTwoList: Array<any> = []
                for (let itemTwo of item.routes){
                    const matchDataTwo = this.matchFile(query, itemTwo)
                    if(matchDataTwo.length){
                        dataTwoList = [...dataTwoList, {
                            title: itemTwo.title,
                            list: matchDataTwo
                        }]
                    }
                }
                dataList = [...dataList, ...dataTwoList]
            }
            if(dataList.length){
                resultList.push({
                    title: item.title,
                    list: dataList
                })
            }
        }
        console.log('关键词', query);
        console.log('搜索结果', resultList);
        return resultList
    }

    // 搜一个文件
    public matchFile = (query: string, file: IFile) => {
        const contentList: Array<IContentItem> = this.handleMarkdown(file.rawFile)
        const resultTitleList = this.matchFileTitle(query, file, contentList)
        const resultContentList = this.matchFileText(query, file, contentList)
        return [...resultTitleList,...resultContentList]
    }

    // 搜一个文件的标题
    public matchFileTitle = (query: string, file: IFile, contentList: Array<IContentItem>) => {
        const resultList: Array<ISearchItem> = []
        const matchTitleData = this.matchText(query, file.title, 5, 3);
        if(matchTitleData.result){
            resultList.push({
                title: file.title,
                text: file.title,
                textHtml: matchTitleData.textHtml,
                path: file.path,
                isTitle: true,
            })
        }
        contentList.forEach((item) => {
            const matchData = this.matchText(query, item.title, 5, 3);
            if(matchData.result){
                resultList.push({
                    title: item.title,
                    text: item.title,
                    textHtml: matchData.textHtml,
                    path: file.path,
                    isTitle: true,
                })
            }
        })
        return resultList
    }
    
    // 搜一个文件的内容
    public matchFileText = (query: string, file: IFile, contentList: Array<IContentItem>) => {
        const resultList: Array<ISearchItem> = []
        contentList.forEach((item) => {
            const matchData = this.matchText(query, item.text, 5, 3);
            if(matchData.result){
                resultList.push({
                    title: item.title,
                    text: matchData.text,
                    textHtml: matchData.textHtml,
                    path: file.path,
                    isTitle: false,
                })
            }
        })
        return resultList
    }

    // 搜索一段文本
    public matchText = (query:string, totalText:string, frontSize: number, backSize: number) => {
        var index = totalText.search(query);
        if (index === -1) {
            return {
                result: false,
                text: '',
                textHtml: '',
            };
        }
        let begin: number = Math.max(0, index - frontSize)
        let end: number = Math.min(query.length + index + backSize, totalText.length)
        const text = totalText.slice(begin, end)
        return {
            result: true,
            text,
            textHtml: text.replace(query, `<span class="matchTextHighlight">${query}</span>`),
        }
    }

    // 处理文件
    public handleMarkdown = (rawFile: string) => {
        let sideMenuList: any[] = []
        const md = markdownIt({
            highlight: function (str, lang) {
                return ``
            }
        })
        md.use(markdownItTocDoneRight, {
            callback: (_, ast) => {
                sideMenuList = ast.c
            },
        })
        md.render(rawFile)
        const headerList = flatArray(sideMenuList, 'c')
        const contentList: Array<IContentItem> = []
        headerList.reverse().forEach((item) => {
            const front = new Array(item.l).fill('#').join('')
            const [left, right] = rawFile.split(`${front} ${item.n}`)
            rawFile = left
            contentList.push({
                title: item.n,
                text: (right || '').replace(/[^\a-\z\A-\Z0-9\u4E00-\u9FA5\：\.\，\、\。]/g,'')
            })
        })
        return contentList.reverse()
    }
    
}

export default new matchQuery()