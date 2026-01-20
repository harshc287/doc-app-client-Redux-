import React, { useEffect, useState } from "react";
import { getAllDoctors, updateDoctorStatus, deleteDoctor } from "../api/doctorAPI";
import { getLoggedUser } from "../api/userAPI";
import {
  FaUserMd,
  FaStethoscope,
  FaMoneyBillWave,
  FaEnvelope,
  FaPhone,
  FaStar,
} from "react-icons/fa";

const DoctorList = () => {
  const [doctors, setDoctors] = useState([]);
  const [user, setUser] = useState(null); // 🔹 added
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");
  const [sortBy, setSortBy] = useState("name-asc");

  useEffect(() => {
    fetchDoctors();
    fetchUser(); // 🔹 added
  }, []);

  const fetchUser = async () => {
    const res = await getLoggedUser();
    if (res.data.success) setUser(res.data.user);
  };

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const res = await getAllDoctors();
      if (res.data.success) {
        setDoctors(res.data.doctors);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // 🔹 added
  const handleStatusChange = async (doctorId, status) => {
    try {
      await updateDoctorStatus(doctorId, status);

      // refresh doctor list
      fetchDoctors();

      // 🔥 refresh logged-in user data
      if (status === "Accepted" || status === "Rejected") {
        window.dispatchEvent(new Event("user-updated"));
      }
    } catch (err) {
      console.error(err);
    }
  };


  //delete doctor
  const handleDeleteDoctor = async (doctorId) => {
    if (!window.confirm("Delete this doctor?")) return;

    try {
      await deleteDoctor(doctorId);
      fetchDoctors(); // refresh list
    } catch (error) {
      console.error(error);
    }
  };


  const specialties = ["all", ...new Set(doctors.map(d => d.specialist).filter(Boolean))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.createdBy?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialist?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSpecialty =
      specialtyFilter === "all" || doctor.specialist === specialtyFilter;

    // 🔹 non-admins see only accepted doctors
    if (user?.role !== "Admin" && doctor.status !== "Accepted") {
      return false;
    }

    return matchesSearch && matchesSpecialty;
  })

  .sort((a, b) => {
    if (sortBy === "name-asc") {
      return a.createdBy?.name.localeCompare(b.createdBy?.name);
    }

    if (sortBy === "fee-low") {
      return a.fees - b.fees;
    }

    if (sortBy === "fee-high") {
      return b.fees - a.fees;
    }

    return 0;
  });

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center loader-box">
        <div className="spinner-border text-primary"></div>
      </div>
    );
  }

  return (
    <div className="doctor-page">

      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-4 gap-3">
        <div>
          <h3 className="page-title">👨‍⚕️ Medical Professionals</h3>
          <p className="text-secondary">Find and connect with certified doctors</p>
        </div>
        <span className="text-muted small">
          {filteredDoctors.length} doctors available
        </span>
      </div>

      {/* Filters */}
      <div className="glass-card mb-4">
        <div className="row g-3">
          <div className="col-md-4">
            <label className="form-label">Search Doctors</label>
            <input
              type="text"
              className="form-control dark-input"
              placeholder="Search by name or specialty..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="col-md-4">
            <label className="form-label">Filter by Specialty</label>
            <select
              className="form-select dark-input"
              value={specialtyFilter}
              onChange={(e) => setSpecialtyFilter(e.target.value)}
            >
              {specialties.map((sp) => (
                <option key={sp} value={sp}>
                  {sp === "all" ? "All Specialties" : sp}
                </option>
              ))}
            </select>
          </div>

          <div className="col-md-4">
            <label className="form-label">Sort By</label>
            <select
              className="form-select dark-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="name-asc">Name (A–Z)</option>
              <option value="fee-low">Fees (Low to High)</option>
              <option value="fee-high">Fees (High to Low)</option>
            </select>
          </div>
        </div>

      </div>

      {/* Doctors */}
      {filteredDoctors.length === 0 ? (
        <div className="empty-box">
          <FaUserMd size={42} />
          <h5>No Doctors Found</h5>
          <p>Try adjusting your search criteria</p>
        </div>
      ) : (
        <div className="row g-4">
          {filteredDoctors.map((doctor) => (
            <div key={doctor._id} className="col-md-6 col-lg-4">
              <div className="doctor-card">

                {/* Header */}
                <div className="d-flex gap-3 mb-4">
                  <div className="avatar">
                    {doctor.createdBy?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h5 className="doctor-name">
                      Dr. {doctor.createdBy?.name}
                    </h5>
                    <span className="badge specialty-badge">
                      <FaStethoscope className="me-1" />
                      {doctor.specialist || "General Physician"}
                    </span>

                  </div>

                </div>
                <span
                  className={`badge mt-2 ${doctor.status === "Accepted"
                    ? "bg-success"
                    : doctor.status === "Rejected"
                      ? "bg-danger"
                      : "bg-warning"
                    }`}
                >
                  {doctor.status}
                </span>

                {/* Info */}
                <div className="info-list">
                  <Info icon={<FaMoneyBillWave />} label="Consultation Fee" value={`₹${doctor.fees}`} />
                  <Info icon={<FaEnvelope />} label="Email" value={doctor.createdBy?.email} />
                  {doctor.createdBy?.contactNumber && (
                    <Info icon={<FaPhone />} label="Contact" value={doctor.createdBy.contactNumber} />
                  )}
                </div>

                {/* Actions (UI SAME, LOGIC CHANGED) */}
                <div className="card-actions">

                  {/* 🔹 ADMIN - PENDING */}
                  {user?.role === "Admin" && doctor.status === "Pending" && (
                    <>
                      <button
                        className="btn btn-success w-100"
                        onClick={() => handleStatusChange(doctor._id, "Accepted")}
                      >
                        Accept
                      </button>

                      <button
                        className="btn btn-danger w-100"
                        onClick={() => handleStatusChange(doctor._id, "Rejected")}
                      >
                        Reject
                      </button>
                    </>
                  )}

                  {/* 🔹 ADMIN - AFTER REVIEW */}
                  {user?.role === "Admin" && doctor.status !== "Pending" && (
                    <button
                      className="btn btn-outline-danger w-100"
                      onClick={() => handleDeleteDoctor(doctor._id)}
                    >
                      Delete Doctor
                    </button>
                  )}

                  {/* 🔹 USER */}
                  {user?.role !== "Admin" && doctor.status === "Accepted" && (
                    <>
                      <button className="btn btn-primary w-100">
                        Book Appointment
                      </button>
                      <button className="btn btn-secondary">
                        View Profile
                      </button>
                    </>
                  )}

                </div>


              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Info = ({ icon, label, value }) => (
  <div className="info-item">
    {icon}
    <div>
      <small>{label}</small>
      <p>{value}</p>
    </div>
  </div>
);

export default DoctorList;
