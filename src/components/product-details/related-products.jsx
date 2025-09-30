/* eslint-disable no-unused-vars */
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

import { useGetGroupCodeProductsQuery } from '@/redux/features/newProductApi';
import ErrorMsg from '../common/error-msg';
import { HomeNewArrivalPrdLoader } from '../loader';

/** Normalize relation -> product */
const normalizeRelationToProduct = (rel) => {
  if (!rel) return null;

  if (rel.product && typeof rel.product === 'object') {
    const merged = { ...rel, ...rel.product };
    merged._id = rel.product._id || rel._id;
    merged.slug = rel.product.slug || rel.slug;

    if (rel.product.category && typeof rel.product.category === 'object') {
      merged.category = rel.product.category;
    } else if (typeof rel.product.category === 'string') {
      merged.category = { _id: rel.product.category, name: '' };
    }

    if (rel.salesPrice != null && merged.salesPrice == null) merged.salesPrice = rel.salesPrice;
    if (rel.price != null && merged.price == null) merged.price = rel.price;

    return merged;
  }

  return {
    ...rel,
    _id: rel.product || rel._id,
    category: rel.category ? { _id: rel.category, name: '' } : undefined,
  };
};

const FALLBACK_IMG =
  'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder-square.webp';

const RelatedProducts = ({ groupcodeId }) => {
  const shouldSkip = !groupcodeId || String(groupcodeId).trim() === '';
  const { data, isError, isLoading } = useGetGroupCodeProductsQuery(
    shouldSkip ? '' : groupcodeId,
    { skip: shouldSkip }
  );

  if (shouldSkip) return <ErrorMsg msg="No group code available for related products" />;
  if (isLoading) return <HomeNewArrivalPrdLoader loading />;
  if (isError) return <ErrorMsg msg="There was an error" />;

  const list = (data?.data ?? []).map(normalizeRelationToProduct).filter(Boolean);
  if (!list.length) return <ErrorMsg msg="No Products found!" />;

  return (
    <div className="tp-related-grid">
      <div className="row g-3 g-md-4">
        {list.map((p) => {
          const href = p?.slug ? `/fabric/${p.slug}` : '#';
          const imgSrc =
            p?.img || p?.image || p?.image1 || p?.imageURLs?.[0]?.url || FALLBACK_IMG;

          return (
            <div key={p._id} className="col-6 col-sm-4 col-md-3 col-lg-2">
              <Link href={href} className="card-mini">
                <div className="thumb">
                  <Image src={imgSrc} alt={p?.name || 'Product'} fill sizes="200px" />
                  <span className="thumb-gloss" />
                </div>
                <div className="meta">
                  <h4 className="title" title={p?.name}>
                    {p?.name || 'Untitled Product'}
                  </h4>
                </div>
              </Link>
            </div>
          );
        })}
      </div>

      {/* Scoped styles for this section only */}
      <style jsx>{`
        /* Card base */
        .card-mini {
          --radius: 14px;
          --shadow: 0 1px 6px rgba(0, 0, 0, 0.08);
          --shadow-hover: 0 8px 20px rgba(0, 0, 0, 0.14);

          display: flex;
          flex-direction: column;
          height: 100%;
          border-radius: var(--radius);
          background: #fff;
          text-decoration: none;
          color: inherit;
          border: 1px solid #ececec;
          box-shadow: var(--shadow);
          transition: transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease;
          overflow: hidden;
        }
        .card-mini:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
          border-color: #e2e2e2;
        }

        /* Image area */
        .thumb {
          position: relative;
          width: 100%;
          aspect-ratio: 1 / 1;          /* perfect square */
          overflow: hidden;
          background: #f6f7f9;
        }
        .thumb :global(img) {
          object-fit: cover;
          transform: scale(1);
          transition: transform 220ms ease;
        }
        .card-mini:hover .thumb :global(img) {
          transform: scale(1.04);       /* subtle zoom on hover */
        }

        /* gentle gloss to make images feel premium (like your second ss) */
        .thumb-gloss {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            rgba(255, 255, 255, 0.22) 0%,
            rgba(255, 255, 255, 0.0) 28%,
            rgba(0, 0, 0, 0.03) 100%
          );
          pointer-events: none;
        }

        /* Title block */
        .meta {
          padding: 10px 12px;
          border-top: 1px solid #f0f0f0;
          display: flex;
          align-items: center;
          min-height: 54px;             /* consistent height */
        }
        .title {
          margin: 0;
          font-size: 15px;              /* a touch larger, more readable */
          font-weight: 600;
          line-height: 1.25;
          letter-spacing: 0.2px;
          display: -webkit-box;
          -webkit-line-clamp: 2;        /* show up to two lines */
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        /* Tighten the horizontal rhythm of the grid so gaps look unified */
        .tp-related-grid :global(.row) {
          margin-left: 0;
          margin-right: 0;
        }
      `}</style>
    </div>
  );
};

export default RelatedProducts;
