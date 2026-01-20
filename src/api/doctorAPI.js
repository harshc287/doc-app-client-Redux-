import axiosInstance from "./axiosInstance";


export const applyDoctor = (data) => {
    return axiosInstance.post("/doctor/apply", data)
}

/**
 * Get logged-in doctor's info (DOCTOR)
 */
export const getDoctorInfo = () => {
  return axiosInstance.get("/doctor/getDoctorInfo");
};

/**
 * Update doctor profile (DOCTOR)
 */
export const updateDoctor = (data) => {
  return axiosInstance.patch("/doctor/updateDoctor", data);
};

/**
 * Get all doctors (ADMIN)
 */
export const getAllDoctors = () => {
  return axiosInstance.get("/doctor/getAllDoctors");
};

/**
 * Accept / Reject doctor (ADMIN)
 */
export const updateDoctorStatus = (doctorId, status) => {
  return axiosInstance.patch(`/doctor/docStatus/${doctorId}`, { status });
};

/**
 * Delete doctor (ADMIN)
 */
export const deleteDoctor = (doctorId) => {
  return axiosInstance.delete(`/doctor/deleteDoctor/${doctorId}`);
};

export const getDoctorApplicationStatus = () => {
  return axiosInstance.get("/doctor/application-status");
};