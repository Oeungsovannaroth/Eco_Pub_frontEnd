import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";
import EventFormModal from "../components/EventFormModal";

function Events() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState(null);

  useEffect(() => {
    loadEvents();
  }, []);

  const getEventId = (item) => {
    if (!item) return null;
    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
    if (item._id?.$oid) return item._id.$oid;
    if (item.id?.$oid) return item.id.$oid;
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    return null;
  };

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/events");
      setEvents(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      setError(err.message || "Failed to load events.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingEvent(null);
    setIsModalOpen(true);
  };

  const handleEdit = (event) => {
    setEditingEvent(event);
    setIsModalOpen(true);
  };

  const handleDelete = async (event) => {
    const eventId = getEventId(event);

    if (!eventId) {
      alert("Event ID not found.");
      return;
    }

    const confirmed = window.confirm(`Delete event "${event.title}"?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/events/${eventId}`, {
        method: "DELETE",
      });

      alert("Event deleted successfully.");
      await loadEvents();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingEvent) {
        const eventId = getEventId(editingEvent);

        if (!eventId) {
          alert("Event ID not found.");
          return;
        }

        formData.append("_method", "PUT");

        await apiFetch(`/events/${eventId}`, {
          method: "POST",
          body: formData,
        });

        alert("Event updated successfully.");
      } else {
        await apiFetch("/events", {
          method: "POST",
          body: formData,
        });

        alert("Event created successfully.");
      }

      setIsModalOpen(false);
      setEditingEvent(null);
      await loadEvents();
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
    { key: "event_date", label: "Date" },
    {
      key: "time",
      label: "Time",
      render: (row) => `${row.start_time} - ${row.end_time}`,
    },
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
          <h1 className="text-3xl font-bold text-gray-800">Events</h1>
          <p className="mt-1 text-gray-500">
            Manage pub events and promotions.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black"
        >
          Add Event
        </button>
      </div>

      {loading && <Loader text="Loading events..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={events} actions={actions} />
      )}

      <EventFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingEvent(null);
        }}
        onSubmit={handleSubmit}
        initialData={editingEvent}
      />
    </div>
  );
}

export default Events;