import React from 'react'
import styles from './index.less'

export default (props) => {
  return (
    <div className={styles['news-container']} >
      文章详情: {props.newsDetail}
    </div>
  )
}
