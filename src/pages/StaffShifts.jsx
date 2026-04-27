import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import StaffShiftFormModal from "../components/StaffShiftFormModal";
import Loader from "../components/Loader";        // ← Reuse if you have it

const STATUS_STYLES = {
  assigned: "bg-blue-100 text-blue-800",
  completed: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
};

export default function StaffShifts() {
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchShifts = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await apiFetch("/staff-shifts");
      setShifts(data || []);
    } catch (err) {
      setError(err.message || "Failed to load staff shifts.");
      console.error("Failed to fetch shifts:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShifts();
  }, []);

  const handleAdd = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleEdit = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Delete this shift?");
    if (!confirmed) return;

    try {
      await apiFetch(`/staff-shifts/${id}`, { method: "DELETE" });
      fetchShifts();
    } catch (err) {
      alert("Failed to delete shift: " + err.message);
    }
  };

  // Define columns for better structure (similar to Payments)
  const columns = [
    { 
      key: "user_id", 
      label: "Staff ID",
      render: (row) => (
        <span className="text-xs bg-gray-100 px-2 py-1 rounded-md font-mono text-gray-700">
          {row.user_id || "—"}
        </span>
      )
    },
    { 
      key: "name", 
      label: "Name",
      render: (row) => <span className="font-medium text-gray-800">{row.name || "—"}</span>
    },
    { key: "shift_date", label: "Date" },
    {
      key: "time",
      label: "Time",
      render: (row) => 
        row.start_time && row.end_time 
          ? `${row.start_time} – ${row.end_time}` 
          : "—"
    },
    { key: "shift_role", label: "Role" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium capitalize ${
            STATUS_STYLES[row.status] || "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status || "—"}
        </span>
      )
    },
  ];

  return (
    <div className="p-6">   {/* Changed from p-8 to p-6 for consistency */}
      
      {/* Header - Same style as Payments */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff Shifts</h1>
          <p className="mt-1 text-gray-500">
            Manage staff schedules and shift records.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 cursor-pointer text-sm font-medium text-white hover:bg-black transition"
        >
          + Add Shift
        </button>
      </div>

      {/* Loading & Error Handling - Same as Payments */}
      {loading && <Loader text="Loading shifts..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {/* Table Section */}
      {!loading && !error && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-gray-600 uppercase text-xs">
              <tr>
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-6 py-4 text-left font-medium"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-6 py-4 text-center font-medium">Actions</th>
              </tr>
            </thead>

            <tbody>
              {shifts.length > 0 ? (
                shifts.map((shift) => (
                  <tr
                    key={shift.id || shift._id}
                    className="border-b last:border-none hover:bg-gray-50 transition-colors"
                  >
                    {columns.map((col) => (
                      <td key={col.key} className="px-6 py-4">
                        {col.render ? col.render(shift) : shift[col.key] || "—"}
                      </td>
                    ))}

                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(shift)}
                          className="rounded-lg cursor-pointer bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 transition"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(shift.id || shift._id)}
                          className="rounded-lg cursor-pointer bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={columns.length + 1} className="text-center py-12 text-gray-400">
                    No shifts found. Click <span className="font-semibold">+ Add Shift</span> to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal */}
      <StaffShiftFormModal
        open={open}
        onClose={() => {
          setOpen(false);
          setEditData(null);
        }}
        refresh={fetchShifts}
        editData={editData}
      />
    </div>
  );
}