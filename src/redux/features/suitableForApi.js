import { apiSlice } from "../api/apiSlice";

export const suitableForApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getSuitableForById: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/suitablefor/${id}`,
      providesTags: (result, error, id) => [{ type: "SuitableFor", id }],
    }),
  }),
});

export const {
  useGetSuitableForByIdQuery,
} = suitableForApi; 