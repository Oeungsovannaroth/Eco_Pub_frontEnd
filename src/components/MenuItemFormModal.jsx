import { useEffect, useState } from "react";

function MenuItemFormModal({
  isOpen,
  onClose,
  onSubmit,
  categories,
  initialData = null,
}) {
  const [form, setForm] = useState({
    category_id: "",
    name: "",
    description: "",
    price: "",
    stock_qty: "",
    status: "active",
    is_available: true,
    image: null,
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        category_id: initialData.category_id || "",
        name: initialData.name || "",
        description: initialData.description || "",
        price: initialData.price || "",
        stock_qty: initialData.stock_qty || "",
        status: initialData.status || "active",
        is_available: initialData.is_available ?? true,
        image: null,
      });
    } else {
      setForm({
        category_id: "",
        name: "",
        description: "",
        price: "",
        stock_qty: "",
        status: "active",
        is_available: true,
        image: null,
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "file"
          ? files[0]
          : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("category_id", form.category_id);
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("stock_qty", form.stock_qty);
    formData.append("status", form.status);
    formData.append("is_available", form.is_available ? "1" : "0");

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
            {initialData ? "Edit Menu Item" : "Add Menu Item"}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-1 text-sm text-gray-500 hover:bg-gray-100 cursor-pointer"
          >
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select
            name="category_id"
            value={form.category_id}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          >
            <option value="">Select category</option>
            {categories.map((cat) => (
              <option key={cat._id || cat.id} value={cat._id || cat.id}>
                {cat.name}
              </option>
            ))}
          </select>

          <input
            type="text"
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="number"
            name="price"
            placeholder="Price"
            value={form.price}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          />

          <input
            type="number"
            name="stock_qty"
            placeholder="Stock quantity"
            value={form.stock_qty}
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
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <label className="flex items-center gap-2 rounded-lg border px-4 py-3">
            <input
              type="checkbox"
              name="is_available"
              checked={form.is_available}
              onChange={handleChange}
            />
            Available
          </label>

          <input
            type="file"
            name="image"
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
          />

          <textarea
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3 md:col-span-2"
            rows="4"
          />

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

export default MenuItemFormModal;