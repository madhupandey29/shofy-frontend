/* ----------------------------------------------------------------------
   components/product-details/details-wrapper.jsx
---------------------------------------------------------------------- */
'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { useGetSubstructureQuery } from '@/redux/features/substructureApi';
import { useGetContentByIdQuery }   from '@/redux/features/contentApi';
import { useGetSubfinishQuery }     from '@/redux/features/subfinishApi';
import { useGetSeoByProductQuery }  from '@/redux/features/seoApi';
import { useGetDesignByIdQuery }    from '@/redux/features/designApi';
import { useGetMotifSizeByIdQuery } from '@/redux/features/motifSizeApi';

import { add_to_wishlist } from '@/redux/features/wishlist-slice';

/* ---------------- small helpers ---------------- */
const nonEmpty = (v) =>
  v !== undefined && v !== null && (typeof v === 'number' || String(v).trim() !== '');
const pick = (...xs) => xs.find(nonEmpty);

const asNumber = (value) => {
  if (value === undefined || value === null) return undefined;
  const n = Number(String(value).replace(/[^0-9.\-]/g, ''));
  return Number.isFinite(n) ? n : undefined;
};

const isObjId = (s) => typeof s === 'string' && /^[a-f\d]{24}$/i.test(s);

/* ---------------- lookup mini-components ---------------- */
const StructureInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubstructureQuery(id, { skip: !id });
  const value = !id ? 'N/A' : isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return <Row label="Structure" value={value} />;
};
const ContentInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetContentByIdQuery(id, { skip: !id });
  const value = !id ? 'N/A' : isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return <Row label="Content" value={value} />;
};
const FinishInfo = ({ id }) => {
  const { data, isLoading, isError } = useGetSubfinishQuery(id, { skip: !id });
  const value = !id ? 'N/A' : isLoading ? 'Loading…' : (isError || !data?.data?.name) ? 'N/A' : data.data.name;
  return <Row label="Finish" value={value} />;
};

/* ---------------- API name resolver (robust) ---------------- */
const API_BASE = (process.env.NEXT_PUBLIC_API_BASE_URL || '').replace(/\/+$/, '');
const API_KEY   = process.env.NEXT_PUBLIC_API_KEY;
const API_KEY_HEADER = process.env.NEXT_PUBLIC_API_KEY_HEADER || 'x-api-key';

const fetchJson = async (url) => {
  const headers = { 'Content-Type': 'application/json' };
  if (API_KEY) headers[API_KEY_HEADER] = API_KEY;
  const res = await fetch(url, { headers, credentials: 'include' });
  if (!res.ok) return null;
  try {
    return await res.json();
  } catch {
    return null;
  }
};

const getFirst = (...xs) => xs.find((x) => x !== undefined && x !== null);

/** Try several endpoints until one answers with a name */
const fetchNameViaCandidates = async (candidates) => {
  for (const path of candidates) {
    const data = await fetchJson(`${API_BASE}${path}`);
    const name = getFirst(
      data?.data?.name,
      data?.data?.title,
      data?.data?.size,   // motif size sometimes
      data?.name,
      data?.title
    );
    if (nonEmpty(name)) return String(name);
  }
  return null;
};

/* ----- Stars ----- */
const Stars = ({ value }) => {
  const v = Math.max(0, Math.min(5, Number(value || 0)));
  const full = Math.floor(v);
  const half = v - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  const iconStyle = { marginRight: 4, color: '#f59e0b' };
  return (
    <span aria-label={`Rating ${v} out of 5`}>
      {Array.from({ length: full }).map((_, i) => <i key={`f${i}`} className="fa-solid fa-star" style={iconStyle} />)}
      {half === 1 && <i className="fa-solid fa-star-half-stroke" style={iconStyle} />}
      {Array.from({ length: empty }).map((_, i) => <i key={`e${i}`} className="fa-regular fa-star" style={iconStyle} />)}
    </span>
  );
};

/* ----- Simple row UI (keeps your styling) ----- */
const Row = ({ label, value }) => (
  <div className="tp-product-details-query-item d-flex align-items-center">
    <span>{label}: </span><p>{nonEmpty(value) ? value : 'N/A'}</p>
  </div>
);

/* ---------------- Specific resolvers ---------------- */
const useDesignName = (design, designId) => {
  // direct name?
  const direct = useMemo(() => {
    if (typeof design === 'object') return design?.name;
    if (typeof design === 'string' && !isObjId(design)) return design;
    return undefined;
  }, [design]);

  // prefer RTK query if id present
  const id = useMemo(() => {
    if (typeof design === 'object') return design?._id;
    if (typeof design === 'string' && isObjId(design)) return design;
    if (typeof designId === 'string' && isObjId(designId)) return designId;
    return undefined;
  }, [design, designId]);

  const { data: dQ } = useGetDesignByIdQuery(id, { skip: !id });
  const fromRtk = dQ?.data?.name;

  const [fetched, setFetched] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!API_BASE || !id || direct || fromRtk) { if (live) setFetched(null); return; }
      const name = await fetchNameViaCandidates([
        `/shopy/designs/${id}`,
        `/designs/${id}`,
        `/design/${id}`,
      ]);
      if (live) setFetched(name);
    })();
    return () => { live = false; };
  }, [id, direct, fromRtk]);

  return pick(direct, fromRtk, fetched);
};

