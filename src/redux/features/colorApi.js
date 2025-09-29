// src/redux/features/colorApi.js
import { apiSlice } from '@/redux/api/apiSlice';

export const colorApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // Single color (not strictly required, but handy)
    getColorById: builder.query({
      query: (id) => ({
        url: `color/${id}`,
        method: 'GET',
        credentials: 'include',
      }),
      transformResponse: (res) => res?.data, // -> { _id, name }
      providesTags: (result, error, id) => [{ type: 'Color', id }],
    }),

    // Batch resolve an array of color ids using multiple GETs
    getColorsByIds: builder.query({
      async queryFn(ids, _api, _opts, baseQuery) {
        if (!Array.isArray(ids) || ids.length === 0) {
          return { data: { items: [], names: [] } };
        }
        const unique = [...new Set(ids)];
        const results = await Promise.all(
          unique.map((id) =>
            baseQuery({ url: `color/${id}`, method: 'GET', credentials: 'include' })
          )
        );
        const items = results
          .map((r) => (r.error ? null : r.data?.data))
          .filter(Boolean); // [{_id,name}]
        const names = items.map((c) => c?.name).filter(Boolean);
        return { data: { items, names } };
      },
      providesTags: (result, error, ids) =>
        Array.isArray(ids) ? ids.map((id) => ({ type: 'Color', id })) : [],
    }),
  }),
});

export const { useGetColorByIdQuery, useGetColorsByIdsQuery } = colorApi;
