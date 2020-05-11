import React from 'react'
import Swiper from 'react-id-swiper'
import 'swiper/css/swiper.css'
import styles from './index.less'

function Slider (props) {
  const data = props.data[0]
  const params = {
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
      loop: true
    }
  }
  return (
    <div className={styles.carouselContainer}>
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
