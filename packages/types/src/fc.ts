export interface FC extends React.FC {
  getInitialProps?: (params: any) => Promise<any>
  Layout?: React.FC
}
