import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const seoApi = createApi({
  reducerPath: 'seoApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_BASE_URL}`,
    prepareHeaders: (headers) => {
      // Add API key to all requests
      headers.set('x-api-key', process.env.NEXT_PUBLIC_API_KEY);
      headers.set('Content-Type', 'application/json');
      
      // Add admin email for admin routes if needed
      if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
        headers.set('x-admin-email', process.env.NEXT_PUBLIC_ADMIN_EMAIL);
      }
      
      return headers;
    },
  }),
  tagTypes: ['SEO'],
  endpoints: (builder) => ({
    getSeoByProduct: builder.query({
      query: (productId) => ({
        url: `/seo/product/${productId}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'SEO', id }],
    }),
  }),
});

export const {
  useGetSeoByProductQuery,
} = seoApi;
