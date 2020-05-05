import React from 'react'
import { Carousel } from 'antd'
import styles from './index.less'

function Slider (props) {
  const data = props.data[0]

  return (
    <div className={styles.carouselContainer}>
      <Carousel autoplay>
        {
          data.itemMap.map(val => {
            return (
              <div className={styles.sliderContainer} key={val.img}>
                <img src={val.img} className={styles.carouselImg} />
                <div className={styles.sliderDescContainer}>
                  <span className={styles.sliderTitle}>
                    { val.title }
                  </span>
                </div>
              </div>
            )
          })
        }
      </Carousel>
    </div>
  )
}

export default Slider
