'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import ReactModal from 'react-modal';

import { handleModalClose } from '@/redux/features/productModalSlice';
import DetailsThumbWrapper from '@/components/product-details/details-thumb-wrapper';
import DetailsWrapper from '@/components/product-details/details-wrapper';
import { initialOrderQuantity } from '@/redux/features/cartSlice';

if (typeof window !== 'undefined') {
  ReactModal.setAppElement('body');
}

/* ---------- helpers ---------- */
const toUrl = (v) => {
  if (!v) return '';
  if (typeof v === 'string') return v;
  if (Array.isArray(v)) return toUrl(v[0]);
  if (typeof v === 'object') return toUrl(v.secure_url || v.url || v.path || v.key);
  return '';
};
const idOf = (v) => (v && typeof v === 'object' ? v._id : v);

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    height: 'calc(100% - 300px)',
  },
};

export default function ProductModal() {
  const dispatch = useDispatch();
  const { productItem, isModalOpen, nonce } = useSelector((s) => s.productModal);

  // 🔧 Normalize product to match DetailsWrapper’s expectations
  const normalized = useMemo(() => {
    const p = productItem || {};
    return {
      ...p,
      // the details component reads these:
      title: p.title || p.name || '',
      category: p.category || p.newCategoryId,
      structureId: p.structureId || idOf(p.substructure) || idOf(p.structure),
      contentId:   p.contentId   || idOf(p.content),
      finishId:    p.finishId    || idOf(p.subfinish) || idOf(p.finish),
      gsm: p.gsm ?? p.GSM,
      width: p.width ?? p.widthCm ?? p.Width,
      slug: p.slug || p._id,
    };
  }, [productItem]);

  // Build gallery items from original `productItem`
  const imageURLs = useMemo(() => {
    if (!productItem) return [];
    const items = [
      productItem?.image  && { img: toUrl(productItem.image),  type: 'image' },
      productItem?.image1 && { img: toUrl(productItem.image1), type: 'image' },
      productItem?.image2 && { img: toUrl(productItem.image2), type: 'image' },
    ].filter(Boolean);
    if (productItem?.video) {
      items.push({ img: '/assets/img/product/-video-thumb.png', type: 'video' });
    }
    return items;
  }, [productItem]);

  const mainImg = productItem?.img || imageURLs[0]?.img || '';
  const [activeImg, setActiveImg] = useState(mainImg);

  useEffect(() => {
    setActiveImg(mainImg);
    if (productItem) dispatch(initialOrderQuantity());
  }, [mainImg, productItem, dispatch]);

  const handleImageActive = (item) => setActiveImg(item.img);

  if (!normalized || !isModalOpen) return null;

  // 🔑 Remount on product switch
  const modalKey = `${normalized._id || normalized.slug || 'item'}-${nonce ?? 0}`;

  return (
    <ReactModal
      key={modalKey}
      isOpen={true}
      onRequestClose={() => dispatch(handleModalClose())}
      style={customStyles}
      shouldCloseOnOverlayClick
      bodyOpenClassName="ReactModal__Body--open"
      contentLabel="Product Modal"
    >
      <button
        onClick={() => dispatch(handleModalClose())}
        type="button"
        className="tp-product-modal-close-btn"
        aria-label="Close quick view"
      >
        <i className="fa-regular fa-xmark" />
      </button>

      <div key={`content-${modalKey}`} className="tp-product-modal-content d-lg-flex">
        <DetailsThumbWrapper
          key={`thumbs-${modalKey}`}
          activeImg={activeImg}
          handleImageActive={handleImageActive}
          imageURLs={imageURLs}
          imgWidth={400}
          imgHeight={400}
          status={normalized?.status}
          videoId={productItem?.video}
        />

        {/* 👇 now gets structureId/contentId/finishId/title/etc. */}
        <DetailsWrapper
          key={`details-${modalKey}`}
          productItem={normalized}
          handleImageActive={handleImageActive}
          activeImg={activeImg}
        />
      </div>

      {normalized?._id && (
        <div style={{ textAlign: 'center', marginTop: 16 }}>
          <a
            href={`/fabric/${normalized.slug}`}
            className="tp-btn tp-btn-blue"
            style={{ padding: '8px 24px', fontWeight: 600 }}
          >
            View Details
          </a>
        </div>
      )}
    </ReactModal>
  );
}
