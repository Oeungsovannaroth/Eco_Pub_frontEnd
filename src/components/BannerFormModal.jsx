import { useEffect, useState } from "react";

function BannerFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    title: "",
    link: "",
    image: null,
    status: "active",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        title: initialData.title || "",
        link: initialData.link || "",
        image: null,
        status: initialData.status || "active",
      });
    } else if (isOpen) {
      setForm({
        title: "",
        link: "",
        image: null,
        status: "active",
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
    formData.append("link", form.link);
    formData.append("status", form.status);

    if (form.image) {
      formData.append("image", form.image);
    }

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Banner" : "Add Banner"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <input
            type="text"
            name="title"
            placeholder="Banner title"
            value={form.title}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          {/* <input
            type="text"
            name="link"
            placeholder="Banner link"
            value={form.link}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          /> */}

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            accept="image/*"
          />

          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <div className="flex justify-end gap-3">
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

export default BannerFormModal;