import React, { useContext } from 'react'
import Player from '@/components/player'
import Brief from '@/components/brief'
import Recommend from '@/components/recommend'
import Search from '@/components/search'

export default (props) => {
  const { state, dispatch } = useContext(window.STORE_CONTEXT)
  return (
    <div>
      <Search></Search>
      {
        state?.data[0].dataNode ? <div>
          <Player data={state.data[0].dataNode} />
          <Brief data={state.data[1].dataNode} />
          <Recommend data={state.data[2].dataNode} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
