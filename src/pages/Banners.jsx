import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import BannerFormModal from "../components/BannerFormModal";

function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);

  useEffect(() => {
    loadBanners();
  }, []);

  const getBannerId = (item) => {
    if (!item) return null;
    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
    if (item._id?.$oid) return item._id.$oid;
    if (item.id?.$oid) return item.id.$oid;
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    return null;
  };

  const loadBanners = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/banners");
      setBanners(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load banners.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingBanner(null);
    setIsModalOpen(true);
  };

  const handleEdit = (banner) => {
    setEditingBanner(banner);
    setIsModalOpen(true);
  };

  const handleDelete = async (banner) => {
    const bannerId = getBannerId(banner);

    if (!bannerId) {
      alert("Banner ID not found.");
      return;
    }

    const confirmed = window.confirm(`Delete banner "${banner.title}"?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/banners/${bannerId}`, {
        method: "DELETE",
      });

      alert("Banner deleted successfully.");
      await loadBanners();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingBanner) {
        const bannerId = getBannerId(editingBanner);

        if (!bannerId) {
          alert("Banner ID not found.");
          return;
        }

        formData.append("_method", "PUT");

        await apiFetch(`/banners/${bannerId}`, {
          method: "POST",
          body: formData,
        });

        alert("Banner updated successfully.");
      } else {
        await apiFetch("/banners", {
          method: "POST",
          body: formData,
        });

        alert("Banner created successfully.");
      }

      setIsModalOpen(false);
      setEditingBanner(null);
      await loadBanners();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
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
            alt={row.title}
            className="h-12 w-20 rounded-lg object-cover"
          />
        ) : (
          <span className="text-gray-400">No image</span>
        ),
    },
    { key: "title", label: "Title" },
    // { key: "link", label: "Link" },
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
          <h1 className="text-3xl font-bold text-gray-800">Banners</h1>
          <p className="mt-1 text-gray-500">Manage homepage banners.</p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Add Banner
        </button>
      </div>

      {loading && <Loader text="Loading banners..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={banners} actions={actions} />
      )}

      <BannerFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBanner(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingBanner}
      />
    </div>
  );
}

export default Banners;