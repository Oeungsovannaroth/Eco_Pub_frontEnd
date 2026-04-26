import { useEffect, useState } from "react";

function EventFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    event_date: "",
    start_time: "",
    end_time: "",
    image: null,
    status: "upcoming",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        event_date: initialData.event_date || "",
        start_time: initialData.start_time || "",
        end_time: initialData.end_time || "",
        image: null,
        status: initialData.status || "upcoming",
      });
    } else if (isOpen) {
      setForm({
        title: "",
        description: "",
        event_date: "",
        start_time: "",
        end_time: "",
        image: null,
        status: "upcoming",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    const { name, value, files, type } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "file" ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("event_date", form.event_date);
    formData.append("start_time", form.start_time);
    formData.append("end_time", form.end_time);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Event" : "Add Event"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <input
            type="text"
            name="title"
            placeholder="Event title"
            value={form.title}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            rows="4"
          />

          <input
            type="date"
            name="event_date"
            value={form.event_date}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="upcoming">Upcoming</option>
            <option value="ongoing">Ongoing</option>
          </select>

          <input
            type="time"
            name="start_time"
            value={form.start_time}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="time"
            name="end_time"
            value={form.end_time}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            accept="image/*"
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

export default EventFormModal;