import { Link, useLocation, Navigate } from "react-router-dom";
import { useRef } from "react";

function OrderSuccess() {
  const location = useLocation();
  const printRef = useRef(null);

  const order = location.state?.order;
  const tableNumber = location.state?.tableNumber;
  const total = location.state?.total;

  // Redirect if no order data
  if (!order) {
    return <Navigate to="/" replace />;
  }

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <div style="padding: 40px; font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto;">
        ${printContent.innerHTML}
      </div>
    `;
    
    window.print();
    window.location.reload(); // Restore original page after printing
  };

  return (
    <main className="mx-auto max-w-4xl px-6 py-12 bg-gray-50 min-h-screen">
      <div className="max-w-2xl mx-auto">
        <div className="rounded-3xl bg-white p-10 shadow-sm text-center">
          {/* Success Icon */}
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-green-100 text-6xl text-green-600">
            ✓
          </div>

          <h1 className="mb-3 text-4xl font-semibold text-gray-900">
            Order Placed Successfully
          </h1>
          <p className="mb-10 text-lg text-gray-600">
            Thank you! Your order has been received and is now being prepared.
          </p>

          {/* Order Details - Printable Section */}
          <div ref={printRef} className="mb-10 rounded-2xl bg-gray-50 p-8 text-left border border-gray-200">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900">Order Receipt</h2>
              <p className="text-sm text-gray-500 mt-1">
                {new Date().toLocaleDateString()} • {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            <div className="space-y-4 text-gray-700">
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Order Number:</span>
                <span className="font-mono">{order.order_no || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Table Number:</span>
                <span className="font-semibold">{tableNumber || "N/A"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Order Type:</span>
                <span className="capitalize">{order.order_type || "Dine In"}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="font-medium">Status:</span>
                <span className="font-medium text-green-600 capitalize">
                  {order.order_status || "Pending"}
                </span>
              </div>
              <div className="flex justify-between py-3 pt-6 text-lg font-semibold border-t border-gray-300">
                <span>Total Amount</span>
                <span>${Number(total || order.total_amount || 0).toFixed(2)}</span>
              </div>
            </div>

            <div className="mt-8 text-center text-xs text-gray-500">
              Thank you for dining with us!<br />
              Please show this receipt to the staff when collecting your order.
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={handlePrint}
              className="flex-1 rounded-2xl bg-gray-900 px-8 py-4 font-semibold text-white hover:bg-black transition-all flex items-center justify-center gap-2"
            >
              🖨️ Print Receipt
            </button>

            <Link
              to="/my-orders"
              className="flex-1 rounded-2xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 hover:bg-gray-100 transition-all text-center"
            >
              View My Orders
            </Link>

            <Link
              to="/"
              className="flex-1 rounded-2xl border border-gray-300 px-8 py-4 font-semibold text-gray-700 hover:bg-gray-100 transition-all text-center"
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