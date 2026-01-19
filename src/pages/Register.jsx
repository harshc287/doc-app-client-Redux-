import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUserThunk, resetRegisterState } from "../auth/authSlice";
import {
  FaUser,
  FaEnvelope,
  FaLock,
  FaPhone,
  FaMapMarkerAlt,
  FaUserPlus,
} from "react-icons/fa";

const Register = () => {
  const dispatch = useDispatch()
  const {loading, error, success} = useSelector((state) => state.auth)

  const [formData, setFormData] = useState({
  name: "",
  email: "",
  password: "",
  contactNumber: "",
  address: "",
  })
  



  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit =  (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password || !formData.contactNumber) {
      alert("Please fill in all required fields");
      return;
    }

      dispatch(registerUserThunk(formData));
  };

  useEffect(()=>{
    if(success){
      setTimeout(()=>{navigate("/")

      }, 2000)
    }
  }, [success, navigate])

  return (
    <div className="register-page">
      <div className="container d-flex justify-content-center align-items-center min-vh-100">
        <div className="w-100" style={{ maxWidth: "720px" }}>
          {/* Header */}
          <div className="text-center mb-4">
            <div className="d-flex justify-content-center align-items-center gap-3 mb-3">
              <FaUserPlus className="icon-indigo" size={40} />
              <h1 className="text-white fw-bold m-0">Create Account</h1>
            </div>
            <p className="text-muted">
              Join our secure healthcare platform
            </p>
          </div>

          {/* Card */}
          <div className="card dark-card p-4 p-md-5">
            {error && (
              <div className="alert alert-danger dark-alert">
                {error}
              </div>
            )}

            {success && (
              <div className="alert alert-success dark-alert">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit} className="row g-4">
              {/* Name */}
              <div className="col-md-6">
                <label className="form-label text-light">
                  <FaUser className="me-2" />
                  Full Name *
                </label>
                <input
                  type="text"
                  name="name"
                  className="form-control dark-input"
                  placeholder="Enter your full name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              {/* Email */}
              <div className="col-md-6">
                <label className="form-label text-light">
                  <FaEnvelope className="me-2" />
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  className="form-control dark-input"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password */}
              <div className="col-md-6">
                <label className="form-label text-light">
                  <FaLock className="me-2" />
                  Password *
                </label>
                <input
                  type="password"
                  name="password"
                  className="form-control dark-input"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>

              {/* Phone */}
              <div className="col-md-6">
                <label className="form-label text-light">
                  <FaPhone className="me-2" />
                  Contact Number *
                </label>
                <input
                  type="tel"
                  name="contactNumber"
                  className="form-control dark-input"
                  placeholder="Enter phone number"
                  value={formData.contactNumber}
                  onChange={handleChange}
                />
              </div>

              {/* Address */}
              <div className="col-12">
                <label className="form-label text-light">
                  <FaMapMarkerAlt className="me-2" />
                  Address
                </label>
                <textarea
                  name="address"
                  rows="3"
                  className="form-control dark-input"
                  placeholder="Enter your address"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>

              {/* Submit */}
              <div className="col-12">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn gradient-btn w-100 py-3"
                >
                  {loading ? (
                    <span className="d-flex align-items-center justify-content-center">
                      <span className="spinner-border spinner-border-sm me-2" />
                      Creating Account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </div>

              {/* Login */}
              <div className="col-12 text-center">
                <p className="text-muted">
                  Already have an account?{" "}
                  <Link to="/" className="link-indigo">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
