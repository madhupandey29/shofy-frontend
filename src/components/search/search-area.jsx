'use client';
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import NiceSelect from "@/ui/nice-select";
import ErrorMsg from "@/components/common/error-msg";
import SearchPrdLoader from "@/components/loader/search-prd-loader";
import ProductItem from "@/components/products/fashion/product-item";
import {
  useSearchNewProductQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetPriceUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery,
  useGetAllNewProductsQuery
} from "@/redux/features/newProductApi";

export default function SearchArea() {
  const searchParams = useSearchParams();
  const searchText = searchParams.get('searchText');
  const productType = searchParams.get('productType');
  const isNumeric = searchText && !isNaN(Number(searchText));
  const [shortValue, setShortValue] = useState("");
  const perView = 8;
  const [next, setNext] = useState(perView);

  // API hooks for all value-based APIs
  const { data: gsmData, isLoading: gsmLoading, isError: gsmError } = useGetGsmUptoQuery(searchText, { skip: !isNumeric });
  const { data: ozData, isLoading: ozLoading, isError: ozError } = useGetOzUptoQuery(searchText, { skip: !isNumeric });
  const { data: priceData, isLoading: priceLoading, isError: priceError } = useGetPriceUptoQuery(searchText, { skip: !isNumeric });
  const { data: quantityData, isLoading: quantityLoading, isError: quantityError } = useGetQuantityUptoQuery(searchText, { skip: !isNumeric });
  const { data: purchasePriceData, isLoading: purchasePriceLoading, isError: purchasePriceError } = useGetPurchasePriceUptoQuery(searchText, { skip: !isNumeric });
  const { data: searchResults, isLoading: searchLoading, isError: searchError } = useSearchNewProductQuery(searchText, { skip: !searchText || isNumeric });
  const { data: allProducts, isLoading: allLoading, isError: allError } = useGetAllNewProductsQuery();

  // Decide which data to use (priority order)
  let products = null;
  let isLoading = false;
  let isError = false;

  if (isNumeric) {
    if (gsmData?.data?.length > 0) {
      products = gsmData;
      isLoading = gsmLoading;
      isError = gsmError;
    } else if (ozData?.data?.length > 0) {
      products = ozData;
      isLoading = ozLoading;
      isError = ozError;
    } else if (quantityData?.data?.length > 0) {
      products = quantityData;
      isLoading = quantityLoading;
      isError = quantityError;
    } else if (purchasePriceData?.data?.length > 0) {
      products = purchasePriceData;
      isLoading = purchasePriceLoading;
      isError = purchasePriceError;
    } else if (priceData?.data?.length > 0) {
      products = priceData;
      isLoading = priceLoading;
      isError = priceError;
    } else {
      products = { data: [] };
      isLoading = gsmLoading || ozLoading || priceLoading || quantityLoading || purchasePriceLoading;
      isError = gsmError && ozError && priceError && quantityError && purchasePriceError;
    }
  } else if (searchText) {
    products = searchResults;
    isLoading = searchLoading;
    isError = searchError;
  } else {
    products = allProducts;
    isLoading = allLoading;
    isError = allError;
  }

  // Sorting and rendering logic
  let product_items = products?.data || [];
  if (searchText && productType) {
    product_items = product_items.filter(
      (prd) => prd.newCategoryId?.name?.toLowerCase() === productType.toLowerCase()
    );
  }
  if (shortValue === "Price low to high") {
    product_items = product_items.slice().sort((a, b) => Number(a.salesPrice) - Number(b.salesPrice));
  }
  if (shortValue === "Price high to low") {
    product_items = product_items.slice().sort((a, b) => Number(b.salesPrice) - Number(a.salesPrice));
  }

  // UI rendering
  let content = null;
  if (isLoading) {
    content = <SearchPrdLoader loading={isLoading} />;
  } else if (isError) {
    content = <ErrorMsg msg="There was an error" />;
  } else if (product_items.length === 0) {
    content = (
      <div className="text-center pt-80 pb-80">
        <h3>Sorry, nothing matched <span style={{ color: '#0974ff' }}>{searchText}</span> search terms</h3>
      </div>
    );
  } else {
    content = (
      <>
        <section className="tp-shop-area pb-120">
          <div className="container">
            <div className="row">
              <div className="col-xl-12 col-lg-12">
                <div className="tp-shop-main-wrapper">
                  <div className="tp-shop-top mb-45">
                    <div className="row">
                      <div className="col-xl-6">
                        <div className="tp-shop-top-left d-flex align-items-center ">
                          <div className="tp-shop-top-result">
                            <p>Showing 1–{product_items.length} results</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-6">
                        <div className="tp-shop-top-right d-sm-flex align-items-center justify-content-xl-end">
                          <div className="tp-shop-top-select">
                            <NiceSelect
                              options={[
                                { value: "Short By Price", text: "Short By Price" },
                                { value: "Price low to high", text: "Price low to high" },
                                { value: "Price high to low", text: "Price high to low" },
                              ]}
                              defaultCurrent={0}
                              onChange={(e) => setShortValue(e.value)}
                              name="Short By Price"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="tp-shop-items-wrapper tp-shop-item-primary">
                    <div className="row">
                      {product_items
                        .slice(0, next)
                        ?.map((item) => (
                          <div
                            key={item._id}
                            className="col-xl-3 col-lg-4 col-md-6 col-sm-6"
                          >
                            <ProductItem product={item} />
                          </div>
                        ))}
                    </div>
                  </div>
                  {next < product_items?.length && (
                    <div className="load-more-btn text-center pt-50">
                      <button onClick={() => setNext(next + 4)} className="tp-btn tp-btn-2 tp-btn-blue">
                        Load More
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </>
    );
  }

  return <>{content}</>;
}