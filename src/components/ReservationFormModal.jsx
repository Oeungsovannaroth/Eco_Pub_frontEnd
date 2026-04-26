import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function ReservationFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    customer_name: "",
    table_id: "",
    reservation_date: "",
    reservation_time: "",
    guest_count: 1,
    status: "pending",
    special_request: "",
  });

  const [tables, setTables] = useState([]);

  const getId = (value) => {
    if (!value) return "";
    if (typeof value === "string") return value;
    if (typeof value === "object" && value._id) return String(value._id);
    if (typeof value === "object" && value.id) return String(value.id);
    return "";
  };

  // Load available tables
  const loadTables = async () => {
    try {
      const res = await apiFetch("/pub-tables");
      const allTables = res.data || [];
      // Only available tables OR the current table in edit mode
      const availableTables = allTables.filter(
        (t) => t.status === "available" || getId(t) === getId(form.table_id)
      );
      setTables(availableTables);
    } catch (err) {
      console.error("Failed to load tables:", err);
    }
  };

  useEffect(() => {
    if (initialData) {
      setForm({
        customer_name: initialData.customer_name || "",
        table_id: getId(initialData.table_id || initialData.table),
        reservation_date: initialData.reservation_date || "",
        reservation_time: initialData.reservation_time || "",
        guest_count: initialData.guest_count || 1,
        status: initialData.status || "pending",
        special_request: initialData.special_request || "",
      });
    } else {
      setForm({
        customer_name: "",
        table_id: "",
        reservation_date: "",
        reservation_time: "",
        guest_count: 1,
        status: "pending",
        special_request: "",
      });
    }
    loadTables();
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...form,
      guest_count: Number(form.guest_count),
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Reservation" : "Add Reservation"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            type="text"
            name="customer_name"
            value={form.customer_name}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            placeholder="Customer name"
            required
          />

          <select
            name="table_id"
            value={form.table_id}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          >
            <option value="">Select available table</option>
            {tables.map((table) => {
              const tableId = String(table._id || table.id || "");
              return (
                <option key={tableId} value={tableId}>
                  Table {table.table_number} — Capacity: {table.capacity} guests
                </option>
              );
            })}
          </select>

          <input
            type="date"
            name="reservation_date"
            value={form.reservation_date}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="time"
            name="reservation_time"
            value={form.reservation_time}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="number"
            name="guest_count"
            value={form.guest_count}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            min="1"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
            <option value="completed">Completed</option>
          </select>

          <textarea
            name="special_request"
            value={form.special_request}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            rows="4"
            placeholder="Special request"
          />

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ReservationFormModal;
