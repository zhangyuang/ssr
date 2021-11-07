import React from 'react'
import { RecommendDataNode } from '~/typings'
import styles from './index.module.less'

interface Props {
  data: RecommendDataNode[]
}

function Recommend (props: Props) {
  const data = props.data
  return (
    <div>
      <div className={styles.title}>
        为你推荐
      </div>
      <div className={styles.reContainer}>

        {
          data.map(item => (
            <div key={item.data.heat} className={styles.reContent}>
              <img src={item.data.img} />
              <div className={styles.vTitle}>
                {item.data.title}
              </div>
              <div className={styles.subTitle}>
                {item.data.subtitle}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  )
}

export default Recommend
