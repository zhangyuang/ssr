import React from 'react'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'

export default props => {
  return (
    <div>
      {props.data && <Slider data={props.data[0].components} />}
      {props.data && <Rectangle data={props.data[1].components} />}
    </div>
  )
}
