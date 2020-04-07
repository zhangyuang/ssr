import React from 'react'
import { Link } from 'react-router-dom'

export default props => {
  return (
    <div>
      {props.title}
     <Link to={'/news/1'}>跳转到/news1</Link>
     <Link to={'/news/2'}>跳转到/news2</Link>
    </div>
  )
}
