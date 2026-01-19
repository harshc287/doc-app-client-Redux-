import React, { useEffect, useState } from "react";
import {
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  updateAppointmentStatus,
  deleteAppointment,
} from "../api/appoinmentAPI";
import { getLoggedUser } from "../api/userAPI";
import {
  FaEdit,
  FaTrash,
  FaCheck,
  FaTimes,
  FaCalendarAlt,
  FaUserMd,
  FaUser,
} from "react-icons/fa";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userRes = await getLoggedUser();
      const loggedUser = userRes.data.user;
      setUser(loggedUser);

      let res;

      if (loggedUser.role === "Doctor") {
        res = await showAppointmentsOfDoctor();
      } else {
        res = await getAppointmentsByUser(); // User & Admin
      }

      setAppointments(res.data.appointments || []);
    } catch (err) {
      setError("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async () => {
    try {
      await updateAppointmentStatus(selected._id, status);
      setToast("Status updated");
      setSelected(null);
      loadData();
    } catch {
      setToast("Update failed");
    }
    setTimeout(() => setToast(""), 3000);
  };

  const removeAppointment = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    await deleteAppointment(id);
    setToast("Appointment deleted");
    loadData();
    setTimeout(() => setToast(""), 3000);
  };

  if (loading) return <div className="text-center py-5 text-light">Loading...</div>;
  if (error) return <div className="alert alert-danger-soft">{error}</div>;

  return (
    <div className="card card-dark p-4">
      <h4 className="mb-4">My Appointments</h4>

      {appointments.length === 0 ? (
        <div className="text-center text-muted-custom py-5">
          <FaCalendarAlt size={40} />
          <p className="mt-3">No appointments found</p>
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-dark table-hover align-middle">
            <thead>
              <tr>
                <th>#</th>
                <th>{user?.role === "Doctor" ? "Patient" : "Doctor"}</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>

            <tbody>
              {appointments.map((a, i) => (
                <tr key={a._id}>
                  <td>{i + 1}</td>
                  <td>
                    {user?.role === "Doctor" ? (
                      <>
                        <FaUser /> {a.createdBy?.name}
                      </>
                    ) : (
                      <>
                        <FaUserMd /> Dr. {a.doctorId?.name}
                      </>
                    )}
                  </td>
                  <td>{new Date(a.dateTime).toLocaleString()}</td>
                  <td>
                    <span className="badge bg-secondary">{a.status}</span>
                  </td>
                  <td>
                    {user?.role === "Doctor" && a.status === "Pending" &&  (
                      <>
                        <button
                          className="btn btn-success btn-sm me-2"
                          onClick={() => {
                            setSelected(a);
                            setStatus("Accepted");
                          }}
                        >
                          <FaCheck />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => {
                            setSelected(a);
                            setStatus("Reject");
                          }}
                        >
                          <FaTimes />
                        </button>
                      </>
                    )}

                    {user?.role !== "Doctor" && a.status === "Pending" &&  (
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeAppointment(a._id)}
                      >
                        <FaTrash />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {selected && (
        <div className="modal d-block bg-dark bg-opacity-75">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content card-dark p-4">
              <h5 className="mb-3">Confirm Action</h5>
              <p>
                Change status to <strong>{status}</strong>?
              </p>
              <div className="text-end">
                <button
                  className="btn btn-soft me-2"
                  onClick={() => setSelected(null)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-gradient-indigo"
                  onClick={updateStatus}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="position-fixed bottom-0 end-0 p-3">
          <div className="alert alert-success-soft">{toast}</div>
        </div>
      )}
    </div>
  );
};

export default Appointments;
