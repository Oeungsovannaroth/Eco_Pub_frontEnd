import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { FaCcVisa, FaCcMastercard, FaCcPaypal } from "react-icons/fa";
import { useState } from "react";

function Cart() {
  const {
    cartItems,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    cartTotal,
  } = useCart();

  const navigate = useNavigate();

  // Promo Code
  const [promoCode, setPromoCode] = useState("");
  // const [appliedPromo, setAppliedPromo] = useState(null);

  const getItemId = (item) => item._id || item.id;
  const getMenuName = (item) =>
    item.menu_item?.name || item.menuItem?.name || item.name || "Item";
  const getPrice = (item) => Number(item.price || 0);

  const getImage = (item) => {
    return (
      item.menu_item?.image_url ||
      item.menuItem?.image_url ||
      item.image_url ||
      item.image ||
      null
    );
  };

  // const handleApplyPromo = () => {
  //   if (promoCode.trim()) {
  //     setAppliedPromo(promoCode.trim().toUpperCase());
  //     alert(`Promo code "${promoCode.trim().toUpperCase()}" applied successfully!`);
  //   }
  // };

  // const removePromo = () => {
  //   setPromoCode("KHALED10");
  //   setAppliedPromo(null);
  // };

  return (
    <main className="min-h-screen bg-zinc-950 py-10">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-12">
          <button
            onClick={() => navigate(-1)}
            className="flex cursor-pointer items-center gap-2 text-zinc-400 hover:text-amber-400 transition-colors text-base font-medium"
          >
            ← Continue shopping
          </button>

          <h1 className="text-4xl uppercase md:text-5xl font-bold tracking-tighter text-white text-center sm:text-left">
            Your Cart
          </h1>

          <div className="flex items-center gap-6">
            {/* <span className="text-zinc-400 hover:text-white cursor-pointer transition-colors hidden sm:block">
              Sign in
            </span> */}
            <div className="relative">
              <span className="text-3xl">🍺</span>
              <span className="absolute -top-1 -right-1 bg-amber-500 text-zinc-950 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center ring-2 ring-zinc-900">
                {cartItems.length}
              </span>
            </div>
          </div>
        </div>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <div className="mx-auto mb-6 text-8xl opacity-75">🍻</div>
            <h2 className="text-3xl font-bold text-white">Your cart is empty</h2>
            <p className="mt-3 text-zinc-400 text-lg">Fill it with some drinks &amp; bites</p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-10">
            {/* Cart Items - Smaller & Responsive */}
            <div className="lg:col-span-7 space-y-6">
              {cartItems.map((item) => {
                const imageUrl = getImage(item);

                return (
                  <div
                    key={getItemId(item)}
                    className="bg-zinc-900 rounded-3xl p-6 md:p-8 flex flex-col md:flex-row gap-6 border border-zinc-800 hover:border-amber-500/30 transition-all"
                  >
                    {/* Image - Smaller */}
                    <div className="w-full md:w-32 h-32 flex-shrink-0 overflow-hidden rounded-2xl bg-zinc-800">
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={getMenuName(item)}
                          className="w-full h-full object-cover transition-transform hover:scale-105 duration-500"
                          onError={(e) => (e.target.style.display = "none")}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-5xl text-amber-400/30">
                          🍺
                        </div>
                      )}
                    </div>

                    {/* Details */}
                    <div className="flex-1 flex flex-col">
                      <div className="flex justify-between items-start gap-4">
                        <h3 className="text-xl md:text-2xl font-semibold text-white tracking-tight flex-1">
                          {getMenuName(item)}
                        </h3>
                        <button
                          onClick={() => removeFromCart(getItemId(item))}
                          className="text-zinc-500 cursor-pointer hover:text-red-400 text-2xl transition-colors flex-shrink-0"
                        >
                          🗑️
                        </button>
                      </div>

                      {/* Quantity & Price */}
                      <div className="mt-auto pt-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => decreaseQty(getItemId(item), item.quantity)}
                            className="w-11 cursor-pointer text-white h-11 flex items-center justify-center border-2 border-zinc-700 rounded-2xl text-3xl hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95"
                          >
                            −
                          </button>
                          <span className="font-bold text-3xl text-amber-400 w-8 text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => increaseQty(getItemId(item), item.quantity)}
                            className="w-11 cursor-pointer text-white h-11 flex items-center justify-center border-2 border-zinc-700 rounded-2xl text-3xl hover:border-amber-400 hover:text-amber-400 transition-all active:scale-95"
                          >
                            +
                          </button>
                        </div>

                        <div className="text-right">
                          <div className="text-2xl md:text-3xl font-bold text-white">
                            ${(getPrice(item) * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary - Smaller & Responsive */}
            <div className="lg:col-span-5">
              <div className="bg-zinc-900 rounded-3xl p-8 md:p-10 border border-zinc-800 sticky top-6">
                <h2 className="text-2xl font-bold text-amber-400 mb-8">Order Summary</h2>

                <div className="flex justify-between items-baseline mb-10">
                  <span className="text-lg text-zinc-400">Subtotal</span>
                  <span className="text-4xl font-bold tracking-tighter text-white">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                {/* Promo Code - Active */}
                {/* <div className="mb-10">
                  <div className="uppercase text-xs tracking-widest text-amber-300 mb-3 font-medium">Promo Code</div>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      placeholder="ENTER CODE"
                      className="flex-1 bg-zinc-950 border border-zinc-700 focus:border-amber-500 rounded-2xl px-5 py-3.5 text-base text-white placeholder:text-zinc-500 focus:outline-none"
                    />
                    <button
                      onClick={handleApplyPromo}
                      disabled={!promoCode.trim()}
                      className="px-8 py-3.5 bg-amber-500 hover:bg-amber-400 disabled:bg-zinc-700 disabled:text-zinc-500 font-semibold rounded-2xl transition-all text-sm whitespace-nowrap"
                    >
                      APPLY
                    </button>
                  </div>

                  {appliedPromo && (
                    <div className="mt-4 text-emerald-400 text-sm flex items-center justify-between bg-emerald-950/50 border border-emerald-500/30 px-4 py-2.5 rounded-2xl">
                      <span>✅ {appliedPromo} applied</span>
                      <button onClick={removePromo} className="underline hover:text-emerald-300">
                        Remove
                      </button>
                    </div>
                  )}
                </div> */}

                <p className="text-zinc-500 text-sm mb-8">
                  Taxes, service fees, and delivery will be calculated at checkout.
                </p>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full cursor-pointer py-4 bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-zinc-950 font-bold text-lg rounded-2xl transition-all shadow-lg shadow-amber-500/20"
                >
                  PROCEED TO CHECKOUT →
                </button>

                {/* Payment Icons */}
                <div className="mt-10 pt-8 border-t border-zinc-800 flex justify-center gap-8 text-4xl text-zinc-600">
                  <FaCcVisa />
                  <FaCcMastercard />
                  <FaCcPaypal />
                </div>

                <div className="text-center text-xs text-zinc-500 mt-6 tracking-widest">
                  🔒 SECURE CHECKOUT
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

export default Cart;