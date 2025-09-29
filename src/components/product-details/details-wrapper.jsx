'use client';

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetSubstructureQuery } from '@/redux/features/substructureApi';
import { useGetContentByIdQuery }   from '@/redux/features/contentApi';
import { useGetSubfinishQuery }     from '@/redux/features/subfinishApi';
import { useGetSeoByProductQuery }  from '@/redux/features/seoApi';

import { add_to_wishlist } from '@/redux/features/wishlist-slice';

/* --------------------------------
   Small helpers
--------------------------------- */
const nonEmpty = (v) =>
  v !== undefined && v !== null && (typeof v === 'number' || String(v).trim() !== '');

const pick = (...xs) => xs.find(nonEmpty);

const asNumber = (value) => {
  if (value === undefined || value === null) return undefined;
  const n = Number(String(value).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

const isObjId = (s) => typeof s === 'string' && /^[a-f\d]{24}$/i.test(s);

/* --------------------------------
   Reuse your lookup mini-components
--------------------------------- */
const StructureInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubstructureQuery(id, { skip: !id });
  const value = !id
    ? 'N/A'
    : isLoading
    ? 'Loading…'
    : (isError || !data?.data?.name) ? 'N/A' : data.data.name;

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Structure: </span><p>{value}</p>
    </div>
  );
};

const ContentInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetContentByIdQuery(id, { skip: !id });
  const value = !id
    ? 'N/A'
    : isLoading
    ? 'Loading…'
    : (isError || !data?.data?.name) ? 'N/A' : data.data.name;

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Content: </span><p>{value}</p>
    </div>
  );
};

const FinishInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubfinishQuery(id, { skip: !id });
  const value = !id
    ? 'N/A'
    : isLoading
    ? 'Loading…'
    : (isError || !data?.data?.name) ? 'N/A' : data.data.name;

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Finish: </span><p>{value}</p>
    </div>
  );
};

/* --------------------------------
   Lightweight name lookups (design/motif/color)
   NOTE: Uses plural collections: designs, motifs, colors
--------------------------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');

const fetchOneName = async (collection, id) => {
  if (!API_BASE || !id) return null;

  // map single → plural safely
  const coll = ({ design:'designs', motif:'motifs', color:'colors' }[collection]) || collection;
  const url = `${API_BASE}/shopy/${coll}/${id}`;

  const headers = { 'Content-Type': 'application/json' };
  if (process.env.NEXT_PUBLIC_API_KEY) headers['x-api-key'] = process.env.NEXT_PUBLIC_API_KEY;

  try {
    const res = await fetch(url, { headers });
    if (!res.ok) return null;
    const json = await res.json();
    return json?.data?.name || json?.name || null;
  } catch {
    return null;
  }
};

const DesignInfo = ({ value }) => {
  // value can be:
  // - string name   → show directly
  // - {_id,name}    → use .name
  // - string objId  → fetch name
  const direct =
    typeof value === 'object' ? value?.name :
    (typeof value === 'string' && !isObjId(value) ? value : null);

  const id = typeof value === 'object' ? value?._id :
             (typeof value === 'string' && isObjId(value) ? value : undefined);

  const [name, setName] = useState(direct);

  useEffect(() => {
    let live = true;
    (async () => {
      if (direct || !id) { if (live) setName(direct || null); return; }
      const n = await fetchOneName('design', id);
      if (live) setName(n);
    })();
    return () => { live = false; };
  }, [direct, id]);

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Design: </span><p>{nonEmpty(name) ? name : 'N/A'}</p>
    </div>
  );
};

const MotifInfo = ({ value }) => {
  const direct =
    typeof value === 'object' ? value?.name :
    (typeof value === 'string' && !isObjId(value) ? value : null);

  const id = typeof value === 'object' ? value?._id :
             (typeof value === 'string' && isObjId(value) ? value : undefined);

  const [name, setName] = useState(direct);

  useEffect(() => {
    let live = true;
    (async () => {
      if (direct || !id) { if (live) setName(direct || null); return; }
      const n = await fetchOneName('motif', id);
      if (live) setName(n);
    })();
    return () => { live = false; };
  }, [direct, id]);

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Motif: </span><p>{nonEmpty(name) ? name : 'N/A'}</p>
    </div>
  );
};

const ColorsInfo = ({ value }) => {
  // value can be:
  // - array of { _id, name }
  // - array of names
  // - array of ids
  const arr = Array.isArray(value) ? value : [];

  const namesGiven = arr
    .map((x) => (typeof x === 'string' ? (!isObjId(x) ? x : null) : x?.name))
    .filter(Boolean);

  const ids = arr
    .map((x) => (typeof x === 'string' ? (isObjId(x) ? x : null) : x?._id))
    .filter(Boolean);

  const [names, setNames] = useState(namesGiven);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!ids.length) return;
      const fetched = await Promise.all(ids.map((id) => fetchOneName('color', id)));
      const got = fetched.filter(Boolean);
      if (live) setNames((prev) => (prev && prev.length ? prev : got));
    })();
    return () => { live = false; };
  }, [JSON.stringify(ids)]);

  const label = (names && names.length ? names : []).join(', ') || 'N/A';

  return (
    <div className="tp-product-details-query-item d-flex align-items-center">
      <span>Colors: </span><p>{label}</p>
    </div>
  );
};

/* --------------------------------
   Star icons (Font Awesome)
--------------------------------- */
const Stars = ({ value }) => {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const iconStyle = { marginRight: 4, color: '#f59e0b' };
  return (
    <span aria-label={`Rating ${v} out of 5`}>
      {Array.from({ length: full }).map((_, i) => (
        <i key={`f${i}`} className="fa-solid fa-star" style={iconStyle} />
      ))}
      {half === 1 && <i className="fa-solid fa-star-half-stroke" style={iconStyle} />}
      {Array.from({ length: empty }).map((_, i) => (
        <i key={`e${i}`} className="fa-regular fa-star" style={iconStyle} />
      ))}
    </span>
  );
};

