import { apiSlice } from "../api/apiSlice";

export const structureApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    getAllStructures: builder.query({
      query: () => `${process.env.NEXT_PUBLIC_API_BASE_URL}/structure/`,
      providesTags: ['Structure']
    }),
    getStructure: builder.query({
      query: (id) => `${process.env.NEXT_PUBLIC_API_BASE_URL}/structure/${id}`,
      providesTags: (result, error, id) => [{ type: "Structure", id }],
    }),
  }),
});

export const { useGetAllStructuresQuery, useGetStructureQuery } = structureApi; 