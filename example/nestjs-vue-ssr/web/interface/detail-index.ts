export interface Ddata {
  detailData?: {
    data: Data[]
  }
}
export interface Data {
  dataNode: RecommendDataNode[] | PlayerDataNode[] | BriefDataNode[]
}

export interface PlayerDataNode {
  data: {
    img: string
    title: string
  }
}

export interface RecommendDataNode {
  data: {
    heat: string
    summary: string
    img: string
    titleLine: number
    summaryType: string
    title: string
    subtitleType: string
    subtitle: string
  }
}

export interface BriefDataNode {
  data: {
    showName: string
    heat: string
    heatIcon: string
    updateInfo: string
    mark: {
      type: string
      mediaMarkType: string
      mediaMarkEnum: {
        name: string
      }
      data: {
        text: string
        color: string
        colorValue?: string
        img?: string
      }
    }
    showImg: boolean
    subTitleList: subTitle[]
  }
}

export interface subTitle {
  subtitle: string
  subtitleType: string
}
