import React, { useEffect, useState } from "react";
import { showAppointmentsOfDoctor } from "../api/appoinmentAPI";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await showAppointmentsOfDoctor();
      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError(err.response?.data?.msg || "Failed to fetch appointments");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case "Pending":
        return "badge bg-warning text-dark";
      case "Accepted":
        return "badge bg-success";
      case "Completed":
        return "badge bg-primary";
      case "Reject":
        return "badge bg-danger";
      default:
        return "badge bg-secondary";
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary" />
        <p className="mt-2">Loading appointments...</p>
      </div>
    );
  }

  if (error) return <div className="alert alert-danger">{error}</div>;

  if (appointments.length === 0)
    return <div className="alert alert-info">No appointments yet</div>;

  return (
    <div className="container">
      <h3 className="mb-4">🩺 My Appointments</h3>

      <div className="table-responsive">
        <table className="table table-bordered table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>#</th>
              <th>Patient</th>
              <th>Date</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {appointments.map((a, i) => {
              const date = new Date(a.dateTime);

              return (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>{a.createdBy?.name}</td>
                  <td>{date.toLocaleDateString()}</td>
                  <td>{date.toLocaleTimeString()}</td>
                  <td>
                    <span className={getStatusBadge(a.status)}>
                      {a.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DoctorAppointments;
