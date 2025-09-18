'use client';
import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
// If not loaded globally, uncomment:
// import 'swiper/css';
// import 'swiper/css/navigation';

import { Rating } from 'react-simple-star-rating';
import Link from 'next/link';

import { useGetTopRatedQuery } from '@/redux/features/newProductApi';
import { ArrowRightLong, NextLongArr, PrevLongArr, TextShapeLine } from '@/svg';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoFeaturedPrdLoader } from '@/components/loader';

/* ---------------- slider options ---------------- */
const slider_setting = {
  slidesPerView: 3,
  spaceBetween: 10,
  // ✅ Use selectors; do NOT call destroy/init or set navigation: true
  navigation: { enabled: true, prevEl: '.tp-nav-prev', nextEl: '.tp-nav-next' },
  breakpoints: {
    1200: { slidesPerView: 3 },
    992:  { slidesPerView: 3 },
    768:  { slidesPerView: 2 },
    576:  { slidesPerView: 1 },
    0:    { slidesPerView: 1 },
  },
  keyboard: { enabled: true, onlyInViewport: true },
};

/* ---------------- robust image helpers ---------------- */
const isAbsUrl = (s) => /^(https?:)?\/\//i.test(s || '');
const pickUrlDeep = function pick(v) {
  if (!v) return '';
  if (typeof v === 'string') {
    const s = v.trim().replace(/\s+/g, '');
    return s.startsWith('//') ? `https:${s}` : s;
  }
  if (Array.isArray(v)) { for (const x of v) { const got = pick(x); if (got) return got; } return ''; }
  if (typeof v === 'object') {
    const direct = v.secure_url || v.url || v.path || v.key || v.src || v.publicUrl || v.imageUrl;
    const fromDirect = pick(direct); if (fromDirect) return fromDirect;
    for (const val of Object.values(v)) { const got = pick(val); if (got) return got; }
    return '';
  }
  return '';
};
function absoluteUrlFromAnything(src) {
  const raw = pickUrlDeep(src);
  if (!raw) return ''; if (isAbsUrl(raw)) return raw;
  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  const clean = String(raw).replace(/^\/+/, '').replace(/^api\/+/, '');
  return base ? `${base}/${clean}` : `/${clean}`;
}
function getImageUrl(item) {
  const p = item?.product || item;
  return (
    absoluteUrlFromAnything(p?.img) ||
    absoluteUrlFromAnything(p?.image) ||
    absoluteUrlFromAnything(p?.images) ||
    absoluteUrlFromAnything(p?.thumbnail) ||
    absoluteUrlFromAnything(p?.cover) ||
    absoluteUrlFromAnything(p?.photo) ||
    absoluteUrlFromAnything(p?.picture) ||
    absoluteUrlFromAnything(p?.media) ||
    absoluteUrlFromAnything(p?.featuredImage) ||
    absoluteUrlFromAnything(p?.defaultImage) ||
    '/assets/img/product/default-product-img.jpg'
  );
}

const WeeksFeatured = () => {
  const { data: products, isError, isLoading } = useGetTopRatedQuery();

  let content = null;
  if (isLoading) content = <HomeTwoFeaturedPrdLoader loading />;
  else if (isError) content = <ErrorMsg msg="There was an error" />;
  else if (!products?.data?.length) content = <ErrorMsg msg="No Products found!" />;
  else {
    const items = products.data;

    content = (
      <Swiper {...slider_setting} modules={[Navigation]} className="tp-featured-slider-active">
        {items.map((item, idx) => {
          const p = item?.product || item;
          const pid = p?._id || item?._id;
          const title = p?.name || item?.title || 'Product';
          const price =
            p?.salesPrice ?? p?.purchasePrice ?? item?.salesPrice ?? item?.purchasePrice ?? item?.price ?? 0;

          const reviews = Array.isArray(p?.reviews) ? p.reviews : Array.isArray(item?.reviews) ? item.reviews : [];
          const avgRating = reviews.length ? reviews.reduce((a, r) => a + Number(r.rating || 0), 0) / reviews.length : 0;

          const bg = getImageUrl(item);
          const productSlug = p?.slug || pid;
          const detailsHref = `/fabric/${encodeURIComponent(productSlug)}`;

          return (
            <SwiperSlide key={item._id || pid || idx} className="tp-featured-item white-bg p-relative z-index-1">
              <div className="tp-featured-thumb include-bg" aria-label={title} style={{ backgroundImage: `url(${bg})` }} />
              <div className="tp-featured-content">
                <h3 className="tp-featured-title"><Link href={detailsHref}>{title}</Link></h3>
                <div className="tp-featured-price-wrapper">
                  <span className="tp-featured-price new-price">${Number(price).toFixed(2)}</span>
                </div>
                <div className="tp-product-rating-icon tp-product-rating-icon-2">
                  <Rating allowFraction size={16} initialValue={avgRating} readonly />
                </div>
                <div className="tp-featured-btn">
                  <Link href={detailsHref} className="tp-btn tp-btn-border tp-btn-border-sm">
                    Shop Now <ArrowRightLong />
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          );
        })}

        {/* ✅ Custom black arrows placed INSIDE Swiper so they exist at init */}
        <div className="tp-featured-slider-arrow mt-45">
          <button className="tp-nav-prev"><PrevLongArr /></button>
          <button className="tp-nav-next"><NextLongArr /></button>
        </div>
      </Swiper>
    );
  }

  return (
    <section className="tp-featured-slider-area grey-bg-6 fix pt-95 pb-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 mb-50">
              <span className="tp-section-title-pre-2">
                On-Trend Textures <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">The Ultimate Fabric Edit</h3>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-featured-slider">{content}</div>
          </div>
        </div>
      </div>

      {/* Safety: hide default arrows if any CSS injects them */}
      <style jsx global>{`
        .tp-featured-slider .swiper-button-prev,
        .tp-featured-slider .swiper-button-next { display: none !important; }
      `}</style>
    </section>
  );
};

export default WeeksFeatured;
