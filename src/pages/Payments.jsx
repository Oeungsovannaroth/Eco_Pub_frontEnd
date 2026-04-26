import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import DataTable from "../components/DataTable";
import PaymentFormModal from "../components/PaymentFormModal";
import Loader from "../components/Loader";

function Payments() {
  const [payments, setPayments] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPayment, setEditingPayment] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const [paymentRes, orderRes] = await Promise.all([
        apiFetch("/payments"),
        apiFetch("/orders"),
      ]);

      setPayments(paymentRes.data || []);
      setOrders(orderRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load payments.");
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setEditingPayment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (payment) => {
    setEditingPayment(payment);
    setIsModalOpen(true);
  };

  const handleDelete = async (payment) => {
    const confirmed = window.confirm("Delete this payment?");
    if (!confirmed) return;

    try {
      await apiFetch(`/payments/${payment._id || payment.id}`, {
        method: "DELETE",
      });
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingPayment) {
        await apiFetch(`/payments/${editingPayment._id || editingPayment.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        await apiFetch("/payments", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setIsModalOpen(false);
      setEditingPayment(null);
      loadData();
    } catch (err) {
      alert(err.message);
    }
  };

  const columns = [
    {
      key: "order",
      label: "Order",
      render: (row) => row.order?.order_no || "-",
    },
    { key: "payment_method", label: "Method" },
    {
      key: "amount",
      label: "Amount",
      render: (row) => `$${Number(row.amount || 0).toFixed(2)}`,
    },
    {
      key: "payment_status",
      label: "Status",
      render: (row) => (
        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
          {row.payment_status}
        </span>
      ),
    },
    { key: "transaction_code", label: "Transaction Code" },
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
          <h1 className="text-3xl font-bold text-gray-800">Payments</h1>
          <p className="mt-1 text-gray-500">
            Manage payment records and statuses.
          </p>
        </div>

        <button
          onClick={handleAdd}
          className="rounded-lg bg-gray-900 px-4 py-2 cursor-pointer text-sm font-medium text-white hover:bg-black"
        >
          Add Payment
        </button>
      </div>

      {loading && <Loader text="Loading payments..." />}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-center">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <DataTable columns={columns} data={payments} actions={actions} />
      )}

      <PaymentFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingPayment(null);
        }}
        onSubmit={handleSubmit}
        orders={orders}
        initialData={editingPayment}
      />
    </div>
  );
}

export default Payments;