/* --------------------------------
   Main component
--------------------------------- */
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

    // may appear as ids, objects, or names
    design,
    designId,
    motif,
    motifId,

    color,    // array (ids/objects/names)
    colors,   // just in case some feed uses this

    // weight/width fields
    gsm, oz, cm, inch, width,
  } = productItem;

  // SEO: lead time, rating, reviews (endpoint 404 is OK; UI is resilient)
  const { data: seoResp } = useGetSeoByProductQuery(_id, { skip: !_id });
  const seoDoc = Array.isArray(seoResp?.data) ? seoResp?.data?.[0] : (seoResp?.data || seoResp);
  const leadTimeDays = pick(seoDoc?.leadtime);
  const ratingValue  = pick(seoDoc?.rating_value);
  const ratingCount  = pick(seoDoc?.rating_count);

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.some((prd) => prd._id === _id);
  const toggleWishlist = () => dispatch(add_to_wishlist(productItem));

  // Weight → "125 gsm / 3.7 oz"
  const weightParts = [];
  if (nonEmpty(gsm)) weightParts.push(`${gsm} gsm`);
  if (nonEmpty(oz))  weightParts.push(`${Number(oz).toFixed(1)} oz`);
  const weightDisplay = weightParts.join(' / ') || 'N/A';

  // Width → "147 cm / 58 inch" (rounded inch), no duplicate units
  const cmNum   = asNumber(cm ?? width);
  const inchNum = asNumber(inch);
  const widthDisplay = [
    cmNum   != null ? `${cmNum} cm` : undefined,
    inchNum != null ? `${Math.round(inchNum)} inch` : undefined,
  ].filter(Boolean).join(' / ') || 'N/A';

  // design/motif values (id|object|string)
  const designValue = nonEmpty(design) ? design : designId;
  const motifValue  = nonEmpty(motif)  ? motif  : motifId;

  // colors from either "color" array or "colors"
  const colorsValue = Array.isArray(color) ? color : (Array.isArray(colors) ? colors : []);

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

      {/* DETAILS — two columns: left(6), right(5) */}
      <div className="tp-product-details-query" style={{ marginBottom: 20 }}>
        <div className="row g-2">
          {/* LEFT COLUMN — 6 rows */}
          <div className="col-12 col-sm-6">
            <ContentInfo id={contentId} />

            <div className="tp-product-details-query-item d-flex align-items-center">
              <span>Weight: </span><p>{weightDisplay}</p>
            </div>

            <DesignInfo value={designValue} />

            <ColorsInfo value={colorsValue} />

            <div className="tp-product-details-query-item d-flex align-items-center">
              <span>Rating: </span><p><Stars value={ratingValue} /></p>
            </div>

            <div className="tp-product-details-query-item d-flex align-items-center">
              <span>Reviews: </span><p>{nonEmpty(ratingCount) ? String(ratingCount) : '0'}</p>
            </div>
          </div>

          {/* RIGHT COLUMN — 5 rows */}
          <div className="col-12 col-sm-6">
            <div className="tp-product-details-query-item d-flex align-items-center">
              <span>Width: </span><p>{widthDisplay}</p>
            </div>

            <FinishInfo id={finishId} />

            <StructureInfo id={structureId} />

            <MotifInfo value={motifValue} />

            <div className="tp-product-details-query-item d-flex align-items-center">
              <span>Lead time: </span><p>{nonEmpty(leadTimeDays) ? `${leadTimeDays} days` : 'N/A'}</p>
            </div>
          </div>
        </div>
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
