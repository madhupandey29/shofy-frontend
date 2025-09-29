import { apiSlice } from "../api/apiSlice";

export const substructureApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllSubstructures: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/substructure/`,
      providesTags: ["Structure"],   // ✅ use Structure
    }),

    getSubstructure: builder.query({
      query: (id) =>
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/substructure/${id}`,
      providesTags: (_res, _err, id) => [{ type: "Structure", id }], // ✅ consistent
    }),
  }),
});

export const {
  useGetAllSubstructuresQuery,
  useGetSubstructureQuery,
} = substructureApi;
