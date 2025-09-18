import Cookies from "js-cookie";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api", // ✅ safer: always declare reducerPath
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: (headers) => {
      // Add API key to all requests
      headers.set("x-api-key", process.env.NEXT_PUBLIC_API_KEY);
      headers.set("Content-Type", "application/json");

      // Add admin email for admin routes
      if (typeof window !== "undefined") {
        const path = window.location.pathname;
        if (path.startsWith("/admin")) {
          headers.set("x-admin-email", process.env.NEXT_PUBLIC_ADMIN_EMAIL);
        }
      }

      // Existing authentication logic
      const userInfo = Cookies.get("userInfo");
      if (userInfo) {
        try {
          const user = JSON.parse(userInfo);
          if (user?.accessToken) {
            headers.set("Authorization", `Bearer ${user.accessToken}`);
          }
        } catch (error) {
          Cookies.remove("userInfo");
        }
      }
      return headers;
    },
  }),

  // ✅ Prevent non-serializable Request/Response objects from being stored in Redux
  serializeQueryArgs: ({ endpointName }) => endpointName,

  endpoints: (builder) => ({
    // Filter endpoints
    getFilterOptions: builder.query({
      query: (endpoint) => ({
        url: endpoint,
        method: "GET",
      }),
      providesTags: (_, __, endpoint) => {
        const tagMap = {
          "/category/": "Category",
          "/color/": "Color",
          "/content/": "Content",
          "/design/": "Design",
          "/structure/": "Structure",
          "/substructure/": "Structure",
          "/finish/": "Finish",
          "/subfinish/": "Finish",
          "/groupcode/": "GroupCode",
          "/vendor/": "Vendor",
          "/suitablefor/": "SuitableFor",
          "/subsuitable/": "SuitableFor",
          "/motifsize/": "MotifSize",
        };

        const tagType = tagMap[endpoint] || "Filter";
        return [{ type: tagType, id: endpoint }];
      },
    }),

    // ... other endpoints
  }),

  tagTypes: [
    "Products",
    "Coupon",
    "Product",
    "RelatedProducts",
    "UserOrder",
    "UserOrders",
    "ProductType",
    "OfferProducts",
    "PopularProducts",
    "TopRatedProducts",
    "NewProducts",
    "Structure",
    "Content",
    "Finish",
    "Design",
    "Color",
    "MotifSize",
    "SuitableFor",
    "Vendor",
    "PopularNewProducts",
    "OfferNewProducts",
    "TopRatedNewProducts",
    "Category",
    "GroupCode",
    "Filter",
    "Substructure",
    "Subfinish",
    "Subsuitable",
    "Group",
  ],
});

// Export hooks for usage in components
export const { useGetFilterOptionsQuery } = apiSlice;
