import React, { useEffect, useState, useCallback } from "react";
import {
  getLoggedUser,
  uploadProfileImage,
  updateUserProfile,
} from "../api/userAPI";
import { getDoctorInfo, updateDoctor } from "../api/doctorAPI";

import {
  FaUser,
  FaEnvelope,
  FaPhone,
  FaMapMarkerAlt,
  FaCamera,
  FaUpload,
  FaUserMd,
  FaShieldAlt,
} from "react-icons/fa";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [editMode, setEditMode] = useState(false);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  // Doctor states
  const [doctorProfile, setDoctorProfile] = useState(null);
  const [doctorEdit, setDoctorEdit] = useState(false);
  const [doctorForm, setDoctorForm] = useState({
    specialist: "",
    fees: "",
  });

  const fetchUser = useCallback(async () => {
    try {
      const res = await getLoggedUser();
      if (res.data.success) {
        const u = res.data.user;
        setUser(u);
        setFormData({
          name: u.name || "",
          email: u.email || "",
          contactNumber: u.contactNumber || "",
          address: u.address || "",
        });

        if (u.role === "Doctor") {
          const docRes = await getDoctorInfo();
          if (docRes.data.success) {
            setDoctorProfile(docRes.data.doctor);
            setDoctorForm({
              specialist: docRes.data.doctor.specialist || "",
              fees: docRes.data.doctor.fees || "",
            });
          }
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
    return () => preview && URL.revokeObjectURL(preview);
  }, [fetchUser, preview]);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!image) return;
    const fd = new FormData();
    fd.append("profileImage", image);

    try {
      setUploading(true);
      await uploadProfileImage(fd);
      setImage(null);
      setPreview(null);
      fetchUser();
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleDoctorChange = (e) => {
    setDoctorForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile(formData);
      setEditMode(false);
      fetchUser();
    } finally {
      setSaving(false);
    }
  };

  const handleDoctorSave = async () => {
    try {
      setSaving(true);
      await updateDoctor(doctorForm);
      setDoctorEdit(false);
      fetchUser();
    } finally {
      setSaving(false);
    }
  };

  const getRoleBadge = (role) =>
    ({
      Admin: "badge-admin",
      Doctor: "badge-doctor",
      User: "badge-user",
    }[role] || "badge-user");

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center profile-loader">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="container profile-container">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-white fw-bold">My Profile</h3>
          <p className="text-muted">Manage your information</p>
        </div>
        <button className="btn btn-secondary" onClick={() => setEditMode(!editMode)}>
          {editMode ? "Cancel Edit" : "Edit Profile"}
        </button>
      </div>

      <div className="row g-4">
        {/* LEFT */}
        <div className="col-lg-4">
          <div className="glass-card text-center">
            <div className="profile-img-wrapper">
              <img
                src={
                  preview ||
                  (user.profileImage
                    ? `http://localhost:7005${user.profileImage}`
                    : `https://ui-avatars.com/api/?name=${user.name}`)
                }
                alt="profile"
              />
              <label className="camera-btn">
                <FaCamera />
                <input type="file" hidden onChange={handleFileChange} />
              </label>
            </div>

            {image && (
              <button className="btn btn-success w-100 mt-3" onClick={handleUpload}>
                <FaUpload className="me-2" /> Upload Image
              </button>
            )}

            <div className={`role-badge ${getRoleBadge(user.role)} mt-4`}>
              {user.role === "Doctor" && <FaUserMd className="me-2" />}
              {user.role === "Admin" && <FaShieldAlt className="me-2" />}
              {user.role}
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-white fw-bold mb-4">Personal Information</h5>

            <Field icon={<FaUser />} label="Name" editMode={editMode} name="name" value={formData.name} onChange={handleChange} />
            <Field icon={<FaEnvelope />} label="Email" editMode={editMode} name="email" value={formData.email} onChange={handleChange} />
            <Field icon={<FaPhone />} label="Contact" editMode={editMode} name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <Field icon={<FaMapMarkerAlt />} label="Address" editMode={editMode} textarea name="address" value={formData.address} onChange={handleChange} />

            {editMode && (
              <button className="btn btn-primary mt-3" onClick={handleSave}>
                Save Changes
              </button>
            )}
          </div>

          {/* DOCTOR INFO (SAME UI STYLE) */}
          {user.role === "Doctor" && doctorProfile && (
            <div className="glass-card mt-4">
              <div className="d-flex justify-content-between mb-3">
                <h5 className="text-white fw-bold">Doctor Information</h5>
                <button className="btn btn-secondary btn-sm" onClick={() => setDoctorEdit(!doctorEdit)}>
                  {doctorEdit ? "Cancel" : "Edit"}
                </button>
              </div>

              <div className="mb-3">
                <label className="text-muted">Speciality</label>
                {doctorEdit ? (
                  <input className="form-control dark-input" name="specialist" value={doctorForm.specialist} onChange={handleDoctorChange} />
                ) : (
                  <p className="text-white">{doctorProfile.specialist}</p>
                )}
              </div>

              <div className="mb-3">
                <label className="text-muted">Fees</label>
                {doctorEdit ? (
                  <input type="number" className="form-control dark-input" name="fees" value={doctorForm.fees} onChange={handleDoctorChange} />
                ) : (
                  <p className="text-white">₹{doctorProfile.fees}</p>
                )}
              </div>

              {doctorEdit && (
                <button className="btn btn-primary" onClick={handleDoctorSave}>
                  Save Doctor Info
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const Field = ({ icon, label, editMode, textarea, ...props }) => (
  <div className="mb-4">
    <label className="text-muted mb-2 d-flex align-items-center gap-2">
      {icon} {label}
    </label>
    {editMode ? (
      textarea ? (
        <textarea className="form-control dark-input" rows="3" {...props} />
      ) : (
        <input className="form-control dark-input" {...props} />
      )
    ) : (
      <p className="text-white fs-6">{props.value || "Not provided"}</p>
    )}
  </div>
);

export default Profile;
