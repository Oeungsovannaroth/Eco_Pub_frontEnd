import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import MenuItemFormModal from "../components/MenuItemFormModal";
import Loader from "../components/Loader";

function MenuItems() {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [itemsRes, categoriesRes] = await Promise.all([
        apiFetch("/menu-items"),
        apiFetch("/categories"),
      ]);

      setItems(itemsRes.data || []);
      setCategories(categoriesRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load data.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingItem(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const confirmDelete = window.confirm(`Delete "${item.name}"?`);
    if (!confirmDelete) return;

    try {
      await apiFetch(`/menu-items/${item._id || item.id}`, {
        method: "DELETE",
      });

      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingItem) {
        formData.append("_method", "PUT");

        await apiFetch(`/menu-items/${editingItem._id || editingItem.id}`, {
          method: "POST",
          body: formData,
        });
      } else {
        await apiFetch("/menu-items", {
          method: "POST",
          body: formData,
        });
      }

      setIsModalOpen(false);
      setEditingItem(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    {
      key: "image",
      label: "Image",
      render: (row) =>
        row.image_url ? (
          <img
            src={row.image_url}
            alt={row.name}
            className="h-12 w-12 rounded-lg object-cover"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
    },
    { key: "name", label: "Name" },
    {
      key: "category",
      label: "Category",
      render: (row) => row.category?.name || "-",
    },
    {
      key: "price",
      label: "Price",
      render: (row) => `$${Number(row.price).toFixed(2)}`,
    },
    { key: "stock_qty", label: "Stock" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {row.status}
        </span>
      ),
    },
    {
      key: "is_available",
      label: "Available",
      render: (row) => (row.is_available ? "Yes" : "No"),
    },
  ];

  const actions = [
    {
      label: "Edit",
      onClick: handleEdit,
      className:
        "rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 cursor-pointer",
    },
    {
      label: "Delete",
      onClick: handleDelete,
      className:
        "rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 cursor-pointer",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Menu Items</h1>
          <p className="mt-1 text-gray-500">
            Manage menu items with add, edit, and delete actions.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black cursor-pointer"
        >
          Add Menu Item
        </button>
      </div>

      {loading && <Loader text="Loading menu items..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={items} actions={actions} />
      )}

      <MenuItemFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        categories={categories}
        initialData={editingItem}
      />
    </div>
  );
}

export default MenuItems;