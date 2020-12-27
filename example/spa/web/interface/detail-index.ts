export interface Ddata {
  detailData?: {
    data: Data[]
  }
}
export interface Data {
  dataNode: DataNode[]
}
export interface DataNode {
  data: {
    img: string
    title: string
  }
}
