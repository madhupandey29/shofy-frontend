
'use client';

import React from 'react';

import ProductDetailsArea   from '@/components/product-details/product-details-area';
import ProductDetailsLoader from '@/components/loader/prd-details-loader';
import ErrorMsg             from '@/components/common/error-msg';

import { useGetSingleNewProductQuery } from '@/redux/features/newProductApi';


function mapBackendProductToFrontend(p) {
  const images = [
    p.image  && { img: p.image,  type: 'image' },
    p.image1 && { img: p.image1, type: 'image' },
    p.image2 && { img: p.image2, type: 'image' },
  ].filter(Boolean);

  if (p.video && p.videoThumbnail) {
    images.push({ img: p.videoThumbnail, type: 'video' });
  }

  return {
    _id        : p._id,
    slug       : p.slug,
    title      : p.name || p.title,
    img        : p.image || '',
    imageURLs  : images,
    videoId    : p.video || '',
    price      : p.salesPrice,
     description: p.description || p.productdescription || '',
    status     : p.status || 'in-stock',
    sku        : p.sku,

    categoryId     : p.category?._id      || p.category      || '',
    structureId    : p.substructure?._id  || p.substructure  || '',
    contentId      : p.content?._id       || p.content       || '',
    finishId       : p.subfinish?._id     || p.subfinish     || '',
    designId       : p.design?._id        || p.design        || '',
    motifsizeId    : p.motif?._id         || p.motif         || '',
    suitableforId  : p.subsuitable?._id   || p.subsuitable   || '',
    vendorId       : p.vendor?._id        || p.vendor        || '',
    groupcodeId    : p.groupcode?._id     || p.groupcode     || '',

    gsm               : p.gsm,
    oz                : p.oz,
    productIdentifier : p.productIdentifier,
    width             : p.cm
                          ? `${p.cm} cm`
                          : p.inch
                          ? `${p.inch} inch`
                          : 'N/A',

    tags                  : p.tags || [],
    offerDate             : p.offerDate || { endDate: null },
    additionalInformation : p.additionalInformation || [],
  };
}

export default function ProductDetailsClient({ slug }) {
  const {
    data,
    isLoading,
    isError,
  } = useGetSingleNewProductQuery(slug, { skip: !slug });

  if (isLoading)   return <ProductDetailsLoader loading />;
  if (isError)     return <ErrorMsg msg="There was an error" />;
  if (!data?.data) return <ErrorMsg msg="No product found!" />;

  const product = mapBackendProductToFrontend(data.data);
  return <ProductDetailsArea product={product} />;
}
