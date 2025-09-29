// src/redux/features/auth/authApi.js
import { apiSlice } from "@/redux/api/apiSlice";
import { userLoggedIn } from "./authSlice";
import Cookies from "js-cookie";

export const authApi = apiSlice.injectEndpoints({
  overrideExisting: true,
  endpoints: (builder) => ({
    // ─── Registration ──────────────────────────
    sendRegistrationOTP: builder.mutation({
      query: (data) => ({
        url: "users/send-otp",
        method: "POST",
        credentials: "include",
        body: data,
      }),
    }),
    verifyOTPAndRegister: builder.mutation({
      query: ({ email, otp }) => ({
        url: "users/verify-otp",
        method: "POST",
        credentials: "include",
        body: { email, otp },
      }),
      async onQueryStarted(arg, { queryFulfilled }) {
        try {
          await queryFulfilled;
        } catch (err) {
          console.error("verifyOTPAndRegister error:", err);
        }
      },
    }),

    // ─── Login / Session ───────────────────────
    loginUser: builder.mutation({
      query: ({ identifier, password }) => ({
        url: "users/login",
        method: "POST",
        credentials: "include",
        body: { identifier, password },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("userInfo", JSON.stringify({ user: data.user }), { expires: 0.5 });
          dispatch(userLoggedIn({ accessToken: data.token, user: data.user }));
        } catch (err) {
          console.error("loginUser error:", err);
        }
      },
    }),
    requestLoginOTP: builder.mutation({
      query: ({ email }) => ({
        url: "users/login/otp/request",
        method: "POST",
        credentials: "include",
        body: { email },
      }),
    }),
    verifyLoginOTP: builder.mutation({
      query: ({ email, otp }) => ({
        url: "users/login/otp/verify",
        method: "POST",
        credentials: "include",
        body: { email, otp },
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          Cookies.set("userInfo", JSON.stringify({ user: data.user }), { expires: 0.5 });
          dispatch(userLoggedIn({ accessToken: data.token, user: data.user }));
        } catch (err) {
          console.error("verifyLoginOTP error:", err);
        }
      },
    }),
    getSessionInfo: builder.query({
      query: ({ userId }) => ({
        url: `users/${userId}/session`,
        credentials: "include",
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data.session.user }));
        } catch (err) {
          console.error("getSessionInfo error:", err);
        }
      },
    }),
    logoutUser: builder.mutation({
      query: ({ userId }) => ({
        url: `users/logout/${userId}`,
        method: "POST",
        credentials: "include",
      }),
    }),

    // ─── Update Profile ────────────────────────
    updateProfile: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `users/${id}`,
        method: "PUT",
        credentials: "include",
        body: data,
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(userLoggedIn({ user: data }));
        } catch (err) {
          console.error("updateProfile error:", err);
        }
      },
    }),

    // ───────────────────────────────────────────
    // ✅ ADD THESE THREE ENDPOINTS
    // ───────────────────────────────────────────

    // 1) Email verification (your component uses a *Query* hook)
    confirmEmail: builder.query({
      // adjust URL if your backend uses a different route
      query: (token) => ({
        url: `users/verify-email/${token}`,
        method: "GET",
        credentials: "include",
      }),
    }),

    // 2) Forgot → send reset mail (your form passes { verifyEmail: email })
    resetPassword: builder.mutation({
      // adjust URL if different on your backend
      query: ({ verifyEmail }) => ({
        url: "users/password/forgot/request",
        method: "POST",
        credentials: "include",
        body: { email: verifyEmail },
      }),
    }),

    // 3) Forgot → confirm new password with token
    confirmForgotPassword: builder.mutation({
      // adjust URL if different on your backend
      query: ({ password, token }) => ({
        url: "users/password/forgot/confirm",
        method: "POST",
        credentials: "include",
        body: { password, token },
      }),
    }),
  }),
});

// Export hooks (add the three new ones here)
export const {
  useSendRegistrationOTPMutation,
  useVerifyOTPAndRegisterMutation,
  useLoginUserMutation,
  useRequestLoginOTPMutation,
  useVerifyLoginOTPMutation,
  useGetSessionInfoQuery,
  useLogoutUserMutation,
  useUpdateProfileMutation,

  // ✅ NEW exports to satisfy your components
  useConfirmEmailQuery,
  useResetPasswordMutation,
  useConfirmForgotPasswordMutation,
} = authApi;
