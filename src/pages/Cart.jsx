import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

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

  return (
    <main className="mx-auto max-w-7xl px-6 py-12 bg-gray-50 min-h-screen">
      <div className="mb-10">
        <h1 className="text-4xl font-semibold tracking-tight text-gray-900">Your Cart</h1>
        <p className="mt-2 text-lg text-gray-600">Review and manage your selected items</p>
      </div>

      {cartItems.length === 0 ? (
        <div className="mx-auto max-w-md rounded-3xl bg-white p-16 text-center shadow-sm">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100 text-5xl">
            🛒
          </div>
          <h2 className="text-2xl font-medium text-gray-900">Your cart is empty</h2>
          <p className="mt-3 text-gray-600">Looks like you haven't added anything yet.</p>
        </div>
      ) : (
        <div className="grid gap-10 lg:grid-cols-12">
          {/* Cart Items */}
          <div className="lg:col-span-8 space-y-6">
            {cartItems.map((item) => {
              const imageUrl = getImage(item);

              return (
                <div
                  key={getItemId(item)}
                  className="flex flex-col md:flex-row gap-6 bg-white rounded-3xl p-8 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  {/* Image */}
                  <div className="md:w-36 h-36 flex-shrink-0 overflow-hidden rounded-2xl bg-gray-100 border border-gray-100">
                    {imageUrl ? (
                      <img
                        src={imageUrl}
                        alt={getMenuName(item)}
                        className="h-full w-full object-cover transition-transform hover:scale-105 duration-500"
                        onError={(e) => (e.target.style.display = "none")}
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-50 text-sm text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>

                  {/* Item Details */}
                  <div className="flex flex-1 flex-col">
                    <div className="flex-1">
                      <h3 className="text-2xl font-semibold text-gray-900">
                        {getMenuName(item)}
                      </h3>
                      <p className="mt-2 text-2xl font-medium text-gray-700">
                        ${getPrice(item).toFixed(2)}
                      </p>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
                      <div className="flex items-center gap-5">
                        <button
                          onClick={() => decreaseQty(getItemId(item), item.quantity)}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-300 text-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          −
                        </button>
                        <span className="min-w-[40px] text-center text-3xl font-semibold text-gray-900">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => increaseQty(getItemId(item), item.quantity)}
                          className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gray-300 text-2xl hover:bg-gray-100 active:bg-gray-200 transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <button
                        onClick={() => removeFromCart(getItemId(item))}
                        className="px-7 py-3 text-red-600 hover:text-red-700 hover:bg-red-50 font-medium rounded-2xl transition-all"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-4">
            <div className="sticky top-8 rounded-3xl bg-white p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Order Summary</h2>

              <div className="space-y-6">
                <div className="flex justify-between items-baseline border-t border-gray-200 pt-6">
                  <span className="text-xl text-gray-700">Total</span>
                  <span className="text-4xl font-semibold text-gray-900">
                    ${cartTotal.toFixed(2)}
                  </span>
                </div>

                <button
                  onClick={() => navigate("/checkout")}
                  className="w-full bg-gray-900 hover:bg-black active:bg-gray-950 text-white font-semibold py-4 rounded-2xl text-lg transition-all duration-200"
                >
                  Proceed to Checkout
                </button>

                <button
                  onClick={clearCart}
                  className="w-full border border-gray-300 hover:bg-gray-100 active:bg-gray-50 text-gray-700 font-medium py-4 rounded-2xl transition-all"
                >
                  Clear Cart
                </button>
              </div>

              <p className="text-center text-xs text-gray-500 mt-8">
                Taxes and fees will be calculated at checkout
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default Cart;