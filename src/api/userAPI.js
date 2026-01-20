import axios from "axios";
import axiosInstance from "./axiosInstance";



export const registerUser= (data) =>{
    return axiosInstance.post("/user/register",data)
}

export const loginUser = (data) => {
    return axiosInstance.post("/user/login", data)
}

export const getLoggedUser = () => {
  return axiosInstance.get("/user/getUserInfo")
}

export const getDoctorList = () =>{
    return axiosInstance.get("/user/doctorList")
}


export const uploadProfileImage = (formData) => {
  return axiosInstance.post("/user/upload-profile", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

export const getAllUsers = () => {
  return axiosInstance.get("/user/getAllUsers");
};

export const updateUserProfile = (data) => {
  return axiosInstance.patch("/user/updateProfile", data);
};

