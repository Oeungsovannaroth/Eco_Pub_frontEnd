import { Link, useLocation, Navigate } from "react-router-dom";
import { useRef } from "react";
import { IoPrintSharp } from "react-icons/io5";
function OrderSuccess() {
  const location = useLocation();
  const printRef = useRef(null);

  const order = location.state?.order;
  const tableNumber = location.state?.tableNumber;
  const subtotal = location.state?.subtotal;
  const tax = location.state?.tax;
  const total = location.state?.total || location.state?.order?.total_amount;

  // Redirect if no order data
  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;

    document.body.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: #1e1a16; color: #d4c5ae;">
        ${printContent.innerHTML}
      </div>
    `;

    window.print();
    window.location.reload();
  };

  return (
    <main className="min-h-screen bg-zinc-950 py-12">
      <div className="mx-auto max-w-2xl px-6">
        <div className="rounded-3xl bg-zinc-900 p-10 md:p-12 border border-zinc-800 text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-500/10 text-7xl text-emerald-400">
            ✓
          </div>

          <h1 className="mb-4 text-4xl md:text-5xl font-bold tracking-tighter text-white">
            Order Placed Successfully
          </h1>
          <p className="mb-10 text-lg text-zinc-400">
            Thank you! Your order has been received and is now being prepared.
          </p>

          {/* Order Receipt - Printable Area */}
          <div
            ref={printRef}
            className="mb-12 rounded-2xl bg-[#171410] p-8 md:p-10 text-left border border-zinc-800"
          >
            <div className="text-center mb-10">
              <div className="text-amber-400 text-sm tracking-[4px] font-medium mb-2">
                THE CLOUD9 PUB
              </div>
              <h2 className="text-3xl font-bold text-white">Order Receipt</h2>
              <p className="text-zinc-500 mt-2">
                {new Date().toLocaleDateString()} •{" "}
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </p>
            </div>

            <div className="space-y-5 text-zinc-300">
              <div className="flex justify-between py-3 border-b border-zinc-700">
                <span className="font-medium">Order Number</span>
                <span className="font-mono text-white">
                  {order.order_no || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-700">
                <span className="font-medium">Table Number</span>
                <span className="font-semibold text-amber-400">
                  {tableNumber || "N/A"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-700">
                <span className="font-medium">Order Type</span>
                <span className="capitalize text-white">
                  {order.order_type || "Dine In"}
                </span>
              </div>
              <div className="flex justify-between py-3 border-b border-zinc-700">
                <span className="font-medium">Status</span>
                <span className="font-medium text-emerald-400 capitalize">
                  {order.order_status || "Pending"}
                </span>
              </div>

              {/* Pricing Breakdown */}
              <div className="pt-6 border-t border-zinc-700 space-y-3">
                {subtotal && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Subtotal</span>
                    <span>${Number(subtotal).toFixed(2)}</span>
                  </div>
                )}
                {tax && (
                  <div className="flex justify-between text-zinc-400">
                    <span>Tax (10%)</span>
                    <span>${Number(tax).toFixed(2)}</span>
                  </div>
                )}
                <div className="flex justify-between items-baseline pt-4 border-t border-zinc-600 text-lg">
                  <span className="font-semibold text-white">Grand Total</span>
                  <span className="text-4xl font-bold tracking-tighter text-amber-400">
                    ${Number(total || order.total_amount || 0).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            <div className="mt-10 text-center text-xs text-zinc-500">
              Thank you for dining with us!
              <br />
              Please show this receipt to the staff when collecting your order.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <button
              onClick={handlePrint}
              className="flex-1 rounded-2xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 
               text-zinc-950 font-bold py-4 text-lg transition-all duration-200 
               flex items-center justify-center gap-3 shadow-xl shadow-amber-500/30 
               hover:shadow-2xl active:scale-[0.985]"
            >
              <IoPrintSharp className="text-4xl " />
              Print
            </button>

            <Link
              to="/my-orders"
              className="flex-1 rounded-2xl border border-zinc-700 px-8 py-4 font-semibold 
               text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 
               transition-all text-center active:scale-[0.985]"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="flex-1 rounded-2xl border border-zinc-700 px-8 py-4 font-semibold 
               text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-600 
               transition-all text-center active:scale-[0.985]"
            >
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

export default OrderSuccess;
