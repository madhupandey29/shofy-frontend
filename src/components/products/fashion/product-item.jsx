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

/* helpers */
const nonEmpty = (v) => (Array.isArray(v) ? v.length > 0 : v !== undefined && v !== null && String(v).trim() !== '');
const pick = (...xs) => xs.find(nonEmpty);
const toText = (v) => {
  if (v == null) return '';
  if (typeof v === 'string' || typeof v === 'number') return String(v);
  if (Array.isArray(v)) return v.map(toText).filter(Boolean).join(', ');
  if (typeof v === 'object') return toText(v.name ?? v.value ?? v.title ?? v.label ?? '');
  return '';
};
const isNoneish = (s) => {
  if (!s) return true;
  const t = String(s).trim().toLowerCase().replace(/\s+/g, ' ');
  return t === 'none' || t === 'na' || t === 'none/ na' || t === 'none / na' || t === 'n/a' || t === '-';
};
const round = (n, d = 1) => (isFinite(n) ? Number(n).toFixed(d).replace(/\.0+$/, '') : '');
const gsmToOz = (gsm) => gsm * 0.0294935;
const cmToInch = (cm) => cm / 2.54;
const uniq = (arr) => {
  const seen = new Set();
  return arr.filter((x) => {
    const k = String(x).trim().toLowerCase();
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
};

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
    e?.stopPropagation?.(); e?.preventDefault?.();
    try {
      await requireAuth(async () => {
        const productToAdd = formatProductForCart(prd);
        dispatch(add_cart_product(productToAdd));
      })();
      return true;
    } catch { return false; }
  };

  const handleWishlistProduct = async (prd, e) => {
    e?.stopPropagation?.(); e?.preventDefault?.();
    try {
      await requireAuth(async () => {
        const productToAdd = formatProductForWishlist(prd);
        dispatch(add_to_wishlist(productToAdd));
      })();
      return true;
    } catch { return false; }
  };

  const openQuickView = (prd, e) => {
    e?.preventDefault?.(); e?.stopPropagation?.();
    dispatch(handleProductModal({ ...prd }));
  };

  /* image helpers */
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
      valueToUrlString(product?.img) ||
      valueToUrlString(product?.image1) ||
      valueToUrlString(product?.image2);
    if (!raw) return '/assets/img/product/default-product-img.jpg';
    if (isHttpUrl(raw)) return raw;
    const base = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/$/, '');
    const clean = (p) => (p || '').replace(/^\/+/, '').replace(/^api\/uploads\/?/, '').replace(/^uploads\/?/, '');
    return `${base}/uploads/${clean(raw)}`;
  }, [product]);

  /* title, slug, category */
  const productId = product?._id || product?.product?._id || product?.product;
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

  const slug = product?.slug || product?.product?.slug || seoDoc?.slug || productId;

  const categoryLabel =
    pick(
      product?.category?.name,
      product?.product?.category?.name,
      product?.categoryName,
      seoDoc?.category
    ) || '';

  /* options count */
  const groupcodeId = product?.groupcode?._id || product?.groupcode || null;
  const { data: groupItems = [], isFetching, isError } =
    useGetProductsByGroupcodeQuery(groupcodeId, { skip: !groupcodeId });
  const optionCount = Array.isArray(groupItems) ? groupItems.length : 0;
  const showOptionsBadge = !!groupcodeId && !isFetching && !isError && optionCount > 1;

  /* values */
  const fabricTypeVal =
    toText(pick(product?.fabricType, product?.fabric_type, seoDoc?.fabricType)) || 'Woven Fabrics';
  const contentVal = toText(pick(product?.content, product?.contentName, product?.content_label, seoDoc?.content));
  const gsm = Number(pick(product?.gsm, product?.weightGsm, product?.weight_gsm));
  const weightVal = isFinite(gsm) && gsm > 0 ? `${round(gsm)} gsm / ${round(gsmToOz(gsm))} oz` : toText(product?.weight);
  const designVal = toText(pick(product?.design, product?.designName, seoDoc?.design));
  const colorsVal = toText(pick(product?.colors, product?.color, product?.colorName, seoDoc?.colors));
  const widthCm = Number(pick(product?.widthCm, product?.width_cm, product?.width));
  const widthVal = isFinite(widthCm) && widthCm > 0 ? `${round(widthCm,0)} cm / ${round(cmToInch(widthCm),0)} inch` : toText(product?.widthLabel);
  const finishVal = toText(pick(product?.finish, product?.subfinish?.name, product?.finishName, seoDoc?.finish));
  const structureVal = toText(pick(product?.structure, product?.substructure?.name, product?.structureName, seoDoc?.structure));
  const motifVal = toText(pick(product?.motif, product?.motifName, seoDoc?.motif));
  const leadTimeVal = toText(pick(product?.leadTime, product?.lead_time, seoDoc?.leadTime));

  const details = uniq(
    [fabricTypeVal, contentVal, weightVal, designVal, colorsVal, widthVal, finishVal, structureVal, motifVal, leadTimeVal]
      .filter((v) => nonEmpty(v) && !isNoneish(v))
  );

  const mid = Math.ceil(details.length / 2);
  const leftDetails = details.slice(0, mid);
  const rightDetails = details.slice(mid);

  const showCategory =
    categoryLabel &&
    String(categoryLabel).trim().toLowerCase() !== String(fabricTypeVal).trim().toLowerCase();

  return (
    <div className="product-col">
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
                  className="img-main"
                  priority={false}
                />
                <div className="image-overlay" />
              </div>
            </Link>

            {showOptionsBadge && (
              <button
                type="button"
                className="premium-badge"
                onClick={() => router.push(`/fabric/${slug}`)}
                aria-label={`${optionCount} options for ${typeof titleHtml === 'string' ? titleHtml : 'this product'}`}
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
              <button type="button" onClick={(e) => handleAddProduct(product, e)} className="action-button" aria-label="Add to cart" title="Add to cart">
                <Cart />
              </button>
              <button type="button" onClick={(e) => handleWishlistProduct(product, e)} className="action-button" aria-label="Add to wishlist" title="Add to wishlist">
                <Wishlist />
              </button>
              <button type="button" onClick={(e) => openQuickView(product, e)} className="action-button" aria-label="Quick view" title="Quick view">
                <QuickView />
              </button>
            </div>
          </div>

          <div className="product-info">
            {showCategory ? <div className="product-category">{categoryLabel}</div> : null}

            <h3 className="product-title">
              <Link href={`/fabric/${slug}`}>
                <span dangerouslySetInnerHTML={{ __html: titleHtml }} />
              </Link>
            </h3>

            {details.length ? (
              <div className="spec-columns">
                <ul className="spec-col">
                  {leftDetails.map((v, i) => (
                    <li key={i} className="spec-row" title={v}>
                      <span className="spec-value">{v}</span>
                    </li>
                  ))}
                </ul>
                <ul className="spec-col">
                  {rightDetails.map((v, i) => (
                    <li key={i} className="spec-row" title={v}>
                      <span className="spec-value">{v}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </div>

      <style jsx>{`
        /* ===== GRID LAYOUT (4 / 2 / 1) ===== */
        :global(.products-grid){
          display:flex;
          flex-wrap:wrap;
          margin-left:-12px;
          margin-right:-12px;
        }
        :global(.products-grid .product-col){
          flex:0 0 25%;
          max-width:25%;
          padding:0 12px;
          box-sizing:border-box;
        }
        @media (max-width:991px){
          :global(.products-grid .product-col){ flex:0 0 50%; max-width:50%; }
        }
        @media (max-width:575px){
          :global(.products-grid .product-col){ flex:0 0 100%; max-width:100%; padding:0 8px; }
          :global(.products-grid){ margin-left:-8px; margin-right:-8px; }
        }

        /* ===== CARD STYLES ===== */
        .fashion-product-card{
          --primary:#0f172a; --muted:#6b7280; --accent:#7c3aed;
          --card-bg:#fff; --card-border:rgba(17,24,39,.12); --inner-border:rgba(17,24,39,.08);
          --shadow-sm:0 1px 2px rgba(0,0,0,.04);
          --shadow-xl:0 20px 25px rgba(0,0,0,.10),0 10px 10px rgba(0,0,0,.04);
          --title-font:'Montserrat',system-ui,Arial,sans-serif;
          --detail-font:'Roboto',system-ui,Arial,sans-serif;
          position:relative;width:100%;height:100%;
          transition:transform .3s ease-out,box-shadow .3s ease-out;will-change:transform
        }
        .fashion-product-card:hover{transform:translateY(-2px)}
        .card-wrapper{position:relative;width:100%;height:100%;background:var(--card-bg);border:2px solid var(--card-border);border-radius:14px;overflow:hidden;box-shadow:var(--shadow-sm);transition:box-shadow .3s ease}

        .product-image-container{position:relative;aspect-ratio:1/1;min-height:220px;overflow:hidden}
        .image-link{display:block;height:100%}
        .image-wrapper{position:relative;width:100%;height:100%;transition:transform .6s cubic-bezier(.22,1,.36,1);will-change:transform;background:#fff}
        .fashion-product-card:hover .image-wrapper{transform:scale(1.02)}
        :global(.img-main){position:absolute;inset:0;object-fit:cover;}
        .image-overlay{position:absolute;inset:0;background:linear-gradient(to top,rgba(0,0,0,.16) 0%,transparent 40%);z-index:2;pointer-events:none}

        .premium-badge{
          position:absolute; left:12px; bottom:-12px;
          display:inline-flex;align-items:center;padding:0;border-radius:24px;overflow:hidden;
          z-index:5;cursor:pointer;border:0;background:transparent;
          box-shadow:0 4px 16px rgba(0,0,0,.10);transition:transform .25s ease,box-shadow .25s ease;
        }
        .premium-badge:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .premium-badge:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(0,0,0,.14)}
        .badge-background{position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(255,255,255,.88));backdrop-filter:blur(8px);z-index:1}
        .badge-content{position:relative;z-index:2;display:inline-flex;gap:8px;padding:6px 12px 6px 8px}
        .badge-text{font-size:12.5px;font-weight:600;color:#111827;letter-spacing:.01em}
        .icon-container{width:24px;height:24px;border-radius:50%;display:grid;place-items:center;background:#fff;border:1px solid rgba(0,0,0,.06);box-shadow:0 2px 8px rgba(0,0,0,.12)}
        .badge-icon{width:18px;height:18px;display:block;filter:drop-shadow(0 1px 2px rgba(0,0,0,.15));transition:transform .35s ease}
        .petal-group{transform-origin:12px 12px}
        .premium-badge:hover .badge-icon{transform:rotate(6deg) scale(1.02)}

        .product-actions{position:absolute;top:12px;right:12px;display:flex;flex-direction:column;gap:8px;opacity:0;transform:translateY(-6px);transition:opacity .25s ease,transform .25s ease;z-index:3}
        @media (hover:hover) and (pointer:fine){.fashion-product-card:hover .product-actions,.fashion-product-card:focus-within .product-actions{opacity:1;transform:translateY(0)}}
        .fashion-product-card.show-actions .product-actions{opacity:1;transform:translateY(0)}
        .action-button{width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:rgba(255,255,255,.95);backdrop-filter:blur(4px);border:1px solid rgba(0,0,0,.06);box-shadow:0 4px 12px rgba(0,0,0,.08);transition:transform .2s ease,box-shadow .2s ease,background .2s ease}
        .action-button:hover{background:#fff;transform:scale(1.06);box-shadow:0 6px 16px rgba(0,0,0,.12)}
        .action-button:focus-visible{outline:2px solid var(--accent);outline-offset:2px}
        .action-button :global(svg){width:14px;height:14px;color:var(--primary);transition:color .2s ease}
        .action-button:hover :global(svg){color:#7c3aed}

        .product-info{padding:14px 12px 12px;border-top:1px solid var(--inner-border);background:#fff}
        @media (max-width:480px){ .product-info{ padding:12px 10px 10px; } }

        .product-category{font-family: var(--detail-font);font-size:11px;font-weight:600;letter-spacing:.02em;color:#6b7280;margin-bottom:4px;}

        .product-title{
          font-family: var(--title-font);
          font-size: clamp(14px, 1.9vw, 16px);
          font-weight: 700; line-height: 1.22; letter-spacing: .002em;
          color: #111827; margin: 0 0 6px;
          display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;word-break:break-word;
        }
        .product-title :global(a){color:inherit;text-decoration:none}
        .product-title :global(a:hover){color:#7c3aed}

        .spec-columns{ display:grid; grid-template-columns:1fr 1fr; gap:0 16px; margin-top:4px; }
        @media (max-width:340px){ .spec-columns{ grid-template-columns:1fr; } }

        .spec-col{ list-style:none; margin:0; padding:0; }
        .spec-row{ display:block; padding:5px 0; border-bottom:1px dashed rgba(17,24,39,.06); }
        .spec-row:last-child{ border-bottom:0; }

        .spec-value{ font-family: var(--detail-font); font-size: 12.5px; font-weight: 500; color:#374151; line-height: 1.28; letter-spacing: .005em; white-space: normal; word-break: break-word; }

        .price-wrapper{display:none}
      `}</style>
    </div>
  );
};

export default ProductItem;
