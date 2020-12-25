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
      {/* 这里需要给 value 一个兜底的状态 否则 context 改变 首次 render 的 text 值为 undefined 会导致 input 组件 unmount */}
      {/* ref: https://stackoverflow.com/questions/47012169/a-component-is-changing-an-uncontrolled-input-of-type-text-to-be-controlled-erro/47012342 */}
      <input type="text" className={styles.input} value={state?.search?.text || ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享"/>
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} />
    </div >
  )
}

export default Search
