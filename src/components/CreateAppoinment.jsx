import React, { useEffect, useState } from "react";
import { getAllDoctors } from "../api/doctorAPI";
import { saveAppointment } from "../api/appoinmentAPI";
import { FaCalendarPlus } from "react-icons/fa";

const CreateAppointment = () => {
  const [doctors, setDoctors] = useState([]);
  const [doctorId, setDoctorId] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDoctors();
  }, []);

  const loadDoctors = async () => {
    const res = await getAllDoctors();
    setDoctors(res.data.doctors || []);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    if (!doctorId || !dateTime) {
      setMsg("All fields are required");
      return;
    }

    try {
      setLoading(true);
      const res = await saveAppointment({ doctorId, dateTime });
      if (res.data.success) {
        setMsg("Appointment created successfully");
        setDoctorId("");
        setDateTime("");
      }
    } catch (err) {
      setMsg(err.response?.data?.msg || "Failed to create appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-dark p-5 mx-auto" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-4">
        <FaCalendarPlus size={45} className="text-primary" />
        <h3 className="mt-3">Book Appointment</h3>
        <p className="text-muted-custom">
          Schedule an appointment with a doctor
        </p>
      </div>

      {msg && <div className="alert alert-success-soft">{msg}</div>}

      <form onSubmit={handleSubmit}>
        
        {/* Doctor */}
        <div className="mb-4">
          <label className="form-label">Select Doctor</label>
<select
  className="form-select form-select-dark"
  value={doctorId}
  onChange={(e) => setDoctorId(e.target.value)}
>
  <option value="">Choose doctor</option>

  {doctors.map((doc) => (
    <option
      key={doc._id}              // Doctor document id (React key)
      value={doc.createdBy._id}  // ✅ Doctor USER id (Backend expects this)
    >
      Dr. {doc.createdBy.name} ({doc.specialist})
    </option>
  ))}
</select>
        </div>

        {/* Date Time */}
        <div className="mb-4">
          <label className="form-label">Date & Time</label>
          <input
            type="datetime-local"
            className="form-control form-control-dark"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="btn btn-gradient-indigo w-100 py-3"
        >
          {loading ? "Booking..." : "Create Appointment"}
        </button>
      </form>
    </div>
  );
};

export default CreateAppointment;
