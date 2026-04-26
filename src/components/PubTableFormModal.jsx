import { useEffect, useState } from "react";

function PubTableFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    table_number: "",
    capacity: "",
    location: "",
    status: "available",
  });

  useEffect(() => {
    if (isOpen) {
      if (initialData) {
        setForm({
          table_number: initialData.table_number || "",
          capacity: initialData.capacity ?? "",
          location: initialData.location || "",
          status: initialData.status || "available",
        });
      } else {
        setForm({
          table_number: "",
          capacity: "",
          location: "",
          status: "available",
        });
      }
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      table_number: form.table_number,
      capacity: Number(form.capacity),
      location: form.location,
      status: form.status,
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Table" : "Add New Table"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="space-y-5">
          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Table Number
            </label>
            <input
              type="text"
              name="table_number"
              placeholder="e.g. T-01, Table 5"
              value={form.table_number}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Capacity
              </label>
              <input
                type="number"
                name="capacity"
                placeholder="e.g. 4"
                value={form.capacity}
                onChange={handleChange}
                min="1"
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1.5 text-sm font-medium text-gray-700">
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Indoor, Patio, VIP"
                value={form.location}
                onChange={handleChange}
                className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              name="status"
              value={form.status}
              onChange={handleChange}
              className="w-full rounded-xl border border-gray-300 px-4 py-3 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white"
            >
              <option value="available">Available</option>
              <option value="reserved">Reserved</option>
              <option value="occupied">Occupied</option>
              <option value="maintenance">Maintenance</option>
            </select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-5 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-5 py-2.5 text-sm font-medium text-white hover:bg-black"
            >
              {initialData ? "Update Table" : "Create Table"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PubTableFormModal;