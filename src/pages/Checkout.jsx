import { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { apiFetch } from "../services/api";

function Checkout() {
  const { cartItems, cartTotal, clearCart, loadCart } = useCart();
  const navigate = useNavigate();

  const [tableNumber, setTableNumber] = useState("");
  // const [reservationId, setReservationId] = useState("");
  const [orderType, setOrderType] = useState("dine_in");
  const [note, setNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // Tax Configuration (Change percentage here if needed)
  const TAX_RATE = 0.10; // 10% tax

  // Calculate Tax and Grand Total
  const taxAmount = useMemo(() => {
    return cartTotal * TAX_RATE;
  }, [cartTotal]);

  const grandTotal = useMemo(() => {
    return cartTotal + taxAmount;
  }, [cartTotal, taxAmount]);

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
          // reservation_id: reservationId || null,
          order_type: orderType,
          note: note || null,
          // You can send tax info to backend if needed:
          // tax_amount: taxAmount,
          // grand_total: grandTotal,
        }),
      });

      await clearCart();
      await loadCart();

      navigate("/order-success", {
        state: {
          order: response?.data,
          tableNumber: tableNumber.trim().toUpperCase(),
          subtotal: cartTotal,
          tax: taxAmount,
          total: grandTotal,
        },
      });
    } catch (err) {
      alert(err.message || "Checkout failed.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-zinc-950 py-8 md:py-12">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12 md:mb-16">
          <Link
            to="/"
            className="flex cursor-pointer items-center gap-3 text-zinc-400 hover:text-amber-400 transition-colors text-base md:text-lg font-medium"
          >
            ← Back to Home
          </Link>

          <h1 className="text-4xl uppercase md:text-5xl font-bold tracking-tighter text-white text-center sm:text-left">
            Checkout
          </h1>

          <div className="text-3xl md:text-4xl">🍺</div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20 md:py-28">
            <div className="mx-auto mb-8 text-8xl md:text-[120px] opacity-80">🛒</div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">Cart is empty</h2>
            <p className="text-xl md:text-2xl text-zinc-400">Please add some items before checkout</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Order Items */}
            <div className="lg:col-span-7 space-y-6 md:space-y-8">
              <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                Your Order
              </h2>

              {cartItems.map((item, index) => {
                const imageUrl = getImage(item);

                return (
                  <div
                    key={item._id || item.id || index}
                    className="bg-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 md:gap-8 border border-zinc-800 hover:border-amber-500/30 transition-all"
                  >
                    {/* Image */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMenuName(item)}
                          className="w-full h-full object-cover rounded-2xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl text-amber-400/30">
                          🍺
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
                        {getMenuName(item)}
                      </h3>

                      <div className="mt-auto pt-6 md:pt-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="text-lg md:text-xl text-zinc-400">
                          Qty: <span className="font-bold text-amber-400">{item.quantity}</span>
                        </div>
                        <div className="text-2xl md:text-3xl font-bold text-white">
                          ${(item.subtotal || item.price * item.quantity || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Information Sidebar */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-900 rounded-3xl p-6 md:p-10 border border-zinc-800 sticky top-6 md:top-8">
                <h2 className="text-2xl md:text-3xl font-bold text-amber-400 mb-8 md:mb-10">
                  Order Information
                </h2>

                <div className="space-y-7 md:space-y-8">
                  {/* Table Number */}
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3 tracking-wider">
                      TABLE NUMBER <span className="text-red-400">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="T04"
                      value={tableNumber}
                      onChange={(e) => setTableNumber(e.target.value.toUpperCase())}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div>

                  {/* Reservation ID */}
                  {/* <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3 tracking-wider">
                      RESERVATION ID (Optional)
                    </label>
                    <input
                      type="text"
                      placeholder="RES-123456"
                      value={reservationId}
                      onChange={(e) => setReservationId(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none"
                    />
                  </div> */}

                  {/* Order Type */}
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3 tracking-wider">
                      ORDER TYPE
                    </label>
                    <select
                      value={orderType}
                      onChange={(e) => setOrderType(e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-base md:text-lg text-white focus:outline-none"
                    >
                      <option value="dine_in">Dine In</option>
                      <option value="takeaway">Takeaway</option>
                      <option value="reservation">Reservation</option>
                    </select>
                  </div>

                  {/* Note */}
                  <div>
                    <label className="block text-sm font-medium text-amber-300 mb-3 tracking-wider">
                      SPECIAL INSTRUCTIONS
                    </label>
                    <textarea
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Any special requests or notes..."
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl px-5 py-4 text-base md:text-lg text-white placeholder-zinc-500 focus:outline-none resize-y min-h-[110px] md:min-h-[130px]"
                      rows="4"
                    />
                  </div>

                  {/* Pricing Breakdown */}
                  <div className="pt-8 border-t border-zinc-800 space-y-4">
                    <div className="flex justify-between text-zinc-400">
                      <span>Subtotal</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-zinc-400">
                      <span>Tax (10%)</span>
                      <span>${taxAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between items-baseline border-t border-zinc-700 pt-4">
                      <span className="text-xl text-white">Grand Total</span>
                      <span className="text-4xl md:text-5xl font-bold tracking-tighter text-amber-400">
                        ${grandTotal.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Place Order Button */}
                  <button
                    onClick={handlePlaceOrder}
                    disabled={submitting || !tableNumber.trim()}
                    className="w-full mt-6 py-4 md:py-5 cursor-pointer bg-amber-500 hover:bg-amber-400 active:bg-amber-600 disabled:bg-zinc-700 disabled:text-zinc-500 text-zinc-950 font-bold text-lg md:text-xl rounded-2xl transition-all duration-200 shadow-xl shadow-amber-500/30"
                  >
                    {submitting ? "Processing Order..." : "CONFIRM & PLACE ORDER"}
                  </button>

                  <p className="text-center text-xs md:text-sm text-zinc-500 mt-6 tracking-wider">
                    Taxes included • You will receive confirmation shortly
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Checkout;