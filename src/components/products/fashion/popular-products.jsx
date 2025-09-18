'use client';
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Scrollbar } from 'swiper/modules';

// If not imported globally, uncomment these:
// import 'swiper/css';
// import 'swiper/css/scrollbar';

import { useDispatch, useSelector } from 'react-redux';
import { TextShapeLine } from '@/svg';
import ErrorMsg from '@/components/common/error-msg';
import { HomeTwoPopularPrdLoader } from '@/components/loader';
import { useGetPopularNewProductsQuery } from '@/redux/features/newProductApi';
import { add_cart_product } from '@/redux/features/cartSlice';
import { notifyError } from '@/utils/toast';

/* ---------- helpers ---------- */
const isAbsUrl = (s) => /^(https?:)?\/\//i.test(s || '');
const pickUrlDeep = function pick(v) {
  if (!v) return '';
  if (typeof v === 'string') {
    const s = v.trim().replace(/\s+/g, '');
    return s.startsWith('//') ? `https:${s}` : s;
  }
  if (Array.isArray(v)) {
    for (const x of v) { const got = pick(x); if (got) return got; }
    return '';
  }
  if (typeof v === 'object') {
    const direct = v.secure_url || v.url || v.path || v.key || v.src || v.publicUrl || v.imageUrl;
    const fromDirect = pick(direct);
    if (fromDirect) return fromDirect;
    for (const val of Object.values(v)) { const got = pick(val); if (got) return got; }
    return '';
  }
  return '';
};

function absoluteUrlFromAnything(src) {
  const raw = pickUrlDeep(src);
  if (!raw) return '';
  if (isAbsUrl(raw)) return raw;

  const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
  const clean = String(raw).replace(/^\/+/, '').replace(/^api\/uploads\/?/, '').replace(/^uploads\/?/, '');
  return base ? `${base}/uploads/${clean}` : `/${clean}`;
}

function getItemImage(item) {
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
    ''
  );
}

/* ---------- slider options (no autoplay) ---------- */
const SLIDER_OPTS = {
  spaceBetween: 24,          // gap between slides (use this, not slide padding)
  rewind: true,
  speed: 600,
  centeredSlides: false,
  scrollbar: {
    el: '.swiper-scrollbar',
    draggable: true,
    snapOnRelease: true,
  },
  // Make gutters responsive. DO NOT set slidesOffsetBefore/After at top-level.
  breakpoints: {
    1200: { slidesPerView: 5, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
    992:  { slidesPerView: 4, slidesOffsetBefore: 16, slidesOffsetAfter: 16 },
    768:  { slidesPerView: 3, slidesOffsetBefore: 12, slidesOffsetAfter: 12 },
    576:  { slidesPerView: 2, slidesOffsetBefore: 8,  slidesOffsetAfter: 8  },
    0:    { slidesPerView: 1, slidesOffsetBefore: 8,  slidesOffsetAfter: 8  },
  },
  keyboard: { enabled: true, onlyInViewport: true },
};

export default function PopularProducts() {
  const { data, isError, isLoading } = useGetPopularNewProductsQuery();
  const { cart_products } = useSelector((s) => s.cart);
  const dispatch = useDispatch();

  const addToCart = (prd) => {
    if (prd?.status === 'out-of-stock') {
      notifyError('This product is out of stock');
      return;
    }
    dispatch(add_cart_product(prd));
  };

  let carousel = <ErrorMsg msg="No Products found!" />;
  if (isLoading) carousel = <HomeTwoPopularPrdLoader loading />;
  if (!isLoading && isError) carousel = <ErrorMsg msg="There was an error" />;

  if (!isLoading && !isError && data?.success && Array.isArray(data.data) && data.data.length) {
    const items = data.data;

    carousel = (
      <Swiper {...SLIDER_OPTS} modules={[Scrollbar]} className="tp-category-slider-active-2">
        {items.map((seoDoc, idx) => {
          const p = seoDoc.product || seoDoc;
          const src = getItemImage(seoDoc) || '/assets/img/product/product-1.jpg';
          const pid = p?._id;
          const pname = p?.name ?? 'Product';
          const price = p?.salesPrice || p?.purchasePrice || seoDoc?.salesPrice || seoDoc?.purchasePrice || 0;

          return (
            <SwiperSlide key={seoDoc._id || pid || idx}>
              <div className="tp-category-item-2 text-center tp-slide-card"> {/* safe padding here */}
                <div className="tp-category-thumb-2">
                  <Link href={`/product-details/${pid}`} className="uniform-tile">
                    <Image
                      src={src}
                      alt={pname}
                      fill
                      sizes="(max-width: 768px) 60vw, 224px"
                      priority={idx === 0}
                      loading={idx === 0 ? undefined : 'lazy'}
                      quality={60}
                      className="uniform-img"
                    />
                  </Link>
                </div>

                <div className="tp-category-content-2">
                  <span>From ${price}</span>
                  <h3 className="tp-category-title-2">
                    <Link href={`/product-details/${pid}`}>{pname?.slice(0, 15)}</Link>
                  </h3>
                  <div className="tp-category-btn-2">
                    {cart_products.some((cp) => cp._id === pid) ? (
                      <Link href="/cart" className="tp-btn tp-btn-border">View Cart</Link>
                    ) : (
                      // eslint-disable-next-line jsx-a11y/anchor-is-valid
                      <a onClick={() => addToCart(p)} className="tp-btn tp-btn-border">Add to Cart</a>
                    )}
                  </div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
        <div className="swiper-scrollbar" />
      </Swiper>
    );
  }

  return (
    <section className="tp-category-area pb-95 pt-95">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-50">
              <span className="tp-section-title-pre-2">
                Most Loved by Designers
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Our Top-Rated Yarns &amp; Weaves</h3>
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-xl-12">
            <div className="tp-category-slider-2 p-relative">
              {carousel}
            </div>
          </div>
        </div>
      </div>

      {/* ✅ Responsive-safe spacing (do NOT pad .swiper-slide) */}
      <style jsx global>{`
        /* Breathing room below this section */
        .tp-category-area { margin-bottom: 48px; }

        /* Keep swiper content clipped horizontally to avoid overflow on small screens */
        .tp-category-slider-2 .swiper {
          padding: 6px 8px 24px;  /* top | sides | bottom (room for scrollbar) */
          overflow: hidden;       /* was visible -> causes horizontal overflow */
        }

        /* DO NOT pad .swiper-slide; pad the inner card instead */
        .tp-slide-card {
          padding: 4px;                      /* safe inner padding */
          box-sizing: border-box;
        }

        /* Scrollbar styling */
        .tp-category-slider-2 .swiper-scrollbar {
          height: 4px;
          margin: 10px 8px 0;
        }

        .tp-category-item-2 .tp-category-thumb-2 { margin-bottom: 10px; }

        /* Uniform image tile */
        .uniform-tile{
          position: relative;
          width: 100%;
          aspect-ratio: 224 / 260;
          background: #f3f4f6;
          border-radius: 12px;
          overflow: hidden;
          display: grid;
          place-items: center;
        }
        .uniform-img{ object-fit: contain !important; }
      `}</style>
    </section>
  );
}
