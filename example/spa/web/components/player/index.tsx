import React from 'react'
import styles from './index.less'

function Player (props) {
  const data = props.data[0].data
  return (
    <div className={styles.playerContainer} style={{
      background: 'url(' + data.img + ')' + '0  0 /cover'
    }}>
      <div className={styles.title}>{data.title}</div>
      <img className={styles.ico} src='https://gw.alicdn.com/tfs/TB1eA6FEW61gK0jSZFlXXXDKFXa-135-135.png' />
      <div className={styles.layer} />
    </div >
  )
}

export default Player
