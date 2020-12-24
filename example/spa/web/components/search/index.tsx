import React, { useContext } from 'react'
import styles from './index.less'

function Search (props) {
  const { state, dispatch } = useContext(window.STORE_CONTEXT)
  const handleChange = e => {
    dispatch({
      type: 'updateContext',
      payload: {
        search: {
          text: e.target.value
        }
      }
    })
  }
  return (
    <div className={styles.searchContainer}>
      <input type="text" className={styles.input} value={state.search?.text} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享"/>
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} />
    </div >
  )
}

export default Search
