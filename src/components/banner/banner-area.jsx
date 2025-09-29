'use client';
import React from "react";
import Link from "next/link";
// internal
import { ArrowRight } from "@/svg";
import banner_1 from "@assets/img/product/banner/product-banner-1.jpg";
import banner_2 from "@assets/img/product/banner/product-banner-2.jpg";
import styles from './BannerArea.module.scss';


// banner item
function BannerItem({ sm = false, bg, title }) {
  return (
    <div
      className={`${styles.tpBannerItem} ${sm ? 'tp-banner-item-sm' : ''} tp-banner-height p-relative fix`}
    >
      <div
        className={`${styles.tpBannerThumb} tp-banner-thumb include-bg transition-3`}
        style={{ backgroundImage: `url(${bg.src})` }}
      ></div>
      <div className={`${styles.tpBannerContent} tp-banner-content`}>
        {!sm && <span>Sale 20% off all store</span>}
        <h3 className={`${styles.tpBannerTitle} tp-banner-title`}>
          <Link href="/shop">{title}</Link>
        </h3>
        {sm && <p>Sale 35% off</p>}
        <div className="tp-banner-btn">
          <Link href="/shop" className="tp-link-btn">
            Shop Now
            <ArrowRight />
          </Link>
        </div>
      </div>
    </div>
  );
}

const BannerArea = () => {
  return (
    <section className="tp-banner-area pb-70">
      <div className="container">
        <div className="row">
          <div className="col-xl-8 col-lg-7">
            <BannerItem
              bg={banner_1}
              title={
                <>
                  Smartphone <br /> BLU G91 Pro 2022
                </>
              }
            />
          </div>
          <div className="col-xl-4 col-lg-5">
            <BannerItem
              sm={true}
              bg={banner_2}
              title={
                <>
                  HyperX Cloud II <br /> Wireless
                </>
              }
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerArea;
