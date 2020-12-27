export interface IData {
  indexData: IndexData
}

export interface IndexData {
  data: ComponentsArr[]
}
export interface ComponentsArr {
  components: ItemMapArr[]
}

export interface ItemMapArr {
  itemMap: ItemMap[]
}
export interface ItemMap {
  action: {
    type: string
    extra: {
      value: string
      videoId?: string
    }
  }
  mark: {
    text: string
  }
  subtitle?: string
  title: string
  img: string
  summary: string
}
