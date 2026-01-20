import React, { useEffect, useState } from "react";
import { getDoctorInfo, updateDoctorProfile } from "../api/doctorAPI";

const DoctorProfile = () => {
  const [doctor, setDoctor] = useState(null);
  const [edit, setEdit] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    specialist: "",
    fees: "",
  });

  const fetchDoctor = async () => {
    const res = await getDoctorInfo();
    setDoctor(res.data.doctor);
    setFormData({
      specialist: res.data.doctor.specialist || "",
      fees: res.data.doctor.fees || "",
    });
  };

  useEffect(() => {
    fetchDoctor();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      await updateDoctorProfile(formData);
      setEdit(false);
      fetchDoctor();
    } catch {
      alert("Update failed");
    } finally {
      setLoading(false);
    }
  };

  if (!doctor) return null;

  return (
    <div className="glass-card">
      <h4>Doctor Profile</h4>

      <label>Speciality</label>
      {edit ? (
        <input
          className="form-control"
          name="specialist"
          value={formData.specialist}
          onChange={handleChange}
        />
      ) : (
        <p>{doctor.specialist}</p>
      )}

      <label className="mt-3">Fees</label>
      {edit ? (
        <input
          type="number"
          className="form-control"
          name="fees"
          value={formData.fees}
          onChange={handleChange}
        />
      ) : (
        <p>₹ {doctor.fees}</p>
      )}

      {edit ? (
        <button
          className="btn btn-success mt-3"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? "Saving..." : "Save"}
        </button>
      ) : (
        <button className="btn btn-primary mt-3" onClick={() => setEdit(true)}>
          Edit Profile
        </button>
      )}
    </div>
  );
};

export default DoctorProfile;
