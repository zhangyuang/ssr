import React from 'react'
import Header from '@/components/header'
import styles from './index.less'

export default (props) => {
  return (
    <div>
      <Header />
      <div className={styles['news-container']} >
        文章详情: {props.newsDetail}
      </div>
    </div>
  )
}
