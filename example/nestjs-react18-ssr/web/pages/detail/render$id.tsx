import { SProps } from 'ssr-types'
import Player from '@/components/player'
import Brief from '@/components/brief'
import Recommend from '@/components/recommend'
import Search from '@/components/search'
import { Ddata, RecommendDataNode, PlayerDataNode, BriefDataNode } from '~/typings/data'
import { useStore } from 'ssr-common-utils'

export default function Detail (props: SProps) {
  const { detailState: state } = useStore<{detailState: Ddata}>()
  return (
    <div>
      <Search></Search>
      {
        state?.detailData?.data[0].dataNode ? <div>
          <Player data={state.detailData.data[0].dataNode as PlayerDataNode[]} />
          <Brief data={state.detailData.data[1].dataNode as BriefDataNode[]} />
          <Recommend data={state.detailData.data[2].dataNode as RecommendDataNode[]} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
