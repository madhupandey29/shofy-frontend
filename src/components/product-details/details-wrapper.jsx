'use client';

import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetSubstructureQuery } from '@/redux/features/substructureApi';
import { useGetContentByIdQuery }   from '@/redux/features/contentApi';
import { useGetSubfinishQuery }     from '@/redux/features/subfinishApi';
import { useGetSeoByProductQuery }  from '@/redux/features/seoApi';

import { add_to_wishlist } from '@/redux/features/wishlist-slice';

/* small helpers */
const nonEmpty = (v) =>
  v !== undefined && v !== null && (typeof v === 'number' || String(v).trim() !== '');
const pick = (...xs) => xs.find(nonEmpty);

/* lookup mini-components */
const StructureInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubstructureQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Structure: </span><p>{value}</p>
    </div>
  );
};

const ContentInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetContentByIdQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Content: </span><p>{value}</p>
    </div>
  );
};

const FinishInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubfinishQuery(id, { skip: !id });
  if (!id) return null;
  const value = isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Finish: </span><p>{value}</p>
    </div>
  );
};

const DetailsWrapper = ({ productItem = {} }) => {
  const {
    _id,
    title,
    category,
    newCategoryId,
    description,
    status,
    structureId,
    contentId,
    finishId,
    gsm,
    width,
  } = productItem;

  // 🔹 Get SKU from SEO (with fallbacks)
  /* const { data: seoResp } = useGetSeoByProductQuery(_id, { skip: !_id });
  const seoDoc  = Array.isArray(seoResp?.data) ? seoResp?.data?.[0] : (seoResp?.data || seoResp);
  const seoSku  = pick(
    seoDoc?.identifier,
    seoDoc?.sku,
    seoDoc?.productIdentifier,
    seoDoc?.productCode,
    seoDoc?.code
  );
  const skuValue = pick(seoSku);
 */
  const dispatch = useDispatch();
  const { wishlist } = useSelector(state => state.wishlist);
  const isInWishlist = wishlist.some(prd => prd._id === _id);

  const toggleWishlist = () => dispatch(add_to_wishlist(productItem));

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category?.name || newCategoryId?.name}</span>
      </div>

      <h3
        className="tp-product-details-title"
        dangerouslySetInnerHTML={{ __html: title }}
      />

      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10">
          <span>{status}</span>
        </div>
      </div>

      <p dangerouslySetInnerHTML={{ __html: description }} />

      <div className="tp-product-details-query" style={{ marginBottom: 20 }}>
       {/*  {skuValue && (
          <div className="tp-product-details-query-item d-flex align-items-center">
            <span>SKU: </span><p>{skuValue}</p>
          </div>
        )} */}

        <StructureInfo id={structureId} />
        <ContentInfo   id={contentId}   />

        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>GSM: </span><p>{gsm}</p>
        </div>
        <div className="tp-product-details-query-item d-flex align-items-center">
          <span>Width: </span><p>{width}</p>
        </div>

        <FinishInfo id={finishId} />
      </div>

      <div className="tp-product-details-action-wrapper">
        <div
          className="tp-product-details-action-item-wrapper d-flex align-items-center"
          style={{ gap: 10 }}
        >
          <div className="d-flex" style={{ flexGrow: 1, gap: 10 }}>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">
              Request Sample
            </button>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">
              Request Quote
            </button>
          </div>

          <button
            type="button"
            onClick={toggleWishlist}
            className={`tp-product-details-wishlist-btn tp-details-btn-hover ${isInWishlist ? 'active' : ''}`}
            aria-label="Add to Wishlist"
            style={{
              background: '#fff',
              border: '1px solid #E4E8EB',
              borderRadius: '50%',
              padding: 8,
              fontSize: 24,
              color: isInWishlist ? 'red' : '#bbb',
              transition: 'color .2s',
              lineHeight: 1,
            }}
            onMouseOver={e => (e.currentTarget.style.color = 'red')}
            onMouseOut={e => (e.currentTarget.style.color = isInWishlist ? 'red' : '#bbb')}
          >
            <i className={isInWishlist ? 'fas fa-heart' : 'far fa-heart'} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailsWrapper;