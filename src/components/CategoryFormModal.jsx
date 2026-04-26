import { useEffect, useState } from "react";

function CategoryFormModal({
  isOpen,
  onClose,
  onSubmit,
  initialData = null,
}) {
  const [form, setForm] = useState({
    name: "",
    description: "",
    type: "food",
    status: "active",
  });

  useEffect(() => {
    if (isOpen && initialData) {
      setForm({
        name: initialData.name || "",
        description: initialData.description || "",
        type: initialData.type || "food",
        status: initialData.status || "active",
      });
    }

    if (isOpen && !initialData) {
      setForm({
        name: "",
        description: "",
        type: "food",
        status: "active",
      });
    }
  }, [isOpen, initialData]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Category" : "Add Category"}
          </h2>

          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100"
          >
            Close
          </button>
        </div>

        <form
          onSubmit={handleFormSubmit}
          className="grid grid-cols-1 gap-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Category name"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            rows="4"
          />

          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="cocktail">Cocktail</option>
            <option value="wine">Wine</option>
            <option value="alcoholic">Alcoholic</option>
            <option value="signature_drink">signature_drink</option>
            <option value="food">Food</option>
            <option value="non-alcoholic">Non-Alcoholic</option>
            <option value="other">Other</option>
          </select>

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

export default CategoryFormModal;