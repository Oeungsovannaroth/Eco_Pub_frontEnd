import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import ReservationFormModal from "../components/ReservationFormModal";
import Loader from "../components/Loader";

function Reservations() {
  const [reservations, setReservations] = useState([]);
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReservation, setEditingReservation] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const getReservationId = (item) => {
    if (!item) return null;
    if (typeof item._id === "string") return item._id;
    if (typeof item.id === "string") return item.id;
    if (item._id?.$oid) return item._id.$oid;
    if (item.id?.$oid) return item.id.$oid;
    if (item._id) return String(item._id);
    if (item.id) return String(item.id);
    return null;
  };

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [reservationRes, tableRes] = await Promise.all([
        apiFetch("/reservations"),
        apiFetch("/pub-tables"),
      ]);

      setReservations(reservationRes.data || []);
      setTables(tableRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load reservations.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingReservation(null);
    setIsModalOpen(true);
  };

  const handleEdit = (reservation) => {
    setEditingReservation(reservation);
    setIsModalOpen(true);
  };

  const handleDelete = async (reservation) => {
    const reservationId = getReservationId(reservation);
    if (!reservationId) {
      alert("Reservation ID not found.");
      return;
    }

    const confirmed = window.confirm("Delete this reservation?");
    if (!confirmed) return;

    try {
      await apiFetch(`/reservations/${reservationId}`, {
        method: "DELETE",
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingReservation) {
        const reservationId = getReservationId(editingReservation);

        await apiFetch(`/reservations/${reservationId}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/reservations", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setIsModalOpen(false);
      setEditingReservation(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (reservation, status) => {
    const reservationId = getReservationId(reservation);

    try {
      await apiFetch(`/reservations/${reservationId}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: "customer_name", label: "Customer Name" },
    {
      key: "table",
      label: "Table",
      render: (row) => row.table?.table_number || "-",
    },
    { key: "reservation_date", label: "Date" },
    { key: "reservation_time", label: "Time" },
    { key: "guest_count", label: "Guests" },
    {
      key: "status",
      label: "Status",
      render: (row) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
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
      label: "Confirm",
      onClick: (row) => handleStatusUpdate(row, "confirmed"),
      className:
        "rounded-lg bg-green-500 px-3 py-2 text-xs font-medium text-white hover:bg-green-600 cursor-pointer",
    },
    {
      label: "Cancel",
      onClick: (row) => handleStatusUpdate(row, "cancelled"),
      className:
        "rounded-lg bg-red-500 px-3 py-2 text-xs font-medium text-white hover:bg-red-600 cursor-pointer",
    },
    {
      label: "Delete",
      onClick: handleDelete,
      className:
        "rounded-lg bg-gray-700 px-3 py-2 text-xs font-medium text-white hover:bg-black cursor-pointer",
    },
  ];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Reservations</h1>
          <p className="mt-1 text-gray-500">
            Manage reservations and table bookings.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black cursor-pointer"
        >
          Add Reservation
        </button>
      </div>

      {loading && <Loader text="Loading reservations..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={reservations} actions={actions} />
      )}

      <ReservationFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingReservation(null);
        }}
        onSubmit={handleSubmit}
        tables={tables}
        initialData={editingReservation}
      />
    </div>
  );
}

export default Reservations;