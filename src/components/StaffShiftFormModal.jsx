import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

const initialForm = {
  // user_id: "",
  name: "",
  shift_date: "",
  start_time: "",
  end_time: "",
  shift_role: "",
  status: "",
};

export default function StaffShiftFormModal({
  open,
  onClose,
  refresh,
  editData,
}) {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm({
        user_id: editData.user_id || "",
        name: editData.name || "",
        shift_date: editData.shift_date || "",
        start_time: editData.start_time || "",
        end_time: editData.end_time || "",
        shift_role: editData.shift_role || "",
        status: editData.status || "",
      });
    } else {
      setForm(initialForm);
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!form.name || form.name.trim() === "") {
      alert("Staff Name is required!");
      return;
    }

    if (!form.shift_date) {
      alert("Shift Date is required!");
      return;
    }

    // Optional: Check end time is after start time
    if (form.start_time && form.end_time && form.end_time <= form.start_time) {
      alert("End time must be after start time!");
      return;
    }

    try {
      setLoading(true);

      if (editData) {
        await apiFetch(`/staff-shifts/${editData.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
        alert("Shift updated successfully!");
      } else {
        await apiFetch("/staff-shifts", {
          method: "POST",
          body: JSON.stringify(form),
        });
        alert("Shift created successfully!");
      }

      refresh();
      onClose();
      setForm(initialForm); // Reset form after success
    } catch (err) {
      console.error(err);
      alert("Something went wrong! Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">
            {editData ? "Edit Shift" : "Create Shift"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-lg"
          >
            ✕
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* User ID */}
          {/* <div>
            <label className="block text-sm text-gray-600 mb-1">User ID</label>
            <input
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter user ID"
              value={form.user_id}
              onChange={(e) => setForm({ ...form, user_id: e.target.value })}
            />
          </div> */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Staff Name
            </label>
            <input
              className="w-full border rounded-lg p-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              placeholder="Enter staff full name"
              value={form.name || ""}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          {/* Date */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Shift Date
            </label>
            <input
              type="date"
              className="w-full border rounded-lg p-2"
              value={form.shift_date}
              onChange={(e) => setForm({ ...form, shift_date: e.target.value })}
            />
          </div>

          {/* Time */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                Start Time
              </label>
              <input
                type="time"
                className="w-full border rounded-lg p-2"
                value={form.start_time}
                onChange={(e) =>
                  setForm({ ...form, start_time: e.target.value })
                }
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">
                End Time
              </label>
              <input
                type="time"
                className="w-full border rounded-lg p-2"
                value={form.end_time}
                onChange={(e) => setForm({ ...form, end_time: e.target.value })}
              />
            </div>
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Role</label>
            <input
              className="w-full border rounded-lg p-2"
              placeholder="e.g. Bartender"
              value={form.shift_role}
              onChange={(e) => setForm({ ...form, shift_role: e.target.value })}
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm text-gray-600 mb-1">Status</label>
            <select
              className="w-full border rounded-lg p-2"
              value={form.status}
              onChange={(e) => setForm({ ...form, status: e.target.value })}
            >
              <option value="">Select status</option>
              <option value="assigned">Assigned</option>
              <option value="completed">Completed</option>
              <option value="absent">Absent</option>
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 cursor-pointer rounded-lg bg-gray-200 hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 cursor-pointer rounded-lg bg-blue-600 text-white hover:bg-blue-700 shadow disabled:opacity-50"
              disabled={loading}
            >
              {loading ? "Saving..." : "Save Shift"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
