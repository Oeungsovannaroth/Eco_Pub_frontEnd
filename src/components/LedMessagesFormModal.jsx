import { useEffect, useState } from "react";

function LedMessagesFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    title: "",
    message: "",
    start_date: "",
    end_date: "",
    status: "active",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title: initialData.title || "",
        message: initialData.message || "",
        start_date: initialData.start_date || "",
        end_date: initialData.end_date || "",
        status: initialData.status || "active",
      });
    }

    if (isOpen && !initialData) {
      setForm({
        title: "",
        message: "",
        start_date: "",
        end_date: "",
        status: "active",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit LED Message" : "Add LED Message"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
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
            name="title"
            placeholder="Title"
            value={form.title}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            required
          />

          <textarea
            name="message"
            placeholder="Message"
            value={form.message}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            rows="4"
            required
          />

          <input
            type="date"
            name="start_date"
            value={form.start_date}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="date"
            name="end_date"
            value={form.end_date}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="md:col-span-2 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border px-4 py-2 cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black cursor-pointer"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LedMessagesFormModal;