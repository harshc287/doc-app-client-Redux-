import { useDispatch, useSelector } from "react-redux";
import{loginUserThunk } from "../auth/authSlice"
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaSignInAlt, FaEnvelope, FaLock, FaHospital } from "react-icons/fa";



const Login = () => {

  const dispatch = useDispatch()
  const {loading, error, isAuthenticated } = useSelector(
    (state) => state.auth
  )

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(loginUserThunk({email, password}))

  };

  useEffect(() => {
    if(isAuthenticated){
      navigate("/dashboard", {replace: true})
    }
  }, [isAuthenticated, navigate])

  return (
    <div className="login-wrapper d-flex align-items-center justify-content-center">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-5 col-lg-4">
            {/* Header */}
            <div className="text-center mb-4">
              <FaHospital className="icon-logo mb-2" />
              <h2 className="text-white fw-bold">MediCare</h2>
              <p className="text-muted">Secure Healthcare Management System</p>
            </div>

            {/* Card */}
            <div className="card shadow-lg p-4 rounded-4">
              <h4 className="text-white mb-3 d-flex align-items-center gap-2">
                <FaSignInAlt className="text-primary" />
                Welcome Back
              </h4>

              {error && (
                <div className="alert alert-danger">{error}</div>
              )}

              <form onSubmit={handleSubmit}>
                {/* Email */}
                <div className="mb-3">
                  <label className="form-label text-light">
                    <FaEnvelope className="me-2" />
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="form-control form-control-lg"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                {/* Password */}
                <div className="mb-4">
                  <label className="form-label text-light">
                    <FaLock className="me-2" />
                    Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary btn-lg w-100"
                  disabled={loading}
                >
                  {loading ? "Signing in..." : "Sign In"}
                </button>
              </form>

              <p className="text-center mt-4 text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-primary fw-semibold">
                  Sign up now
                </Link>
              </p>
            </div>

            {/* Footer */}
            <div className="text-center mt-4 text-secondary small">
              © {new Date().getFullYear()} MediCare
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
