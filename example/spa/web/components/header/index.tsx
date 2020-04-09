import React from 'react'
import { Link } from 'react-router-dom'
import styles from './index.less'

export default () => {
  return (
    <div className={styles.normal}><h1 className={styles.title}><Link to='/'>Serverless Side Render </Link><div className={styles.author}>by ykfe</div></h1></div>
  )
}
