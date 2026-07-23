import { axiosInstance } from "@/lib/axios";
import type { LoginInputTypes, SignupInputTypes, ResetPasswordRequestInputTypes, ResetPasswordInputTypes, VerifyResetPasswordTokenInputTypes } from "@/schema/auth";

export const authService = {
  signup: async (data: SignupInputTypes) => {
    const response = await axiosInstance.post("/api/auth/v1/signup", data);
    return response.data;
  },

  login: async (data: LoginInputTypes) => {
    const response = await axiosInstance.post("/api/auth/v1/login", data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post("/api/auth/v1/logout");
    return response.data;
  },

  forgetPassword: async (data: ResetPasswordRequestInputTypes) => {
    const response = await axiosInstance.post("/api/auth/v1/forget-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordInputTypes) => {
    const response = await axiosInstance.post("/api/auth/v1/reset-password", data);
    return response.data;
  },

  verifyResetPasswordToken: async (data: VerifyResetPasswordTokenInputTypes) => {
    const response = await axiosInstance.post("/api/auth/v1/verify-reset-password-token", data);
    return response.data;
  },

  // Get Current User Session
  getMe: async () => {
    const response = await axiosInstance.get("/api/auth/v1/me");
    return response.data;
  }
};