const useMotifName = (motif, motifId) => {
  const direct = useMemo(() => {
    if (typeof motif === 'object') return motif?.name || motif?.size;
    if (typeof motif === 'string' && !isObjId(motif)) return motif;
    return undefined;
  }, [motif]);

  const id = useMemo(() => {
    if (typeof motif === 'object') return motif?._id;
    if (typeof motif === 'string' && isObjId(motif)) return motif;
    if (typeof motifId === 'string' && isObjId(motifId)) return motifId;
    return undefined;
  }, [motif, motifId]);

  const { data: mQ } = useGetMotifSizeByIdQuery(id, { skip: !id });
  const fromRtk = mQ?.data?.name || mQ?.data?.size;

  const [fetched, setFetched] = useState(null);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!API_BASE || !id || direct || fromRtk) { if (live) setFetched(null); return; }
      const name = await fetchNameViaCandidates([
        `/shopy/motifs/${id}`,
        `/motifs/${id}`,
        `/motif/${id}`,
      ]);
      if (live) setFetched(name);
    })();
    return () => { live = false; };
  }, [id, direct, fromRtk]);

  return pick(direct, fromRtk, fetched);
};

const useColorNames = (colors) => {
  // Normalize input into array
  const arr = useMemo(() => {
    if (!colors) return [];
    if (Array.isArray(colors)) return colors;
    // allow "Red, Blue, Green"
    if (typeof colors === 'string') {
      return colors.split(',').map(s => s.trim()).filter(Boolean);
    }
    return [];
  }, [colors]);

  // Already named?
  const givenNames = useMemo(() => arr
    .map((x) => (typeof x === 'string' ? (!isObjId(x) ? x : null) : x?.name))
    .filter(Boolean), [arr]);

  // IDs to fetch
  const ids = useMemo(() => arr
    .map((x) => (typeof x === 'string' ? (isObjId(x) ? x : null) : x?._id))
    .filter(Boolean), [arr]);

  const [fetched, setFetched] = useState([]);

  useEffect(() => {
    let live = true;
    (async () => {
      if (!API_BASE || !ids.length) { if (live) setFetched([]); return; }
      const names = await Promise.all(ids.map((id) =>
        fetchNameViaCandidates([`/shopy/colors/${id}`, `/colors/${id}`, `/color/${id}`])
      ));
      const ok = names.filter(Boolean);
      if (live) setFetched(ok);
    })();
    return () => { live = false; };
  }, [JSON.stringify(ids)]);

  return (givenNames.length ? givenNames : fetched);
};

/* ---------------- Main component ---------------- */
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

    design, designId,
    motif,  motifId,

    color, colors,

    gsm, oz, cm, inch, width,
  } = productItem;

  /* SEO: lead time / rating / reviews */
  const { data: seoResp } = useGetSeoByProductQuery(_id, { skip: !_id });
  const seoDoc = Array.isArray(seoResp?.data) ? seoResp?.data?.[0] : (seoResp?.data || seoResp);
  const leadTimeDays = pick(seoDoc?.leadtime);
  const ratingValue  = pick(seoDoc?.rating_value);
  const ratingCount  = pick(seoDoc?.rating_count);

  const dispatch = useDispatch();
  const { wishlist } = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.some((prd) => prd._id === _id);
  const toggleWishlist = () => dispatch(add_to_wishlist(productItem));

  /* Computed fields */
  const weightParts = [];
  if (nonEmpty(gsm)) weightParts.push(`${gsm} gsm`);
  if (nonEmpty(oz))  weightParts.push(`${Number(oz).toFixed(1)} oz`);
  const weightDisplay = weightParts.join(' / ') || 'N/A';

  const cmNum   = asNumber(cm ?? width);
  const inchNum = asNumber(inch);
  const widthDisplay = [
    cmNum   != null ? `${cmNum} cm` : undefined,
    inchNum != null ? `${Math.round(inchNum)} inch` : undefined,
  ].filter(Boolean).join(' / ') || 'N/A';

  const designName = useDesignName(design, designId);
  const motifName  = useMotifName(motif, motifId);
  const colorNames = useColorNames(Array.isArray(color) ? color : colors);

  return (
    <div className="tp-product-details-wrapper">
      <div className="tp-product-details-category">
        <span>{category?.name || newCategoryId?.name}</span>
      </div>

      <h3 className="tp-product-details-title" dangerouslySetInnerHTML={{ __html: title }} />

      <div className="tp-product-details-inventory d-flex align-items-center mb-10">
        <div className="tp-product-details-stock mb-10"><span>{status}</span></div>
      </div>

      <p dangerouslySetInnerHTML={{ __html: description }} />

      {/* QUICK FACTS */}
      <div className="tp-product-details-query" style={{ marginBottom: 20 }}>
        <div className="row g-2">
          {/* LEFT */}
          <div className="col-12 col-sm-6">
            <ContentInfo id={contentId} />
            <Row label="Weight" value={weightDisplay} />
            <Row label="Design" value={designName} />
            <Row label="Colors" value={(colorNames && colorNames.length) ? colorNames.join(', ') : 'N/A'} />
            <Row label="Rating" value={<Stars value={ratingValue} />} />
            <Row label="Reviews" value={nonEmpty(ratingCount) ? String(ratingCount) : '0'} />
          </div>

          {/* RIGHT */}
          <div className="col-12 col-sm-6">
            <Row label="Width" value={widthDisplay} />
            <FinishInfo id={finishId} />
            <StructureInfo id={structureId} />
            <Row label="Motif" value={motifName} />
            <Row label="Lead time" value={nonEmpty(leadTimeDays) ? `${leadTimeDays} days` : 'N/A'} />
          </div>
        </div>
      </div>

      {/* CTAs + Wishlist */}
      <div className="tp-product-details-action-wrapper">
        <div className="tp-product-details-action-item-wrapper d-flex align-items-center" style={{ gap: 10 }}>
          <div className="d-flex" style={{ flexGrow: 1, gap: 10 }}>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">Request Sample</button>
            <button className="tp-product-details-buy-now-btn w-100 py-1 px-1 text-sm rounded transition-all">Request Quote</button>
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
