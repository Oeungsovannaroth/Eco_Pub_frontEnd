import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import PubTableFormModal from "../components/PubTableFormModal";

function PubTables() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTable, setEditingTable] = useState(null);

  useEffect(() => {
    loadTables();
  }, []);

  const getTableId = (table) => {
    if (!table) return null;
    if (typeof table._id === "string") return table._id;
    if (typeof table.id === "string") return table.id;
    if (table._id?.$oid) return table._id.$oid;
    if (table.id?.$oid) return table.id.$oid;
    if (table._id) return String(table._id);
    if (table.id) return String(table.id);
    return null;
  };

  const loadTables = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await apiFetch("/pub-tables");
      setTables(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load tables.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingTable(null);
    setIsModalOpen(true);
  };

  const handleEdit = (table) => {
    setEditingTable(table);
    setIsModalOpen(true);
  };

  const handleDelete = async (table) => {
    const tableId = getTableId(table);
    if (!tableId) {
      alert("Table ID not found.");
      return;
    }

    const confirmed = window.confirm(`Delete table "${table.table_number}"?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/pub-tables/${tableId}`, { method: "DELETE" });
      alert("Table deleted successfully.");
      loadTables();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingTable) {
        const tableId = getTableId(editingTable);
        if (!tableId) {
          alert("Table ID not found.");
          return;
        }
        await apiFetch(`/pub-tables/${tableId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Table updated successfully.");
      } else {
        await apiFetch("/pub-tables", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        alert("Table created successfully.");
      }

      setIsModalOpen(false);
      setEditingTable(null);
      await loadTables();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  // Status styles (modern & clean like Payments)
  const statusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "available":
        return "bg-emerald-100 text-emerald-700";
      case "reserved":
        return "bg-amber-100 text-amber-700";
      case "occupied":
        return "bg-red-100 text-red-700";
      case "maintenance":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const columns = [
    { key: "table_number", label: "Table Number" },
    { key: "capacity", label: "Capacity" },
    { key: "location", label: "Location" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span
          className={`rounded-full px-3 py-1 text-xs font-medium ${statusStyle(
            row.status
          )}`}
        >
          {row.status || "Unknown"}
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
      {/* Header - Matching Payments style */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Pub Tables</h1>
          <p className="mt-1 text-gray-500">
            Manage table numbers, capacity, location, and status.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black cursor-pointer"
        >
          + Add Table
        </button>
      </div>

      {loading && <Loader text="Loading tables..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={tables} actions={actions} />
      )}

      <PubTableFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTable(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingTable}
      />
    </div>
  );
}

export default PubTables;