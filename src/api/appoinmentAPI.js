import axios from "axios"
import axiosInstance from "./axiosInstance"


export const saveAppointment =(data) =>{
    return axiosInstance.post("/appointment/create", data)
}

export const getAppointmentsByUser = () =>{
    return axiosInstance.get("/appointment/getAppointmentsByUser")
}

export const updateAppointmentStatus = (id, status) =>{
    return  axiosInstance.patch(`/appointment/statusUpdateByDoctor/${id}`, {status})
}

export const showAppointmentsOfDoctor = () =>{
    return axiosInstance.get("/appointment/showAppointmentsOfDoctor");
}

export const updateAppointment  =(id, data) => {
    return axiosInstance.put(`/appointment/update/${id}`, data);}

export const deleteAppointment = (id) => {
  return axiosInstance.delete(`/appointment/deleteAppointment/${id}`);
};