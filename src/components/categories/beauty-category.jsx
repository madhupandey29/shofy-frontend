'use client';

import Link from "next/link";
import { useRouter } from 'next/navigation';
import ErrorMsg from "../common/error-msg";
import { ArrowRightSm, ArrowRightSmTwo } from "@/svg";
import { useGetProductTypeCategoryQuery } from "@/redux/features/categoryApi";
import { HomeThreeCategoryLoader } from "../loader";

const BeautyCategory = () => {
  const router = useRouter();
  const { data: categories, isLoading, isError } =
    useGetProductTypeCategoryQuery("beauty");

  const handleCategoryRoute = (title) => {
    const slug = title
      .toLowerCase()
      .replace(/&/g, "")
      .split(" ")
      .join("-");
    router.push(`/shop?category=${slug}`);
  };

  let content = null;

  if (isLoading) {
    content = <HomeThreeCategoryLoader loading={true} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (categories?.result?.length === 0) {
    content = <ErrorMsg msg="No Category found!" />;
  } else if (categories?.result?.length > 0) {
    content = categories.result.map((item) => (
      <div key={item._id} className="col-lg-3 col-sm-6">
        <div className="tp-category-item-3 p-relative black-bg text-center z-index-1 fix mb-30">
          <div
            className="tp-category-thumb-3 include-bg"
            style={{ backgroundImage: `url(${item.img})` }}
          />
          <div className="tp-category-content-3 transition-3">
            <h3 className="tp-category-title-3">
              <a
                className="cursor-pointer"
                onClick={() => handleCategoryRoute(item.parent)}
              >
                {item.parent}
              </a>
            </h3>
            <span className="tp-categroy-ammount-3">
              {item.products.length} Products
            </span>
            <div className="tp-category-btn-3">
              <a
                className="cursor-pointer tp-link-btn tp-link-btn-2"
                onClick={() => handleCategoryRoute(item.parent)}
              >
                View Now <ArrowRightSm />
              </a>
            </div>
          </div>
        </div>
      </div>
    ));
  }

  return (
    <section className="tp-category-area pt-95">
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-6 col-md-8">
            <div className="tp-section-title-wrapper-3 mb-45">
              <span className="tp-section-title-pre-3">
                Product Collection
              </span>
              <h3 className="tp-section-title-3">Discover our products</h3>
            </div>
          </div>
          <div className="col-lg-6 col-md-4">
            <div className="tp-category-more-3 text-md-end mb-55">
              <Link href="/shop" className="tp-btn">
                Shop All Products <ArrowRightSmTwo />
              </Link>
            </div>
          </div>
        </div>
        <div className="row">{content}</div>
      </div>
    </section>
  );
};

export default BeautyCategory;
