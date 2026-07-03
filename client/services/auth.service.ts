import axiosInstance from "@/lib/axios";
import { LoginInputTypes, SignupInputTypes, ForgetPasswordRequestInput, ResetPasswordInput, VerifyResetPasswordTokenInput } from "@/schema/auth";

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

  forgetPassword: async (data: ForgetPasswordRequestInput) => {
    const response = await axiosInstance.post("/api/auth/v1/forget-password", data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordInput) => {
    const response = await axiosInstance.post("/api/auth/v1/reset-password", data);
    return response.data;
  },

  verifyResetPasswordToken: async (data: VerifyResetPasswordTokenInput) => {
    const response = await axiosInstance.post("/api/auth/v1/verify-reset-password-token", data);
    return response.data;
  },

  testAuth: async () => {
    const response = await axiosInstance.get("/api/auth/test-auth");
    return response.data;
  },
};
