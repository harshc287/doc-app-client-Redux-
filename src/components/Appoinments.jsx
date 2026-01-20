
import React, { useEffect, useState } from "react";
import {
  getAppointmentsByUser,
  showAppointmentsOfDoctor,
  updateAppointment,
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
import UpdateAppointmentModal from "./UpdateAppointmentModal";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [status, setStatus] = useState("");
  const [toast, setToast] = useState("");
  const [editAppointment, setEditAppointment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const userRes = await getLoggedUser();
      const loggedUser = userRes.data.user;
      setUser(loggedUser);

      const res =
        loggedUser.role === "Doctor"
          ? await showAppointmentsOfDoctor()
          : await getAppointmentsByUser();

      setAppointments(res.data.appointments || []);
    } catch {
      setToast("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateAppointment = async (id, dateTime) => {
    await updateAppointment(id, { dateTime });
    setToast("Appointment updated");
    loadData();
    setTimeout(() => setToast(""), 3000);
  };

  const updateStatus = async () => {
    await updateAppointmentStatus(selected._id, status);
    setSelected(null);
    loadData();
  };

  const removeAppointment = async (id) => {
    if (!window.confirm("Delete appointment?")) return;
    await deleteAppointment(id);
    setToast("Appointment deleted");
    loadData();
  };

  if (loading) return <div className="text-center py-5">Loading...</div>;

  return (
    <div className="card card-dark p-4">
      <h4 className="mb-4">My Appointments</h4>

      {appointments.length === 0 ? (
        <div className="text-center py-5">
          <FaCalendarAlt size={40} />
          <p>No appointments found</p>
        </div>
      ) : (
        <table className="table table-dark table-hover">
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
                <td>{a.status}</td>

                <td>
                  {/* USER EDIT */}
                  {user?.role === "User" &&
                    a.status === "Pending" &&
                    a.createdBy?._id === user._id && (
                      <>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => setEditAppointment(a)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => removeAppointment(a._id)}
                        >
                          <FaTrash />
                        </button>
                      </>
                    )}

                  {/* DOCTOR ACTION */}
                  {/* DOCTOR ACTIONS */}
{user?.role === "Doctor" && a.status === "Pending" && (
  <>
    {/* ACCEPT */}
    <button
      className="btn btn-success btn-sm me-2"
      onClick={() => {
        setSelected(a);
        setStatus("Accepted");
      }}
    >
      <FaCheck />
    </button>

    {/* REJECT */}
    <button
      className="btn btn-danger btn-sm me-2"
      onClick={() => {
        setSelected(a);
        setStatus("Reject");
      }}
    >
      <FaTimes />
    </button>
  </>
)}

{/* MARK COMPLETED */}
{user?.role === "Doctor" && a.status === "Accepted" && (
  <button
    className="btn btn-primary btn-sm"
    onClick={() => {
      setSelected(a);
      setStatus("Completed");
    }}
  >
    Completed
  </button>
)}

                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {/* CONFIRM STATUS */}
      {selected && (
        <div className="modal d-block bg-dark bg-opacity-75">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content p-4">
              <p>Change status to {status}?</p>
              <button onClick={updateStatus} className="btn btn-primary">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* UPDATE MODAL */}
      {editAppointment && (
        <UpdateAppointmentModal
          appointment={editAppointment}
          onClose={() => setEditAppointment(null)}
          onUpdated={handleUpdateAppointment}
        />
      )}

      {toast && <div className="alert alert-success mt-3">{toast}</div>}
    </div>
  );
};

export default Appointments;
