import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../services/api";

function Checkout() {
  const { cartItems, cartTotal, clearCart, loadCart } = useCart();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState("");
  const [reservationId, setReservationId] = useState("");
  const [orderType, setOrderType] = useState("dine_in");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getMenuName = (item) =>
    item.menu_item?.name || item.menuItem?.name || item.name || "Item";

  const getImage = (item) => {
    return (
      item.menu_item?.image_url ||
      item.menuItem?.image_url ||
      item.image_url ||
      item.image ||
      null
    );
  };

  const handlePlaceOrder = async () => {
    try {
      const user = JSON.parse(localStorage.getItem("user") || "null");

      if (!user) {
        alert("Please login first.");
        return;
      }

      if (cartItems.length === 0) {
        alert("Cart is empty.");
        return;
      }

      if (!tableNumber.trim()) {
        alert("Please enter table number.");
        return;
      }

      setSubmitting(true);

      const response = await apiFetch("/cart/checkout", {
        method: "POST",
        body: JSON.stringify({
          table_id: tableNumber.trim().toUpperCase(),
          reservation_id: reservationId || null,
          order_type: orderType,
          note: note || null,
        }),
      });

      await clearCart();
      await loadCart();

      navigate("/order-success", {
        state: {
          order: response?.data,
          tableNumber: tableNumber.trim().toUpperCase(),
          total: cartTotal,
        },
      });
    } catch (err) {
      alert(err.message || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 bg-gray-50 min-h-screen">
      <div className="mb-10 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Checkout</h1>
          <p className="mt-2 text-lg text-gray-600">Complete your order</p>
        </div>

        {/* Back to Home Button */}
        <Link
          to="/"
          className="flex items-center gap-2 px-6 py-3 text-gray-700 hover:text-gray-900 hover:bg-white rounded-2xl border border-gray-300 transition-all font-medium"
        >
          ← Back to Home
        </Link>
      </div>

      {cartItems.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl">
            🛒
          </div>
          <h2 className="text-2xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-3 text-gray-600">Please add items before checkout.</p>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Order Items */}
          <div className="lg:col-span-7 space-y-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Items</h2>

            {cartItems.map((item, index) => {
              const imageUrl = getImage(item);

              return (
                <div
                  key={item._id || item.id || index}
                  className="flex gap-6 bg-white rounded-3xl p-8 shadow-sm hover:shadow transition-all"
                >
                  {/* Image */}
                  <div className="h-28 w-28 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 border">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={getMenuName(item)}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-semibold text-gray-900">
                      {getMenuName(item)}
                    </h3>
                    <div className="mt-3 flex items-center gap-6 text-gray-600">
                      <p>Qty: <span className="font-medium text-gray-900">{item.quantity}</span></p>
                      <p className="font-medium text-gray-900">
                        ${(item.subtotal || item.price * item.quantity || 0).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Order Information Sidebar */}
          <div className="lg:col-span-5">
            <div className="sticky top-8 bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Order Information</h2>

              <div className="space-y-6">
                {/* Table Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Table Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="T04"
                    value={tableNumber}
                    onChange={(e) => setTableNumber(e.target.value.toUpperCase())}
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-0 transition-all"
                  />
                </div>

                {/* Reservation ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reservation ID (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="RES-123456"
                    value={reservationId}
                    onChange={(e) => setReservationId(e.target.value)}
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-0"
                  />
                </div>

                {/* Order Type */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order Type
                  </label>
                  <select
                    value={orderType}
                    onChange={(e) => setOrderType(e.target.value)}
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-0 bg-white"
                  >
                    <option value="dine_in">Dine In</option>
                    <option value="takeaway">Takeaway</option>
                    <option value="reservation">Reservation</option>
                  </select>
                </div>

                {/* Note */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Instructions / Note
                  </label>
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Any special requests..."
                    className="w-full px-5 py-4 text-lg border border-gray-300 rounded-2xl focus:border-gray-900 focus:ring-0 resize-y min-h-[120px]"
                    rows="4"
                  />
                </div>

                {/* Total */}
                <div className="pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-baseline">
                    <span className="text-xl text-gray-700">Total Amount</span>
                    <span className="text-4xl font-semibold text-gray-900">
                      ${cartTotal.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Place Order Button */}
                <button
                  onClick={handlePlaceOrder}
                  disabled={submitting || !tableNumber.trim()}
                  className="w-full mt-6 bg-gray-900 hover:bg-black disabled:bg-gray-400 text-white font-semibold py-5 rounded-2xl text-lg transition-all duration-200 disabled:cursor-not-allowed"
                >
                  {submitting ? "Processing Order..." : "Confirm & Place Order"}
                </button>

                <p className="text-center text-xs text-gray-500 mt-4">
                  You will receive a confirmation once the order is accepted
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Checkout;