import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import Loader from "../components/Loader";

function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/orders");
      setOrders(res.data || []);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (order) => {
    const confirmed = window.confirm(`Delete order ${order.order_no}?`);
    if (!confirmed) return;

    try {
      await apiFetch(`/orders/${order._id || order.id}`, {
        method: "DELETE",
      });
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleStatusUpdate = async (order, status) => {
    try {
      await apiFetch(`/orders/${order._id || order.id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      loadOrders();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    { key: "order_no", label: "Order No" },
    {
      key: "user",
      label: "Customer",
      render: (row) => row.user?.name || "-",
    },
    {
      key: "table",
      label: "Table",
      render: (row) => row.table?.table_number || "-",
    },
    { key: "order_type", label: "Type" },
    {
      key: "total_amount",
      label: "Total",
      render: (row) => `$${Number(row.total_amount || 0).toFixed(2)}`,
    },
    {
      key: "order_status",
      label: "Status",
      render: (row) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {row.order_status}
        </span>
      ),
    },
  ];

  const actions = [
    {
      label: "Preparing",
      onClick: (row) => handleStatusUpdate(row, "preparing"),
      className:
        "rounded-lg bg-yellow-500 px-3 py-2 text-xs font-medium text-white hover:bg-yellow-600 cursor-pointer",
    },
    {
      label: "Served",
      onClick: (row) => handleStatusUpdate(row, "served"),
      className:
        "rounded-lg bg-blue-500 px-3 py-2 text-xs font-medium text-white hover:bg-blue-600 cursor-pointer",
    },
    {
      label: "Complete",
      onClick: (row) => handleStatusUpdate(row, "completed"),
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
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Orders</h1>
        <p className="mt-1 text-gray-500">
          Manage customer orders and update statuses.
        </p>
      </div>

      {loading && <Loader text="Loading orders..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={orders} actions={actions} />
      )}
    </div>
  );
}

export default Orders;