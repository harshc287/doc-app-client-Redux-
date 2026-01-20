import React, { useState } from "react";

const UpdateAppointmentModal = ({ appointment, onClose, onUpdated }) => {
  const [dateTime, setDateTime] = useState(
    appointment.dateTime.slice(0, 16)
  );
  const [loading, setLoading] = useState(false);

  const handleUpdate = async () => {
    try {
      setLoading(true);
      await onUpdated(appointment._id, dateTime);
      onClose();
    } catch {
      alert("Failed to update appointment");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal d-block bg-dark bg-opacity-75">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content card-dark p-4">
          <h5 className="mb-3">Update Appointment</h5>

          <input
            type="datetime-local"
            className="form-control"
            value={dateTime}
            onChange={(e) => setDateTime(e.target.value)}
          />

          <div className="mt-4 d-flex justify-content-end gap-2">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={handleUpdate}
              disabled={loading}
            >
              {loading ? "Updating..." : "Update"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdateAppointmentModal;
