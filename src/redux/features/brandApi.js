import { apiSlice } from "../api/apiSlice";

export const brandApi = apiSlice.injectEndpoints({
  overrideExisting:true,
  endpoints: (builder) => ({
    getActiveBrands: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/brand/active`
    }),
  }),
});

export const {
 useGetActiveBrandsQuery
} = brandApi;
