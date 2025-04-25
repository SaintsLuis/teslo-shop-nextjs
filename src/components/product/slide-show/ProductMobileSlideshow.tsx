'use client'

import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/free-mode'
import 'swiper/css/pagination'

import './slideshow.css'

// import required modules
import { Autoplay, FreeMode, Pagination } from 'swiper/modules'
import { ProductImage } from '../product-image/ProductImage'

interface Props {
  images: string[]
  title: string
  className?: string
}

export const ProductMobileSlideshow = ({ images, title, className }: Props) => {
  return (
    <div className={className}>
      <>
        <Swiper
          style={{
            width: '100vw',
            height: '500px',
          }}
          pagination
          autoplay={{
            delay: 2500,
            disableOnInteraction: false,
          }}
          modules={[FreeMode, Autoplay, Pagination]}
          className='mySwiper2'
        >
          {images.map((image) => (
            <SwiperSlide key={image}>
              <ProductImage
                src={image}
                className='object-fill'
                alt={title}
                width={600}
                height={500}
                style={{ width: '100%', height: 'auto' }}
              />
            </SwiperSlide>
          ))}
        </Swiper>
      </>
    </div>
  )
}
