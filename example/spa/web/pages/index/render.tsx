import React from 'react'
import { Link } from 'react-router-dom'
import Header from '@/components/header'
import styles from './index.less'

interface NewsItem {
  id: string,
  title: string
}

export default props => {
  return (
    <div>
      <Header />
      <div className={styles.normal}>
        <ul className={styles.list}>
          {
            props.news && props.news.map((item: NewsItem) => (
              <li key={item.id}>
                <div>文章标题: {item.title}</div>
                <div className={styles.toDetail}><Link to={`/news/${item.id}`}>点击查看详情</Link></div>
              </li>
            ))
          }
        </ul>
      </div>
    </div>
  )
}
