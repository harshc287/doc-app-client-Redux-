import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../api/doctorAPI";
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
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("all");

  useEffect(() => {
    fetchDoctors();
  }, []);

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

  const specialties = ["all", ...new Set(doctors.map(d => d.specialist).filter(Boolean))];

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doctor.specialist?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecialty =
      specialtyFilter === "all" || doctor.specialist === specialtyFilter;
    return matchesSearch && matchesSpecialty;
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
          <p className="text-muted">Find and connect with certified doctors</p>
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
            <select className="form-select dark-input">
              <option>Name (A-Z)</option>
              <option>Experience</option>
              <option>Fees (Low to High)</option>
              <option>Fees (High to Low)</option>
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
                    {doctor.user?.name?.charAt(0) || "D"}
                  </div>
                  <div>
                    <h5 className="doctor-name">
                      Dr. {doctor.user?.name}
                    </h5>
                    <span className="badge specialty-badge">
                      <FaStethoscope className="me-1" />
                      {doctor.specialist || "General Physician"}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="info-list">
                  <Info icon={<FaMoneyBillWave />} label="Consultation Fee" value={`₹${doctor.fees}`} />
                  <Info icon={<FaEnvelope />} label="Email" value={doctor.user?.email} />
                  {doctor.user?.contactNumber && (
                    <Info icon={<FaPhone />} label="Contact" value={doctor.user.contactNumber} />
                  )}
                  <div className="info-item">
                    <FaStar className="text-warning" />
                    <div>
                      <small>Rating</small>
                      <div className="rating">
                        {[1,2,3,4,5].map((s) => (
                          <FaStar key={s} className={s <= 4 ? "text-warning" : "text-secondary"} />
                        ))}
                        <span>4.8</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="card-actions">
                  <button className="btn btn-primary w-100">
                    Book Appointment
                  </button>
                  <button className="btn btn-secondary">
                    View Profile
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Footer Stats */}
      <div className="glass-card mt-5">
        <div className="row text-center">
          <Stat value={doctors.length} label="Total Doctors" />
          <Stat value={specialties.length - 1} label="Specialties" />
          <Stat
            value={
              Math.floor(
                doctors.reduce((a, d) => a + d.fees, 0) / doctors.length
              ) || 0
            }
            label="Avg. Fee"
          />
          <Stat value="24/7" label="Availability" />
        </div>
      </div>
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

const Stat = ({ value, label }) => (
  <div className="col-md-3">
    <h4>{value}</h4>
    <small>{label}</small>
  </div>
);

export default DoctorList;
