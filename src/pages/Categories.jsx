import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import CategoryFormModal from "../components/CategoryFormModal";

function Categories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);

  useEffect(() => {
    loadCategories();
  }, []);

  const getCategoryId = (item) => {
    if (!item) return null;
    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
    if (item._id?.$oid) return item._id.$oid;
    if (item.id?.$oid) return item.id.$oid;
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    return null;
  };

  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/categories");
      console.log("categories response:", res);

      setCategories(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      console.error("Load categories error:", err);
      setError(err.message || "Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingCategory(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const categoryId = getCategoryId(item);

    if (!categoryId) {
      alert("Category ID not found.");
      return;
    }

    const confirmed = window.confirm(`Delete category "${item.name}"?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/categories/${categoryId}`, {
        method: "DELETE",
      });

      alert("Category deleted successfully.");
      await loadCategories();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingCategory) {
        const categoryId = getCategoryId(editingCategory);

        if (!categoryId) {
          alert("Category ID not found.");
          return;
        }

        await apiFetch(`/categories/${categoryId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        alert("Category updated successfully.");
      } else {
        await apiFetch("/categories", {
          method: "POST",
          body: JSON.stringify(form),
        });

        alert("Category created successfully.");
      }

      setIsModalOpen(false);
      setEditingCategory(null);
      await loadCategories();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const columns = [
    { key: "name", label: "Name" },
    { key: "description", label: "Description" },
    { key: "type", label: "Type" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${
            row.status === "active"
              ? "bg-green-100 text-green-700"
              : "bg-gray-100 text-gray-700"
          }`}
        >
          {row.status}
        </span>
      ),
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
          <h1 className="text-3xl font-bold text-gray-800">Categories</h1>
          <p className="mt-1 text-gray-500">
            Retrieve and manage category.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 cursor-pointer px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Add Category
        </button>
      </div>

      {loading && <Loader text="Loading categories..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={categories} actions={actions} />
      )}

      <CategoryFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingCategory}
      />
    </div>
  );
}

export default Categories;