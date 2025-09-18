'use client'
import React from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useSearchParams } from 'next/navigation';
// internal
import ErrorMsg from "@/components/common/error-msg";
import { useGetAllStructuresQuery } from "@/redux/features/structureApi";
import { handleFilterSidebarClose } from "@/redux/features/shop-filter-slice";
import ShopStructureLoader from "@/components/loader/shop/structure-filter-loader";
import { useGetAllNewProductsQuery } from "@/redux/features/newProductApi";

const StructureFilter = ({setCurrPage,shop_right=false}) => {
  const { data: structures, isError: structureError, isLoading: structureLoading } = useGetAllStructuresQuery();
  const { data: products } = useGetAllNewProductsQuery();
  const router = useRouter();
  const dispatch = useDispatch()
  const searchParams = useSearchParams();
  const structure = searchParams.get('structure');

  // handle structure 
  const handleStructure = (struct) => {
    setCurrPage(1)
    router.push(
      `/${shop_right?'shop-right-sidebar':'shop'}?structure=${struct
        .toLowerCase()
        .split(" ")
        .join("-")}`
    )
    dispatch(handleFilterSidebarClose());
  }
  // decide what to render
  let content = null;

  if (structureLoading) {
    content = <ShopStructureLoader loading={structureLoading}/>;
  }
  if (!structureLoading && structureError) {
    content = <ErrorMsg msg="There was an error" />;
  }
  if (!structureLoading && !structureError && (!structures || !structures.data || structures.data.length === 0)) {
    content = <ErrorMsg msg="No Structures found!" />;
  }
  if (!structureLoading && !structureError && structures && structures.data && structures.data.length > 0) {
    const structure_items = structures.data;
    content = structure_items.map((item, i) => {
      if (item) {
        // Count products with this structure
        const productCount = products?.data?.filter(p => p.structureId?._id === item._id).length || 0;

        return (
          <li key={i}>
            <div className="tp-shop-widget-checkbox-circle">
              <input
                type="checkbox"
                id={item.name}
                checked={
                  structure ===
                  item.name.toLowerCase().replace("&", "").split(" ").join("-")
                }
                readOnly
              />
              <label
                onClick={() => handleStructure(item.name)}
                htmlFor={item.name}
              >
                {item.name}
              </label>
            </div>
            <span className="tp-shop-widget-checkbox-circle-number">
              {productCount}
            </span>
          </li>
        );
      }
    });
  }

  return (
    <>
      <div className="tp-shop-widget mb-50">
        <h3 className="tp-shop-widget-title">Filter by Structure</h3>
        <div className="tp-shop-widget-content">
          <div className="tp-shop-widget-checkbox-circle-list">
            <ul>{content}</ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default StructureFilter; 