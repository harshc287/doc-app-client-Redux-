import React, { useEffect, useState, useCallback } from "react";
import {
  getLoggedUser,
  uploadProfileImage,
  // updateUserProfile,
} from "../api/userAPI";
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

  const fetchUser = useCallback(async () => {
    try {
      const res = await getLoggedUser();
      if (res.data.success) {
        setUser(res.data.user);
        setFormData({
          name: res.data.user.name || "",
          email: res.data.user.email || "",
          contactNumber: res.data.user.contactNumber || "",
          address: res.data.user.address || "",
        });
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
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image");
      return;
    }

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
    } catch {
      alert("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateUserProfile(formData);
      setEditMode(false);
      fetchUser();
    } catch {
      alert("Profile update failed");
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

  if (loading)
    return (
      <div className="d-flex justify-content-center align-items-center profile-loader">
        <div className="spinner-border text-primary" />
      </div>
    );

  if (!user)
    return (
      <div className="text-center text-muted py-5">
        <FaUser size={42} />
        <p>Profile not found</p>
      </div>
    );

  return (
    <div className="container profile-container">
      {/* HEADER */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="text-white fw-bold">My Profile</h3>
          <p className="text-muted">
            Manage your personal information and settings
          </p>
        </div>
        <button
          className="btn btn-secondary"
          onClick={() => setEditMode(!editMode)}
        >
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
              <button
                className="btn btn-success w-100 mt-3"
                onClick={handleUpload}
                disabled={uploading}
              >
                <FaUpload className="me-2" />
                {uploading ? "Uploading..." : "Upload Image"}
              </button>
            )}

            <div className={`role-badge ${getRoleBadge(user.role)} mt-4`}>
              {user.role === "Doctor" && <FaUserMd className="me-2" />}
              {user.role === "Admin" && <FaShieldAlt className="me-2" />}
              {user.role}
            </div>

            <div className="mt-4 small text-muted">
              <div>Joined: {new Date(user.createdAt).toLocaleDateString()}</div>
              <div>Updated: {new Date(user.updatedAt).toLocaleDateString()}</div>
            </div>
          </div>
        </div>

        {/* RIGHT */}
        <div className="col-lg-8">
          <div className="glass-card">
            <h5 className="text-white fw-bold mb-4">Personal Information</h5>

            <Field icon={<FaUser />} label="Full Name" editMode={editMode} name="name" value={formData.name} onChange={handleChange} />
            <Field icon={<FaEnvelope />} label="Email" editMode={editMode} name="email" value={formData.email} onChange={handleChange} />
            <Field icon={<FaPhone />} label="Contact Number" editMode={editMode} name="contactNumber" value={formData.contactNumber} onChange={handleChange} />
            <Field icon={<FaMapMarkerAlt />} label="Address" editMode={editMode} textarea name="address" value={formData.address} onChange={handleChange} />

            {editMode && (
              <button className="btn btn-primary mt-3" onClick={handleSave} disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            )}
          </div>
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
