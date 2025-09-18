/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
'use client';

import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';

import { useGetGroupCodeProductsQuery } from '@/redux/features/newProductApi';
import ProductItem from '../products/fashion/product-item';
import ErrorMsg from '../common/error-msg';
import { HomeNewArrivalPrdLoader } from '../loader';

// slider setting
const slider_setting = {
  slidesPerView: 4,
  spaceBetween: 24,
  navigation: {
    nextEl: '.tp-related-slider-button-next',
    prevEl: '.tp-related-slider-button-prev',
  },
  autoplay: { delay: 5000 },
  breakpoints: {
    1200: { slidesPerView: 4 },
    992:  { slidesPerView: 3 },
    768:  { slidesPerView: 2 },
    576:  { slidesPerView: 2 },
    0:    { slidesPerView: 1 },
  },
};

/**
 * Normalize a "groupcode relation" record into a product-like object that ProductItem understands.
 * - If `rel.product` is populated, merge it over the relation and keep relation-level prices as fallbacks.
 * - Ensure `_id`, `slug`, and `category` are present in predictable shapes.
 * - If only IDs are present, provide safe placeholders; ProductItem will still pull SEO data.
 */
const normalizeRelationToProduct = (rel) => {
  if (!rel) return null;

  // If rel.product is a populated object:
  if (rel.product && typeof rel.product === 'object') {
    const merged = { ...rel, ...rel.product };

    // Prefer ids/slugs from the nested product
    merged._id  = rel.product._id  || rel._id;
    merged.slug = rel.product.slug || rel.slug;

    // Ensure category has an object shape `{ _id, name }`
    if (rel.product.category && typeof rel.product.category === 'object') {
      merged.category = rel.product.category;
    } else if (typeof rel.product.category === 'string') {
      merged.category = { _id: rel.product.category, name: '' };
    }

    // Keep relation-level prices as fallbacks if product-level are missing
    if (rel.salesPrice != null && merged.salesPrice == null) merged.salesPrice = rel.salesPrice;
    if (rel.price      != null && merged.price      == null) merged.price      = rel.price;

    return merged;
  }

  // Not populated: just pass through with safe fallbacks so ProductItem can still use SEO
  return {
    ...rel,
    _id: rel.product || rel._id,
    // give category a safe object shape if it exists only as an id
    category: rel.category ? { _id: rel.category, name: '' } : undefined,
  };
};

const RelatedProducts = ({ id, groupcodeId }) => {
  const { data, isError, isLoading } =
    useGetGroupCodeProductsQuery(groupcodeId, { skip: !groupcodeId });

  let content = null;

  if (!groupcodeId) {
    content = <ErrorMsg msg="No group code available for related products" />;
  } else if (isLoading) {
    content = <HomeNewArrivalPrdLoader loading={isLoading} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (!data || !data.data || data.data.length === 0) {
    content = <ErrorMsg msg="No Products found!" />;
  } else {
    // Normalize every relation to a product-like object
    const items = data.data.map(normalizeRelationToProduct).filter(Boolean);

    content = (
      <Swiper
        {...slider_setting}
        modules={[Autoplay, Navigation]}
        className="tp-product-related-slider-active swiper-container mb-10"
      >
        {items.slice(0, 6).map((item) => (
          <SwiperSlide key={item._id}>
            <ProductItem product={item} primary_style />
          </SwiperSlide>
        ))}
      </Swiper>
    );
  }

  return <div className="tp-product-related-slider">{content}</div>;
};

export default RelatedProducts;
