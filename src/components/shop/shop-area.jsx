'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams }             from 'next/navigation';

import ShopLoader                      from '../loader/shop/shop-loader';
import ErrorMsg                        from '../common/error-msg';
import ShopFilterOffCanvas             from '../common/shop-filter-offcanvas';
import ShopContent                     from './shop-content';
import ShopHiddenSidebarArea           from './shop-hidden-sidebar-area';



import {
  useGetAllNewProductsQuery,
  useGetPriceUptoQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery,
} from '@/redux/features/newProductApi';

const PROPERTY_MAP = Object.freeze({
  category: 'category',
  color:    'color',
  content:  'content',
  design:   'design',
  structure:'substructure',
  finish:   'subfinish',
  groupcode:'groupcode',
  vendor:   'vendor',
  suitablefor:'subsuitable',
  motifsize:'motif',
  substructure:'substructure',
  subfinish:'subfinish',
  subsuitable:'subsuitable',
});

export default function ShopArea({ shop_right = false, hidden_sidebar = false }) {
  // ────── URL params ─────────────────────────
  const p               = useSearchParams();
  const category        = p.get('category');
  const minPrice        = p.get('minPrice');
  const maxPrice        = p.get('maxPrice');
  const filterColor     = p.get('color');
  const filterStructure = p.get('structure');
  const filterContent   = p.get('content');
  const filterFinish    = p.get('finish');
  const gsm             = p.get('gsm');
  const oz              = p.get('oz');
  const quantity        = p.get('quantity');
  const purchasePrice   = p.get('purchasePrice');

  // ────── State & handlers ────────────────────
  const [priceValue,      setPriceValue]      = useState([0, 1000]);
  const [selectValue,     setSelectValue]     = useState('');
  const [currPage,        setCurrPage]        = useState(1);
  const [selectedFilters, setSelectedFilters] = useState({});

  const handleFilterChange = (obj) => {
    setCurrPage(1);
    setSelectedFilters(obj);
  };
  const handleSlider = (val) => {
    setCurrPage(1);
    setPriceValue(val);
  };
  const handleSelect = (e) => {
    setSelectValue(e.value);
  };

  const otherProps = {
    priceFilterValues: { priceValue, handleChanges: handleSlider, setPriceValue },
    selectHandleFilter: handleSelect,
    currPage, setCurrPage,
    selectedFilters, handleFilterChange,
  };

  // ────── Data fetching ───────────────────────
  const gsmQ           = useGetGsmUptoQuery(gsm,          { skip: !gsm });
  const ozQ            = useGetOzUptoQuery(oz,            { skip: !oz });
  const quantityQ      = useGetQuantityUptoQuery(quantity, { skip: !quantity });
  const purchasePriceQ = useGetPurchasePriceUptoQuery(purchasePrice, { skip: !purchasePrice });
  const priceQ         = useGetPriceUptoQuery(minPrice, {
                          skip: !(minPrice && maxPrice && minPrice === maxPrice),
                        });
  const allQ           = useGetAllNewProductsQuery(undefined, {
                          skip: gsm || oz || quantity || purchasePrice ||
                                (minPrice && maxPrice && minPrice === maxPrice),
                        });

  const { data: productsData, isLoading, isError } =
    gsm            ? gsmQ :
    oz             ? ozQ  :
    quantity       ? quantityQ :
    purchasePrice  ? purchasePriceQ :
    (minPrice && maxPrice && minPrice === maxPrice) ? priceQ :
    allQ;

  // memoize so we don’t rebuild [] on every render
  const products = useMemo(
    () => productsData?.data ?? [],
    [productsData?.data],
  );

  // auto-expand price slider max
  useEffect(() => {
    if (!isLoading && !isError && products.length) {
      const max = products.reduce((m, pr) => Math.max(m, +pr.salesPrice||0), 0);
      if (max > priceValue[1]) setPriceValue(([lo]) => [lo, max]);
    }
  }, [isLoading, isError, products, priceValue]);

  // ────── Filtering & sorting ─────────────────
  const filteredProducts = useMemo(() => {
    if (isLoading || isError) return [];

    let items = products;

    // 1) checkbox‐sidebar filters
    const active = Object.entries(selectedFilters).filter(([, arr]) => arr.length);
    if (active.length) {
      items = items.filter(pr =>
        active.every(([key, vals]) => {
          const prop = PROPERTY_MAP[key];
          if (!prop || !pr[prop]) return false;
          const field = pr[prop];
          if (Array.isArray(field)) {
            return field.some(x => vals.includes(x._id ?? x));
          }
          return vals.includes(field._id ?? field);
        })
      );
    }

    // 2) sort
    if (selectValue === 'Low to High')  items = [...items].sort((a,b)=>a.salesPrice-b.salesPrice);
    if (selectValue === 'High to Low')  items = [...items].sort((a,b)=>b.salesPrice-a.salesPrice);
    if (selectValue === 'New Added')    items = [...items].sort((a,b)=>new Date(b.published_at)-new Date(a.published_at));

    // 3) URL‐string filters
    const slugify = s => s?.toLowerCase().replace(/&/g,'').split(' ').join('-');
    if (category)        items = items.filter(p=>slugify(p.category?.name)===category);
    if (filterColor)     items = items.filter(p=>p.color?.some(c=>slugify(c.name)===filterColor));
    if (filterStructure) items = items.filter(p=>slugify(p.substructure?.name)===filterStructure);
    if (filterContent)   items = items.filter(p=>slugify(p.content?.name)===filterContent);
    if (filterFinish)    items = items.filter(p=>slugify(p.subfinish?.name)===filterFinish);

    if (minPrice && maxPrice) {
      items = items.filter(p => +p.salesPrice >= +minPrice && +p.salesPrice <= +maxPrice);
    }

    return items;
  }, [
    isLoading, isError, products,
    selectedFilters, selectValue,
    category, filterColor, filterStructure, filterContent, filterFinish,
    minPrice, maxPrice,
  ]);

  // ────── Choose which main component to show ───
  let content;
  if (isLoading)           content = <ShopLoader loading />;
  else if (isError)        content = <ErrorMsg msg="There was an error" />;

else if (hidden_sidebar) {
  content = (
    <ShopHiddenSidebarArea
      all_products={products}
      products={filteredProducts}
      otherProps={otherProps}
    />
  );
} else {
  content = (
    <ShopContent
      all_products={products}
      products={filteredProducts}
      otherProps={otherProps}
      shop_right={shop_right}
      hidden_sidebar={hidden_sidebar}
    />
  );
}

  return (
    <>
      {content}

      {/* off-canvas filter */}
      {!isLoading && !isError && (
        <ShopFilterOffCanvas
          all_products={products}
          otherProps={otherProps}
          right_side={shop_right}
        />
      )}
    </>
  );
}
