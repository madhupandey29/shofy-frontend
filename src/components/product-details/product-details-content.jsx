'use client';

import React, { useState, useEffect } from 'react';

import DetailsThumbWrapper from './details-thumb-wrapper';
import DetailsWrapper      from './details-wrapper';
import DetailsTabNav       from './details-tab-nav';
import RelatedProducts     from './related-products';

import { useGetSeoByProductQuery } from '@/redux/features/seoApi';

export default function ProductDetailsContent({ productItem }) {
  const {
    _id,
    img,
    image1,
    image2,
    imageURLs,          // optional extra images (merged after the 3 main)
    videoId,            // fallback video url
    video,              // optional
    videoThumbnail,     // optional
    status,
    groupcodeId,
  } = productItem ?? {};

  // active image for the details panel
  const [activeImg, setActiveImg] = useState(img || null);
  useEffect(() => { setActiveImg(img || null); }, [img]);
  const handleImageActive = (item) => setActiveImg(item?.img ?? img ?? null);

  const {
    data: seoPayload,
    isLoading: seoLoading,
    isError: seoError,
  } = useGetSeoByProductQuery(_id, { skip: !_id });

  const seoData = seoPayload?.data ?? null;

  const SeoStatus = () => {
    if (seoLoading) return <span className="text-muted small">Loading SEO…</span>;
    if (seoError)   return null;
    return null;
  };

  return (
    <section className="tp-product-details-area">
      <div className="tp-product-details-top pb-115">
        <div className="container">
          <div className="row">
            {/* Left: gallery */}
            <div className="col-xl-7 col-lg-6">
              <DetailsThumbWrapper
                key={_id}
                /* force default main image to be `img` */
                activeImg={img}
                /* the 3 primary thumbs in this exact order */
                img={img}
                image1={image1}
                image2={image2}
                /* optional video */
                video={video}
                videoThumbnail={videoThumbnail}
                /* extra images merged after the 3 primaries */
                imageURLs={imageURLs}
                handleImageActive={handleImageActive}
                imgWidth={580}
                imgHeight={670}
                videoId={videoId}
                status={status}
              />
            </div>

            {/* Right: details */}
            <div className="col-xl-5 col-lg-6">
              <DetailsWrapper
                productItem={productItem}
                handleImageActive={handleImageActive}
                activeImg={activeImg || img}
                detailsBottom
              />
              <SeoStatus />
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tp-product-details-bottom pb-140">
        <div className="container">
          <div className="row">
            <div className="col-xl-12">
              <DetailsTabNav product={productItem} seoData={seoData} />
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="tp-related-product pt-95 pb-50">
        <div className="container">
          <div className="row">
            <div className="tp-section-title-wrapper-6 text-center mb-40">
              <span className="tp-section-title-pre-6">Style it with</span>
              <h3 className="tp-section-title-6">Mix &amp; Match</h3>
            </div>
          </div>
          <div className="row">
            <RelatedProducts id={_id} groupcodeId={groupcodeId} />
          </div>
        </div>
      </section>
    </section>
  );
}