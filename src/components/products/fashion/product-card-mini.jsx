// components/products/fashion/product-card-mini.jsx
'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

const FALLBACK_IMG =
  'https://res.cloudinary.com/demo/image/upload/v1690000000/placeholder-square.webp';

const ProductCardMini = ({ product }) => {
  const href = product?.slug ? `/fabric/${product.slug}` : '#';
  const imgSrc =
    product?.img ||
    product?.image ||
    product?.image1 ||
    product?.imageURLs?.[0]?.url ||
    FALLBACK_IMG;

  return (
    <Link href={href} className="mini-card">
      <div className="thumb">
        <Image
          src={imgSrc}
          alt={product?.name || 'Product'}
          fill
          sizes="200px"
        />
      </div>
      <div className="info">
        <h4 className="name">{product?.name || 'Untitled Product'}</h4>
      </div>

      <style jsx>{`
        .mini-card {
          display: flex;
          flex-direction: column;
          border-radius: 8px;
          overflow: hidden;
          background: #fff;
          box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
          text-decoration: none;
          color: inherit;
          transition: transform 0.15s ease;
        }
        .mini-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.12);
        }
        .thumb {
          position: relative;
          width: 100%;
          padding-top: 100%; /* square */
          background: #f5f5f5;
        }
        .thumb :global(img) {
          object-fit: cover;
        }
        .info {
          padding: 8px 10px;
        }
        .name {
          font-size: 14px;
          font-weight: 500;
          line-height: 1.3;
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
      `}</style>
    </Link>
  );
};

export default ProductCardMini;
