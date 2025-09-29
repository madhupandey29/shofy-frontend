'use client';

import React from 'react';
import ErrorMsg from '@/components/common/error-msg';
import EmptyState from '@/components/common/empty-state'; // ⟵ use your empty state
import { useGetOffersQuery } from '@/redux/features/newProductApi';
import ProductItem from './product-item';
import { HomeTwoPrdLoader } from '@/components/loader';
import { TextShapeLine } from '@/svg';

const ProductArea = () => {
  const { data, isError, isLoading } = useGetOffersQuery();
  const items = data?.data ?? [];

  let content = null;

  if (isLoading) {
    content = <HomeTwoPrdLoader loading />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (!items.length) {
    // show your modern empty state
    content = (
      <EmptyState
        title="No products found"
        subtitle="Try adjusting your filters or explore more categories."
        tips={['Clear filters', 'Try a different category', 'Check spelling or keywords']}
        primaryAction={{ label: 'Browse all products', href: '/fabric' }}
        secondaryAction={{ label: 'Go to Home', href: '/' }}
      />
    );
  } else {
    content = (
      <div className="row">
        {items.map((prd) => (
          <div key={prd._id} className="col-xl-3 col-lg-4 col-md-6 col-sm-6">
            <ProductItem product={prd} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <section className="tp-product-area pb-90">
      <div className="container">
        <div className="row">
          <div className="col-xl-12">
            <div className="tp-section-title-wrapper-2 text-center mb-35">
              <span className="tp-section-title-pre-2">
                Bestselling Fabrics of the Season
                <TextShapeLine />
              </span>
              <h3 className="tp-section-title-2">Our Most Loved Yarns</h3>
            </div>
          </div>
        </div>

        {content}
      </div>
    </section>
  );
};

export default ProductArea;
