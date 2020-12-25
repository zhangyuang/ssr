import React from 'react'
import Swiper from 'react-id-swiper'
import { SProps } from 'ssr-types'
import 'swiper/css/swiper.css'
import { ItemMapArr } from '@/interface'
import styles from './index.less'

interface Props extends SProps{
  data: ItemMapArr[]
}

const params = {
  pagination: {
    el: '.swiper-pagination',
    clickable: true,
    loop: true
  }
}

function Slider (props: Props) {
  const data = props.data[0]
  return (
    <div className={styles.swiperContainer}>
      <Swiper {...params}>
        {
          data.itemMap.map(val => (
            <div className={styles.sliderContainer} key={val.img} onClick={() => props.history.push('/detail/cbba934b14f747049187')}>
              <img src={val.img} className={styles.carouselImg} />
              <div className={styles.sliderDescContainer}>
                <span className={styles.sliderTitle}>
                  { val.title }
                </span>
              </div>
            </div>
          )
          )
        }
      </Swiper>
    </div>
  )
}

export default Slider
