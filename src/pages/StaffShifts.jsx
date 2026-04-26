import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import StaffShiftFormModal from "../components/StaffShiftFormModal";

const STATUS_STYLES = {
  assigned: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
};

export default function StaffShifts() {
  const [shifts, setShifts] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchShifts = async () => {
    try {
      const data = await apiFetch("/staff-shifts");
      setShifts(data);
    } catch (err) {
      console.error("Failed to fetch shifts:", err.message);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleEdit = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this shift?")) return;
    try {
      await apiFetch(`/staff-shifts/${id}`, { method: "DELETE" });
      fetchShifts();
    } catch (err) {
      console.error("Failed to delete shift:", err.message);
    }
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen font-sans">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">
            Staff Shifts
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {shifts.length} shift{shifts.length !== 1 ? "s" : ""} total
          </p>
        </div>

        <button
          onClick={() => {
            setEditData(null);
            setOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition"
        >
          + Add Shift
        </button>
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
            <tr>
              {[
                "Staff ID",
                "Name",
                "Date",
                "Time",
                "Role",
                "Status",
                "Actions",
              ].map((h) => (
                <th
                  key={h}
                  className={`px-4 py-3 ${
                    h === "Actions" ? "text-center" : "text-left"
                  }`}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {shifts.length > 0 ? (
              shifts.map((s) => (
                <tr
                  key={s.id}
                  className="border-b last:border-none hover:bg-gray-50 transition"
                >
                  {/* Staff ID */}
                  <td className="px-4 py-3">
                    <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono text-gray-600">
                      {s.user_id || s.id || "—"}
                    </span>
                  </td>

                  {/* Name */}
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {s.user?.name || "—"}
                  </td>

                  {/* Date */}
                  <td className="px-4 py-3 text-gray-500">
                    {s.shift_date || "—"}
                  </td>

                  {/* Time */}
                  <td className="px-4 py-3 text-gray-500">
                    {s.start_time && s.end_time
                      ? `${s.start_time} – ${s.end_time}`
                      : "—"}
                  </td>

                  {/* Role */}
                  <td className="px-4 py-3 text-gray-700">
                    {s.shift_role || "—"}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
                        STATUS_STYLES[s.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {s.status || "—"}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(s)}
                        className="px-3 py-1 text-xs rounded-md border border-yellow-300 bg-yellow-100 text-yellow-800 hover:bg-yellow-200 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(s.id)}
                        className="px-3 py-1 text-xs rounded-md border border-red-300 bg-red-100 text-red-700 hover:bg-red-200 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-12 text-gray-400"
                >
                  No shifts found. Click{" "}
                  <span className="font-semibold">+ Add Shift</span> to get
                  started.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      <StaffShiftFormModal
        open={open}
        onClose={() => setOpen(false)}
        refresh={fetchShifts}
        editData={editData}
      />
    </div>
  );
}