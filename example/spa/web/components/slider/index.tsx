import React from 'react'
import { Carousel } from 'antd'
import styles from './index.less'

function Slider () {
  return (
    <div className={`CarouselContainer`}>
      <Carousel autoplay
        customPaging={(i) => {
          return (<span className='sliderDotItem' />)
        }}
      >
        {
          Object.keys(comData.itemMap).map(index => {
            const val = comData.itemMap[index]
            return (
              <a key={`Carousel${index}`}>
                <div className='sliderContainer' >
                  <img src={val.img} className='carouselImg' />
                  <div className='sliderDescContainer'>
                    { (val.mark && val.mark.text)
                      ? (
                        <div className={`${(val.mark && cssMapping[val.mark.text]) || cssMapping['default']} sliderMark`}>
                          { val.mark && val.mark.text }
                        </div>
                      )
                      : ''
                    }
                    <span className='sliderTitle'>
                      { val.title }
                    </span>
                    {/* <span className='sliderDesc'>
                        { val.subtitle }  { val.summary }
                      </span> */}
                  </div>
                  <div className='sliderLayer' />
                </div>
              </a>
            )
          })
        }
      </Carousel>
    </div>
  )
}

export default Slider
