'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, EffectFade, Navigation } from 'swiper/modules';
// internal
import slider_img_1 from '@assets/img/slider/2/slider-1.avif';
import slider_img_2 from '@assets/img/slider/2/slider-2.avif';
import slider_img_3 from '@assets/img/slider/2/slider-3.avif';
import slider_shape from '@assets/img/slider/2/shape/shape-1.png';
/* import thumb_shape_1 from '@assets/img/slider/2/shape/shape-2.png';
import thumb_shape_2 from '@assets/img/slider/2/shape/shape-3.png';
 */
import styles from './FashionBanner.module.scss';
// slider data 
const slider_data = [
  {
    id: 1,
    subtitle: 'Knit To Perfection',
    title: 'Classic Knit Showcase',
    img: slider_img_1,
  },
  {
    id: 2,
    subtitle: ' Unmatched Quality in Every Weft',
    title: 'Elevate Your Denim',
    img: slider_img_2,
  },
  {
    id: 3,
    subtitle: 'Winter Has Arrived',
    title: 'Amazing New designs',
    img: slider_img_3,
  },
]

// slider setting 
const slider_setting = {
  slidesPerView: 1,
  spaceBetween: 30,
  effect: 'fade',
  navigation: {
    nextEl: ".tp-slider-2-button-next",
    prevEl: ".tp-slider-2-button-prev",
  },
  pagination: {
    el: ".tp-slider-2-dot",
    clickable: true,
  },
  // Enable Swiper's built-in lazy loading for images
  lazy: "true",
  // Enable keyboard navigation
  keyboard: {
    enabled: true,
    onlyInViewport: true,
  },
}

const FashionBanner = () => {
  return (
    <>
      <section className="tp-slider-area p-relative z-index-1" role="region" aria-label="Homepage Fashion Banner Slider">
        {/* Preload LCP image for Lighthouse test, hidden from users */}
        <div style={{ display: 'none' }}>
          <Image
            src={slider_data[0].img}
            alt={slider_data[0].title}
            layout="responsive"
            width={507}
            height={760}
            priority
            fetchPriority="high"
            sizes="(max-width: 600px) 100vw, 507px"
            quality={60}
          />
        </div>
        <Swiper
          {...slider_setting}
          modules={[Pagination, Navigation, EffectFade]}
          className="tp-slider-active-2 swiper-container"
          aria-label="Fashion Banner Slider"
        >
          {slider_data.map((item, i) => (
            <SwiperSlide key={item.id} aria-label={`Slide ${i + 1}: ${item.title}`}> 
              <div className="tp-slider-item-2 tp-slider-height-2 p-relative grey-bg-5 d-flex align-items-end">
                <div className="tp-slider-2-shape">
                  <Image className="tp-slider-2-shape-1" src={slider_shape} alt="slider decorative shape" width={80} height={80} sizes="80px" layout="responsive" quality={60} />
                </div>
                <div className="container">
                  <div className="row align-items-center">
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="tp-slider-content-2">
                        <span>{item.subtitle}</span>
                        <h3 className="tp-slider-title-2">{item.title}</h3>
                        <div className="tp-slider-btn-2">
                          <Link href="/shop" className="tp-btn tp-btn-border">Shop Collection</Link>
                        </div>
                      </div>
                    </div>
                    <div className="col-xl-6 col-lg-6 col-md-6">
                      <div className="tp-slider-thumb-2-wrapper p-relative">
                        <div className="tp-slider-thumb-2-shape">
                          {/* Shapes can be added here if needed */}
                        </div>
                        <div className="tp-slider-thumb-2 text-end">
                          <span className="tp-slider-thumb-2-gradient"></span>
                          <div className={styles['fashion-slider-img-container']}>
                            <Image
                              src={item.img}
                              alt={item.title}
                              layout="responsive"
                              width={507}
                              height={760}
                              priority={i === 0}
                              fetchPriority={i === 0 ? "high" : undefined}
                              loading={i === 0 ? undefined : "lazy"}
                              sizes="(max-width: 600px) 100vw, 507px"
                              className={styles['fashion-slider-img'] + ' swiper-lazy'}
                              quality={60}
                            />
                            {/* Swiper lazy loader indicator */}
                            {i !== 0 && <div className="swiper-lazy-preloader"></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
          <div className="tp-swiper-dot tp-slider-2-dot"></div>
        </Swiper>
      </section>
    </>
  );
};

export default FashionBanner;