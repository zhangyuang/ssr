export interface FC extends React.FC {
  fetch?: (params: any) => Promise<any>
}
