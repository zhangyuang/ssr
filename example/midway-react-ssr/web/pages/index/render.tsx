import { useContext } from 'react'
import { SProps, IContext } from 'ssr-types'
import Slider from '@/components/slider'
import Rectangle from '@/components/rectangle'
import Search from '@/components/search'
import { IData } from '~/typings/data'
import { useStoreContext } from 'ssr-common-utils'

export default function Index (props: SProps) {
  const { state, dispatch } = useContext<IContext<IData>>(useStoreContext())
  return (
    <div>
      <Search></Search>
      {
        state?.indexData?.data?.[0]?.components ? <div>
          <Slider {...props} data={state.indexData.data[0].components} />
          <Rectangle {...props} data={state.indexData.data[1].components} />
        </div> : <img src='https://gw.alicdn.com/tfs/TB1v.zIE7T2gK0jSZPcXXcKkpXa-128-128.gif' className='loading' />
      }
    </div>
  )
}
