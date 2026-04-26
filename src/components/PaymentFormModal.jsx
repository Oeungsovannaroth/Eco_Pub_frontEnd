import { useEffect, useState } from "react";

function PaymentFormModal({
  isOpen,
  onClose,
  onSubmit,
  orders,
  initialData = null,
}) {
  const [form, setForm] = useState({
    order_id: "",
    payment_method: "cash",
    amount: "",
    payment_status: "unpaid",
    transaction_code: "",
    paid_at: "",
  });

  useEffect(() => {
    if (initialData) {
      setForm({
        order_id: initialData.order_id || "",
        payment_method: initialData.payment_method || "cash",
        amount: initialData.amount || "",
        payment_status: initialData.payment_status || "unpaid",
        transaction_code: initialData.transaction_code || "",
        paid_at: initialData.paid_at || "",
      });
    } else {
      setForm({
        order_id: "",
        payment_method: "cash",
        amount: "",
        payment_status: "unpaid",
        transaction_code: "",
        paid_at: "",
      });
    }
  }, [initialData, isOpen]);

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-lg">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold text-gray-800">
            {initialData ? "Edit Payment" : "Add Payment"}
          </h2>
          <button onClick={onClose} className="rounded-lg px-3 py-1 hover:bg-gray-100">
            Close
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <select
            name="order_id"
            value={form.order_id}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
            required
          >
            <option value="">Select order</option>
            {orders.map((order) => (
              <option key={order._id || order.id} value={order._id || order.id}>
                {order.order_no}
              </option>
            ))}
          </select>

          <select
            name="payment_method"
            value={form.payment_method}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="cash">Cash</option>
            <option value="card">Card</option>
            <option value="qr">QR</option>
          </select>

          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="Amount"
            className="rounded-lg border px-4 py-3"
            required
          />

          <select
            name="payment_status"
            value={form.payment_status}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          >
            <option value="unpaid">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="refunded">Refunded</option>
          </select>

          <input
            type="text"
            name="transaction_code"
            value={form.transaction_code}
            onChange={handleChange}
            placeholder="Transaction code"
            className="rounded-lg border px-4 py-3"
          />

          <input
            type="datetime-local"
            name="paid_at"
            value={form.paid_at}
            onChange={handleChange}
            className="rounded-lg border px-4 py-3"
          />

          <div className="md:col-span-2 flex justify-end gap-3">
            <button type="button" onClick={onClose} className="rounded-lg border px-4 py-2">
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-gray-900 px-4 py-2 text-white hover:bg-black"
            >
              {initialData ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default PaymentFormModal;