import React from 'react'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'

export default props => {
  return (
    <div>
      <Slider data={props[0].components} />
      <Rectangle data={props[1].components} />
    </div>
  )
}
