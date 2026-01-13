import axiosInstance from "./axiosInstance";

export const getDashboardStats = () => {
  return axiosInstance.get("/dashboard/data");
};