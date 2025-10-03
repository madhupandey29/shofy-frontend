'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';
import { close } from '@/redux/features/searchOverlaySlice';

import {
  useSearchNewProductQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetInchUptoQuery,
  useGetCmUptoQuery,
  useGetQuantityUptoQuery,
  useGetPriceUptoQuery,
  useGetPurchasePriceUptoQuery,
} from '@/redux/features/newProductApi';

/* ---------------- helpers ---------------- */
function useDebouncedValue(val: string, delay = 250) {
  const [v, setV] = useState(val);
  useEffect(() => {
    const t = setTimeout(() => setV(val), delay);
    return () => clearTimeout(t);
  }, [val, delay]);
  return v;
}

const isNumeric = (s: string) => s.trim() !== '' && !Number.isNaN(Number(s));

const dedupeById = <T extends { _id?: string }>(arr: ReadonlyArray<T>) => {
  const seen = new Set<string>();
  const out: T[] = [];
  for (const it of arr) {
    const id = it?._id || '';
    if (!id || seen.has(id)) continue;
    seen.add(id);
    out.push(it);
  }
  return out;
};

/* ---------------- types ---------------- */
type RootState = {
  searchOverlay: { open: boolean; query: string };
};

type Product = {
  _id: string;
  name?: string;
  img?: string;
  image1?: string;
  slug?: string;
  newCategoryId?: { name?: string };
  gsm?: number;
  oz?: number;
  cm?: number;
  inch?: number;
};

type ApiList<T> = { status: number; data: T[] };
const asList = (x: unknown): Product[] =>
  x && typeof x === 'object' && Array.isArray((x as ApiList<Product>).data)
    ? ((x as ApiList<Product>).data as Product[])
    : [];

/* ---------------- component ---------------- */
export default function GlobalSearchOverlay() {
  const dispatch = useDispatch();
  const { open, query } = useSelector((s: RootState) => s.searchOverlay);
  const debounced = useDebouncedValue(query, 250);
  const numeric = isNumeric(debounced);

  const textQ   = useSearchNewProductQuery(debounced, { skip: !debounced || numeric });
  const gsmQ    = useGetGsmUptoQuery(debounced, { skip: !numeric });
  const ozQ     = useGetOzUptoQuery(debounced, { skip: !numeric });
  const inchQ   = useGetInchUptoQuery(debounced, { skip: !numeric });
  const cmQ     = useGetCmUptoQuery(debounced, { skip: !numeric });
  const qtyQ    = useGetQuantityUptoQuery(debounced, { skip: !numeric });
  const priceQ  = useGetPriceUptoQuery(debounced, { skip: !numeric });
  const ppriceQ = useGetPurchasePriceUptoQuery(debounced, { skip: !numeric });

  const loading =
    textQ.isLoading || gsmQ.isLoading || ozQ.isLoading || inchQ.isLoading ||
    cmQ.isLoading || qtyQ.isLoading || priceQ.isLoading || ppriceQ.isLoading;

  const results = useMemo(() => {
    if (!debounced) return [];
    const merged: Product[] = [];
    merged.push(...asList(textQ.data));
    if (numeric) {
      merged.push(
        ...asList(gsmQ.data),
        ...asList(ozQ.data),
        ...asList(inchQ.data),
        ...asList(cmQ.data),
        ...asList(qtyQ.data),
        ...asList(priceQ.data),
        ...asList(ppriceQ.data),
      );
    }
    return dedupeById(merged).slice(0, 18);
  }, [
    debounced, numeric,
    textQ.data, gsmQ.data, ozQ.data, inchQ.data, cmQ.data, qtyQ.data, priceQ.data, ppriceQ.data,
  ]);

  // close on ESC
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') dispatch(close()); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, dispatch]);

  if (!open || !debounced) return null;

  return (
    <>
      {/* backdrop */}
      <div className="fixed inset-0 z-[1000] bg-black/30" onClick={() => dispatch(close())} />
      {/* centered panel */}
      <div
        className="fixed z-[1001] left-1/2 top-[120px] -translate-x-1/2 w-[92vw] max-w-[1100px] max-h-[72vh] overflow-auto rounded-2xl border border-gray-200 bg-white shadow-2xl"
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 py-3 text-sm text-gray-600 border-b">
          {loading ? 'Searching…' : <>Results for “{debounced}”</>}
          <button className="text-gray-500 hover:text-gray-700" onClick={() => dispatch(close())} aria-label="Close">✕</button>
        </div>

        {results.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 p-4">
            {results.map((p) => (
              <li key={p._id} className="rounded-xl border border-gray-100 hover:border-gray-200 transition">
                <Link href={p.slug ? `/product/${p.slug}` : '#'} className="flex gap-3 p-3" onClick={() => dispatch(close())}>
                  <div className="relative h-14 w-14 overflow-hidden rounded-lg">
                    <Image
                      src={p.image1 || p.img || '/images/placeholder-portrait.webp'}
                      alt={p.name || 'product'}
                      fill
                      sizes="56px"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="truncate font-medium leading-tight">{p.name}</div>
                    <div className="text-xs text-gray-500">
                      {p?.newCategoryId?.name ? `${p.newCategoryId.name} • ` : ''}
                      {p?.gsm ? `${p.gsm} gsm` : p?.oz ? `${p.oz} oz` : p?.cm ? `${p.cm} cm` : p?.inch ? `${p.inch} inch` : ''}
                    </div>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <div className="p-8 text-center text-gray-500">No matches</div>
        )}
      </div>
    </>
  );
}
