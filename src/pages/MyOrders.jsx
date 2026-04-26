import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import Loader from "../components/Loader";

function MyOrders() {
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
      const allOrders = Array.isArray(res?.data) ? res.data : [];

      const user = JSON.parse(localStorage.getItem("user") || "null");
      const userId = user?._id || user?.id;

      const myOrders = allOrders.filter(
        (order) =>
          order.user_id === userId ||
          order.user?._id === userId ||
          order.user?.id === userId
      );

      setOrders(myOrders);
    } catch (err) {
      setError(err.message || "Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  const getTableNumber = (order) => {
    return order.table?.table_number || order.table_number || order.table_id || "-";
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">My Orders</h1>
        <p className="mt-2 text-lg text-gray-600">
          View your order history and current statuses
        </p>
      </div>

      {loading && <Loader text="Loading your orders..." />}

      {!loading && error && (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-8 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && orders.length === 0 && (
        <div className="rounded-3xl bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100 text-4xl">
            📋
          </div>
          <h2 className="text-2xl font-medium text-gray-900 mb-2">No orders yet</h2>
          <p className="text-gray-600">When you place orders, they will appear here.</p>
        </div>
      )}

      {!loading && !error && orders.length > 0 && (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id || order.id}
              className="bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    {order.order_no || "Order"}
                  </h2>
                  <p className="text-gray-500 mt-1">
                    Table: <span className="font-medium text-gray-700">{getTableNumber(order)}</span>
                  </p>
                </div>

                <span
                  className={`inline-block px-5 py-2 rounded-full text-sm font-semibold capitalize ${
                    order.order_status === "completed" || order.order_status === "delivered"
                      ? "bg-green-100 text-green-700"
                      : order.order_status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {order.order_status || "Pending"}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Order Type</p>
                  <p className="font-medium text-gray-900 capitalize">
                    {order.order_type || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Total Amount</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    ${Number(order.total_amount || 0).toFixed(2)}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-gray-500 mb-1">Reservation ID</p>
                  <p className="font-medium text-gray-900">
                    {order.reservation_id || "-"}
                  </p>
                </div>
              </div>

              {order.note && (
                <div className="mt-8 pt-6 border-t border-gray-100">
                  <p className="text-sm text-gray-500 mb-2">Special Note</p>
                  <p className="text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-2xl">
                    {order.note}
                  </p>
                </div>
              )}

              <div className="mt-6 text-xs text-gray-400">
                {order.created_at && new Date(order.created_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default MyOrders;