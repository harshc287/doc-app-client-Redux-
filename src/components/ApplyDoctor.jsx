import React, { useEffect, useState } from "react";
import { applyDoctor, getDoctorApplicationStatus } from "../api/doctorAPI";
import { FaStethoscope } from "react-icons/fa";

const ApplyDoctor = () => {
  const [specialist, setSpecialist] = useState("");
  const [fees, setFees] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [isPending, setIsPending] = useState(false);

  // 🔹 CHECK EXISTING APPLICATION STATUS
  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await getDoctorApplicationStatus();
        if (res.data.success && res.data.doctor.status === "Pending") {
          setMsg("Your doctor application is under review");
          setIsPending(true);
        }
      } catch (err) {
        // no doctor profile yet → allow apply
      }
    };
    checkStatus();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");

    try {
      setLoading(true);
      const res = await applyDoctor({ specialist, fees });
      if (res.data.success) {
        setMsg("Application submitted successfully!");
        setIsPending(true);
      }
    } catch {
      setMsg("Application failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card card-dark p-5 mx-auto" style={{ maxWidth: "600px" }}>
      <div className="text-center mb-4">
        <FaStethoscope size={50} className="text-primary" />
        <h3 className="mt-3 text-info">Apply as Doctor</h3>
        <p className="text-info">Join our healthcare professionals</p>
      </div>

      {msg && <div className="alert alert-success-soft">{msg}</div>}

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="form-label">Specialization</label>
          <input
            type="text"
            className="form-control form-control-dark"
            value={specialist}
            onChange={(e) => setSpecialist(e.target.value)}
            disabled={isPending}
          />
        </div>

        <div className="mb-4">
          <label className="form-label">Consultation Fees</label>
          <input
            type="number"
            className="form-control form-control-dark"
            value={fees}
            onChange={(e) => setFees(e.target.value)}
            disabled={isPending}
          />
        </div>

        <button
          type="submit"
          disabled={loading || isPending}
          className="btn btn-gradient-indigo w-100 py-3"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
};

export default ApplyDoctor;
