import { apiSlice } from "../api/apiSlice";

export const newProductApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllNewProducts: builder.query({
      query: () => "/product/",
    }),
    getSingleNewProduct: builder.query({
      query: (slug) => `/product/slug/${slug}`,
    }),
    addNewProduct: builder.mutation({
      query: (data) => ({
        url: "/product/",
        method: "POST",
        body: data,
      }),
    }),
    updateNewProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/product/${id}`,
        method: "PUT",
        body: data,
      }),
    }),
    deleteNewProduct: builder.mutation({
      query: (id) => ({
        url: `/product/${id}`,
        method: "DELETE",
      }),
    }),
    searchNewProduct: builder.query({
      query: (q) => `/product/search/${q}`,
    }),
    getGroupCodeProducts: builder.query({
      query: (groupcodeId) => `/product/groupcode/${groupcodeId}`,
    }),
    getCategoryProducts: builder.query({
      query: (id) => `/product/category/${id}`,
    }),
    getStructureProducts: builder.query({
      query: (id) => `/product/structure/${id}`,
    }),
    getContentProducts: builder.query({
      query: (id) => `/product/content/${id}`,
    }),
    getFinishProducts: builder.query({
      query: (id) => `/product/finish/${id}`,
    }),
    getDesignProducts: builder.query({
      query: (id) => `/product/design/${id}`,
    }),
    getColorProducts: builder.query({
      query: (id) => `/product/color/${id}`,
    }),
    getMotifProducts: builder.query({
      query: (id) => `/product/motif/${id}`,
    }),
    // Get SEO by Product ID
    getSeoByProduct: builder.query({
      query: (productId) => `/seo/product/${productId}`,
    }),
    getSuitableProducts: builder.query({
      query: (id) => `/product/suitable/${id}`,
    }),
    getVendorProducts: builder.query({
      query: (id) => `/product/vendor/${id}`,
    }),
    getIdentifierProducts: builder.query({
      query: (identifier) => `/product/identifier/${identifier}`,
    }),
    getGsmUpto: builder.query({
      query: (value) => `/product/gsm/${value}`,
    }),
    getOzUpto: builder.query({
      query: (value) => `/product/oz/${value}`,
    }),
    getInchUpto: builder.query({
      query: (value) => `/product/inch/${value}`,
    }),
    getCmUpto: builder.query({
      query: (value) => `/product/cm/${value}`,
    }),
    getPriceUpto: builder.query({
      query: (value) => `/product/price/${value}`,
    }),
    getQuantityUpto: builder.query({
      query: (value) => `/product/quantity/${value}`,
    }),
    getPurchasePriceUpto: builder.query({
      query: (value) => `/product/purchaseprice/${value}`,
    }),
    getGroupCodeById: builder.query({
      query: (id) => `/groupcode/view/${id}`,
    }),
    getPopularNewProducts: builder.query({
      query: () => "/seo/popular",
    }),
   /*  getOffers: builder.query({
      query: () => "/product/offers",
    }), */
    getTopRated: builder.query({
      query: () => "/seo/top-rated",
    }),
  }),
});

export const {
  useGetAllNewProductsQuery,
  useGetSingleNewProductQuery,
  useAddNewProductMutation,
  useUpdateNewProductMutation,
  useDeleteNewProductMutation,
  useSearchNewProductQuery,
  useGetGroupCodeProductsQuery,
  useGetCategoryProductsQuery,
  useGetStructureProductsQuery,
  useGetContentProductsQuery,
  useGetFinishProductsQuery,
  useGetDesignProductsQuery,
  useGetColorProductsQuery,
  useGetMotifProductsQuery,
  useGetSuitableProductsQuery,
  useGetVendorProductsQuery,
  useGetIdentifierProductsQuery,
  useGetGsmUptoQuery,
  useGetOzUptoQuery,
  useGetInchUptoQuery,
  useGetCmUptoQuery,
  useGetPriceUptoQuery,
  useGetQuantityUptoQuery,
  useGetPurchasePriceUptoQuery,
  useGetGroupCodeByIdQuery,
  useGetPopularNewProductsQuery,
  useGetOffersQuery,
  useGetTopRatedQuery,
} = newProductApi; 