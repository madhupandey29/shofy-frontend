import { apiSlice } from "../api/apiSlice";

export const subfinishApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSubfinishes: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/subfinish/`,
      providesTags: ["Subfinish"],
    }),

    getSubfinish: builder.query({
      query: (id) =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/subfinish/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Subfinish", id }],
    }),
  }),
});

export const {
  useGetAllSubfinishesQuery,
  useGetSubfinishQuery,
} = subfinishApi;
