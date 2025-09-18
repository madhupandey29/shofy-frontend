'use client';

import React, { useEffect, useState, useId, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useDispatch } from 'react-redux';
import { useAuthAction, formatProductForCart, formatProductForWishlist } from '@/utils/authUtils';
import { add_to_wishlist } from '@/redux/features/wishlist-slice';
import { add_cart_product } from '@/redux/features/cartSlice';

import { Cart, QuickView, Wishlist } from '@/svg';
import { handleProductModal } from '@/redux/features/productModalSlice';
import { useGetProductsByGroupcodeQuery } from '@/redux/features/productApi';
import { useGetSeoByProductQuery } from '@/redux/features/seoApi';

/* ───────── helpers ───────── */
const nonEmpty = (v) => {
  if (Array.isArray(v)) return v.length > 0;
  return v !== undefined && v !== null && String(v).trim() !== '';
};
const pick = (...xs) => xs.find(nonEmpty);

const ProductItem = ({ product }) => {
  const router = useRouter();
  const rainbowId = useId();
  const dispatch = useDispatch();
  const { requireAuth } = useAuthAction();

  const [showActions, setShowActions] = useState(false);
  const [supportsHover, setSupportsHover] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setSupportsHover(window.matchMedia('(hover: hover) and (pointer: fine)').matches);
    }
  }, []);

  const handleAddProduct = async (prd, e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    try {
      await requireAuth(async () => {
        const productToAdd = formatProductForCart(prd);
        dispatch(add_cart_product(productToAdd));
      })();
      return true;
    } catch {
      return false;
    }
  };

  const handleWishlistProduct = async (prd, e) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();
    try {
      await requireAuth(async () => {
        const productToAdd = formatProductForWishlist(prd);
        dispatch(add_to_wishlist(productToAdd));
      })();
      return true;
    } catch {
      return false;
    }
  };

  const openQuickView = (prd, e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();
    dispatch(handleProductModal({ ...prd }));
  };

  /* ---------------- image helpers ---------------- */
  const valueToUrlString = (v) => {
    if (!v) return '';
    if (typeof v === 'string') return v.trim();
    if (Array.isArray(v)) return valueToUrlString(v[0]);
    if (typeof v === 'object') return valueToUrlString(v.secure_url || v.url || v.path || v.key);
    return '';
  };
  const isHttpUrl = (s) => /^https?:\/\//i.test(s);

  const imageUrl = useMemo(() => {
    const raw =
      valueToUrlString(product?.image) ||
      valueToUrlString(product?.image1) ||
      valueToUrlString(product?.image2);
    if (!raw) return '/assets/img/product/default-product-img.jpg';
    if (isHttpUrl(raw)) return raw;

    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const clean = (p) =>
      (p || '')
        .replace(/^\/+/, '')
        .replace(/^api\/uploads\/?/, '')
        .replace(/^uploads\/?/, '');
    const prefix = 'uploads';
    return `${base}/${prefix}/${clean(raw)}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product]);

  /* ---------------- title, slug, category ---------------- */
  const productId = product?._id || product?.product?._id || product?.product;

  // fetch SEO (for salesPrice and potential SEO title/slug)
  const { data: seoResp } = useGetSeoByProductQuery(productId, { skip: !productId });
  const seoDoc = Array.isArray(seoResp?.data) ? seoResp?.data?.[0] : seoResp?.data;

  const titleHtml =
    pick(
      product?.name,
      product?.product?.name,
      product?.productname,
      product?.title,
      product?.productTitle,
      seoDoc?.title,
      product?.seoTitle,
      product?.groupcode?.name
    ) || '—';

  const slug =
    product?.slug ||
    product?.product?.slug ||
    seoDoc?.slug ||
    productId;

  const categoryLabel =
    pick(
      product?.category?.name,
      product?.product?.category?.name,
      product?.categoryName,
      seoDoc?.category
    ) || '—';

  /* ---------------- options count (groupcode) ---------------- */
  const groupcodeId = product?.groupcode?._id || product?.groupcode || null;
  const { data: groupItems = [], isFetching, isError } =
    useGetProductsByGroupcodeQuery(groupcodeId, { skip: !groupcodeId });
  const optionCount = Array.isArray(groupItems) ? groupItems.length : 0;
  const showOptionsBadge = !!groupcodeId && !isFetching && !isError && optionCount > 1;

  /* ---------------- price logic (SEO first) ---------------- */
  const formatINR = (n) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(Number(n));

  const effectivePrice =
    (typeof seoDoc?.salesPrice === 'number' ? seoDoc.salesPrice : undefined) ??
    (typeof product?.salesPrice === 'number' ? product.salesPrice : undefined) ??
    (typeof product?.price === 'number' ? product.price : undefined) ??
    null;

  const hasPrice = typeof effectivePrice === 'number' && effectivePrice > 0;

  return (
    <div
      className={`fashion-product-card ${showActions ? 'show-actions' : ''}`}
      onMouseEnter={() => supportsHover && setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
      onTouchStart={() => setShowActions(true)}
    >
      <div className="card-wrapper">
        <div className="product-image-container">
          <Link
            href={`/fabric/${slug}`}
            aria-label={typeof titleHtml === 'string' ? titleHtml : 'View product'}
            className="image-link"
            onClick={(e) => {
              if (!supportsHover && !showActions) {
                e.preventDefault();
                setShowActions(true);
              }
            }}
          >
            <div className="image-wrapper">
              <Image
                src={imageUrl}
                alt={typeof titleHtml === 'string' ? titleHtml : 'product image'}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 320px"
                style={{ objectFit: 'cover' }}
              />
              <div className="image-overlay" />
            </div>
          </Link>

          {showOptionsBadge && (
            <button
              type="button"
              className="premium-badge"
              onClick={() => router.push(`/fabric/${slug}`)}
              aria-label={`${optionCount} options for ${
                typeof titleHtml === 'string' ? titleHtml : 'this product'
              }`}
            >
              <div className="badge-background" />
              <div className="badge-content">
                <div className="icon-container" aria-hidden="true">
                  <svg className="badge-icon" viewBox="0 0 24 24">
                    <defs>
                      <linearGradient id={`spectrum-${rainbowId}`} x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#FF002E" />
                        <stop offset="16%" stopColor="#FF6A00" />
                        <stop offset="33%" stopColor="#FFD400" />
                        <stop offset="50%" stopColor="#00C853" />
                        <stop offset="66%" stopColor="#00E5FF" />
                        <stop offset="83%" stopColor="#2979FF" />
                        <stop offset="100%" stopColor="#D500F9" />
                      </linearGradient>
                      <radialGradient id={`sun-${rainbowId}`} cx="50%" cy="45%" r="60%">
                        <stop offset="0%" stopColor="#FFF8E1" />
                        <stop offset="60%" stopColor="#FFD54F" />
                        <stop offset="100%" stopColor="#FFB300" />
                      </radialGradient>
                    </defs>
                    <circle cx="12" cy="12" r="10.2" fill="none" stroke={`url(#spectrum-${rainbowId})`} strokeWidth="1.4" opacity=".9" />
                    <g className="petal-group">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <path
                          key={i}
                          transform={`rotate(${i * 45} 12 12)`}
                          d="M12 2.6 C 13.6 5.4, 13.6 8.6, 12 11.4 C 10.4 8.6, 10.4 5.4, 12 2.6 Z"
                          fill={`url(#spectrum-${rainbowId})`}
                          stroke="#fff" strokeOpacity=".35" strokeWidth=".4"
                        />
                      ))}
                    </g>
                    <circle cx="12" cy="12" r="3.8" fill={`url(#sun-${rainbowId})`} stroke="#fff" strokeOpacity=".55" strokeWidth=".5" />
                    <circle cx="10.6" cy="10.8" r=".9" fill="#fff" opacity=".9" />
                  </svg>
                </div>
                <span className="badge-text">{optionCount} options</span>
              </div>
            </button>
          )}

          <div className="product-actions">
            <button
              type="button"
              onClick={(e) => handleAddProduct(product, e)}
              className="action-button"
              aria-label="Add to cart"
              title="Add to cart"
            >
              <Cart />
            </button>
            <button
              type="button"
              onClick={(e) => handleWishlistProduct(product, e)}
              className="action-button"
              aria-label="Add to wishlist"
              title="Add to wishlist"
            >
              <Wishlist />
            </button>
            <button
              type="button"
              onClick={(e) => openQuickView(product, e)}
              className="action-button"
              aria-label="Quick view"
              title="Quick view"
            >
              <QuickView />
            </button>
          </div>
        </div>

        <div className="product-info">
          <div className="product-category">{categoryLabel}</div>

          <h3 className="product-title">
            <Link href={`/fabric/${slug}`}>
              <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
            </Link>
          </h3>

          <div className="price-wrapper">
            <span className="current-price">
              {hasPrice ? formatINR(effectivePrice) : '—'}
            </span>
            {/* show old price only if current price exists and is positive */}
            {hasPrice && typeof product?.oldPrice === 'number' ? (
              <span className="original-price">{formatINR(product.oldPrice)}</span>
            ) : null}
          </div>
        </div>
      </div>

      <style jsx>{`
        .fashion-product-card{--primary:#111827;--accent:#7c3aed;--card-bg:#fff;--card-border:rgba(17,24,39,.12);--inner-border:rgba(17,24,39,.08);--shadow-sm:0 1px 2px rgba(0,0,0,.04);--shadow-xl:0 20px 25px rgba(0,0,0,.10),0 10px 10px rgba(0,0,0,.04);position:relative;width:100%;height:100%;transition:transform .3s ease-out,box-shadow .3s ease-out;will-change:transform}
        .fashion-product-card:hover{transform:translateY(-4px)}
        .card-wrapper{position:relative;width:100%;height:100%;background:var(--card-bg);border:3px solid var(--card-border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);transition:box-shadow .3s ease}
        .fashion-product-card:hover .card-wrapper,.fashion-product-card:focus-within .card-wrapper{box-shadow:var(--shadow-xl)}
        .product-image-container{position:relative;aspect-ratio:3/4;min-height:220px;overflow:hidden}
        .image-link{display:block;height:100%}
        .image-wrapper{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.22,1,.36,1);will-change:transform}
        .fashion-product-card:hover .image-wrapper{transform:scale(1.04)}
        .image-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.16) 0%,transparent 40%);z-index:1;pointer-events:none}
        .premium-badge{position:absolute;left:14px;bottom:14px;display:inline-flex;align-items:center;padding:0;border-radius:24px;overflow:hidden;z-index:2;cursor:pointer;border:0;background:transparent;box-shadow:0 4px 16px rgba(0,0,0,.10);transition:transform .25s ease,box-shadow .25s ease}
        .premium-badge:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .premium-badge:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.14)}
        .badge-background{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(255,255,255,.85));backdrop-filter:blur(8px);z-index:1}
        .badge-content{position:relative;z-index:2;display:inline-flex;gap:8px;padding:8px 14px 8px 10px}
        .badge-text{font-size:13px;font-weight:600;color:#111827;letter-spacing:.02em}
        .icon-container{width:28px;height:28px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .badge-icon{width:22px;height:22px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.15));transition:transform .35s ease}
        .petal-group{transform-origin:12px 12px}
        .premium-badge:hover .badge-icon{transform:rotate(8deg) scale(1.03)}
        .product-actions{position:absolute;top:14px;right:14px;display:flex;flex-direction:column;gap:10px;opacity:0;transform:translateY(-8px);transition:opacity .25s ease,transform .25s ease;z-index:2}
        @media (hover:hover) and (pointer:fine){.fashion-product-card:hover .product-actions,.fashion-product-card:focus-within .product-actions{opacity:1;transform:translateY(0)}}
        .fashion-product-card.show-actions .product-actions{opacity:1;transform:translateY(0)}
        .action-button{width:36px;height:36px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.95);backdrop-filter:blur(4px);border:1px solid rgba(0,0,0,.06);box-shadow:0 4px 12px rgba(0,0,0,.08);transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
        .action-button:hover{background:#fff;transform:scale(1.08);box-shadow:0 6px 16px rgba(0,0,0,.12)}
        .action-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .action-button :global(svg){width:16px;height:16px;color:var(--primary);transition:color .2s ease}
        .action-button:hover :global(svg){color:var(--accent)}
        .product-info{padding:clamp(14px,2.2vw,18px);position:relative;z-index:1;border-top:1px solid var(--inner-border);background:#fff}
        .product-category{font-size:11px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;color:var(--accent);margin-bottom:8px}
        .product-title{font-size:clamp(14px,2.2vw,16px);font-weight:600;line-height:1.5;color:var(--primary);margin:0 0 10px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
        .product-title :global(a){color:inherit;text-decoration:none}
        .product-title :global(a:hover){color:var(--accent)}
        .price-wrapper{display:flex;align-items:center;gap:8px}
        .current-price{font-size:clamp(15px,2.2vw,16px);font-weight:700;color:var(--primary)}
        .original-price{font-size:14px;color:#9ca3af;text-decoration:line-through}
        @media (max-width:992px){.product-actions{gap:8px}.action-button{width:34px;height:34px}}
        @media (max-width:768px){.product-image-container{min-height:200px}.action-button{width:32px;height:32px}}
        @media (max-width:480px){.product-image-container{min-height:180px}.action-button{width:30px;height:30px}}
        @media (prefers-reduced-motion:reduce){.fashion-product-card,.image-wrapper{transition:none}}
      `}</style>
    </div>
  );
};

export default ProductItem;
