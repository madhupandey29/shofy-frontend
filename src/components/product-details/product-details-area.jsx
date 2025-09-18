'use client';
import React from 'react';

import ErrorMsg                     from '../common/error-msg';
import ProductDetailsBreadcrumb     from '../breadcrumb/product-details-breadcrumb';
import ProductDetailsContent        from './product-details-content';

import { useGetCategoryByIdQuery }  from '@/redux/features/categoryApi';

/* -------------------------------------------------------------------- */
/*  ProductDetailsArea                                                  */
/* -------------------------------------------------------------------- */
const ProductDetailsArea = ({ product }) => {
  /* always run the hook; let RTK Query decide whether to fire */
  const categoryId = product?.categoryId;
  const { data: catData } = useGetCategoryByIdQuery(categoryId, {
    skip: !categoryId,          //   ← no network call when ID is missing
  });

  /* handle missing product after hooks have run */
  if (!product) return <ErrorMsg msg="No product found!" />;

  const categoryName = catData?.data?.name || '';

  return (
    <>
      <ProductDetailsBreadcrumb
        category={categoryName}
        title={product.title}
      />
      <ProductDetailsContent productItem={product} />
    </>
  );
};

export default ProductDetailsArea;
