import React, { useContext } from 'react'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'

export default props => {
  const {state, dispatch} = useContext(window.STORE_CONTEXT)
  return (
    <div>
      {
        state?.data?.[0]?.components ? <div>
          <Slider {...props} data={state.data[0].components} />
          <Rectangle {...props} data={state.data[1].components} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
