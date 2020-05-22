import React from 'react'
import Player from '@/components/player'
import Brief from '@/components/brief'
import Recommend from '@/components/recommend'

export default (props) => {
  return (
    <div>
      {
        props.data ? <div>
          <Player data={props.data[0].dataNode} />
          <Brief data={props.data[1].dataNode} />
          <Recommend data={props.data[2].dataNode} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
