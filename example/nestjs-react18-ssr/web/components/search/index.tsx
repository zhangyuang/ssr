import { useStore } from 'ssr-common-utils'
import { useSnapshot } from 'valtio'
import styles from './index.module.less'

function Search () {
  const { searchState } = useStore<{searchState: {searchText: string} }>()
  const snap = useSnapshot(searchState)
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    searchState.searchText = e.target.value
  }
  const toSearch = () => {
    const searchVal = searchState.searchText
    location.href = `https://search.youku.com/search_video?keyword=${searchVal}`
  }
  return (
    <div className={styles.searchContainer}>
      <input type="text" className={styles.input} value={ snap.searchText ?? ''} onChange={handleChange} placeholder="该搜索框内容会在所有页面共享" />
      <img src="https://img.alicdn.com/tfs/TB15zSoX21TBuNjy0FjXXajyXXa-48-48.png" alt="" className={styles.searchImg} onClick={toSearch} />
    </div >
  )
}

export default Search
