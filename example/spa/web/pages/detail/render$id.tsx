import React, { useContext } from 'react'
import Player from '@/components/player'
import Brief from '@/components/brief'
import Recommend from '@/components/recommend'

export default (props) => {
  const context = useContext((window as IWindow).STORE_CONTEXT)
  return (
    <div>
      {
        context.data ? <div>
          <Player data={context.data[0].dataNode} />
          <Brief data={context.data[1].dataNode} />
          <Recommend data={context.data[2].dataNode} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
