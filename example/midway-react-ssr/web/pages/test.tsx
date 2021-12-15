import React from 'react'
import type { IData } from '~/typings/data'

export default function Test (props: IData) {
  const foo = { state: { bar: 1 } }
  return (
    <div>
    Test
      {foo?.state?.bar}
    </div>
  )
}
