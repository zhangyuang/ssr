import React from 'react'
import styles from './index.less'

function Brief (props) {
  const data = props.data[0].data
  return (
    <div className={styles['brief-info']}>
      <div className={styles['brief-title']}>
        <span className={styles['icon-GOLDEN']}>{data.mark.data.text}</span>
        <h1>{data.showName}</h1>
      </div>
      <div className={styles['brief-score']}>
        {
          data.subTitleList.map((item, index) => {
            return (
              item.subtitle && (
                <span className={`${(item.subtitleType === 'PLAY_VV' && styles.hotVv) || ''}`} key={`subtile${index}`}>
                  {
                    item.subtitleType === 'PLAY_VV'
                      ? <img src={data.heatIcon} />
                      : (index > 0) ? (<span className={styles.divide}>/</span>) : ''
                  }
                  <span>{item.subtitle}</span>
                </span>
              )
            )
          })
        }
      </div>
    </div>
  )
}

export default Brief
