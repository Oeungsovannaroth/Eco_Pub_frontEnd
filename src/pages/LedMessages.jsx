import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import LedMessagesFormModal from "../components/LedMessagesFormModal";

function LedMessages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMessage, setEditingMessage] = useState(null);

  useEffect(() => {
    loadMessages();
  }, []);

  const getMessageId = (item) => {
    if (!item) return null;
    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
    if (item._id?.$oid) return item._id.$oid;
    if (item.id?.$oid) return item.id.$oid;
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    return null;
  };

  const loadMessages = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/led-messages");
      setMessages(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load LED messages.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingMessage(null);
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingMessage(item);
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    const messageId = getMessageId(item);

    if (!messageId) {
      alert("Message ID not found.");
      return;
    }

    const confirmed = window.confirm(`Delete "${item.title}"?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/led-messages/${messageId}`, {
        method: "DELETE",
      });

      alert("LED message deleted successfully.");
      loadMessages();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingMessage) {
        const messageId = getMessageId(editingMessage);

        if (!messageId) {
          alert("Message ID not found.");
          return;
        }

        await apiFetch(`/led-messages/${messageId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });

        alert("LED message updated successfully.");
      } else {
        await apiFetch("/led-messages", {
          method: "POST",
          body: JSON.stringify(form),
        });

        alert("LED message created successfully.");
      }

      setIsModalOpen(false);
      setEditingMessage(null);
      await loadMessages();
    } catch (err) {
      alert(`Save failed: ${err.message}`);
    }
  };

  const columns = [
    { key: "title", label: "Title" },
    { key: "message", label: "Message" },
    { key: "start_date", label: "Start Date" },
    { key: "end_date", label: "End Date" },
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
          <h1 className="text-3xl font-bold text-gray-800">LED Messages</h1>
          <p className="mt-1 text-gray-500">
            Manage scrolling announcement messages.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black cursor-pointer"
        >
          Add LED Message
        </button>
      </div>

      {loading && <Loader text="Loading LED messages..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={messages} actions={actions} />
      )}

      <LedMessagesFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMessage(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingMessage}
      />
    </div>
  );
}

export default LedMessages;