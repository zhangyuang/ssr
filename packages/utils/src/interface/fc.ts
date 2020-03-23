export interface FC extends React.FC {
  getInitialProps?: (params: any) => Promise<any>
  Layout?: React.FC
  preload?: () => Promise<Preload>
}

interface Preload {
  default: React.FC
}
