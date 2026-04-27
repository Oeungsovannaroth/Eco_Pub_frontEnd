import { useEffect, useState, useRef } from "react";
import { apiFetch } from "../services/api";

function ReservationForm() {
  const [tables, setTables] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [reservationSuccess, setReservationSuccess] = useState(null);

  const [form, setForm] = useState({
    customer_name: "",
    table_id: "",
    reservation_date: "",
    reservation_time: "",
    guest_count: 1,
    special_request: "",
  });

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const printRef = useRef(null);

  useEffect(() => {
    loadTables();
    if (user?.name) {
      setForm((prev) => ({ ...prev, customer_name: user.name }));
    }
  }, []);

  const loadTables = async () => {
    try {
      const res = await apiFetch("/pub-tables");
      const allTables = res.data || res || [];
      setTables(allTables.filter((table) => table.status === "available"));
    } catch (err) {
      console.error("Failed to load tables:", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Please login to make a reservation.");
      return;
    }
    if (!form.customer_name.trim()) {
      alert("Customer name is required.");
      return;
    }
    if (!form.table_id) {
      alert("Please select a table.");
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        customer_name: form.customer_name.trim(),
        table_id: form.table_id,
        reservation_date: form.reservation_date,
        reservation_time: form.reservation_time,
        guest_count: Number(form.guest_count),
        special_request: form.special_request.trim() || null,
        status: "pending",
      };

      const response = await apiFetch("/reservations", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const createdReservation = response.data || response;

      // 🔥 IMPORTANT: Find and attach the full table info before saving to state
      const selectedTable = tables.find((t) => 
        (t._id || t.id) === form.table_id || 
        t.table_id === form.table_id
      );

      // Attach table info to the reservation object for receipt
      const reservationWithTable = {
        ...createdReservation,
        table_info: selectedTable || { table_id: "N/A", table_number: "N/A" }
      };

      alert("Reservation created successfully!");
      setReservationSuccess(reservationWithTable);

      // Reset form
      setForm({
        customer_name: user.name || "",
        table_id: "",
        reservation_date: "",
        reservation_time: "",
        guest_count: 1,
        special_request: "",
      });

      loadTables();
    } catch (err) {
      console.error(err);
      alert(err.message || "Failed to create reservation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handlePrint = () => {
    if (printRef.current) {
      const printContents = printRef.current.innerHTML;
      const originalContents = document.body.innerHTML;
      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
      window.location.reload();
    }
  };

  const handleNewReservation = () => {
    setReservationSuccess(null);
  };

  // ==================== RECEIPT VIEW ====================
  if (reservationSuccess) {
    const reservation = reservationSuccess;
    const tableInfo = reservation.table_info || { table_id: "N/A" };

    return (
      <main className="mx-auto max-w-2xl px-6 py-12">
        <div ref={printRef} className="bg-white rounded-3xl shadow-2xl p-10 max-w-md mx-auto">
          <div className="text-center mb-8 border-b pb-6">
            <div className="flex justify-center mb-4">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-5xl font-bold text-black">
                C
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Cloud9 Pub</h1>
            <p className="text-amber-600 font-medium">Reservation Receipt</p>
            <p className="text-sm text-gray-500 mt-1">Phnom Penh, Cambodia</p>
          </div>

          <div className="space-y-5 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Reservation ID</span>
              <span className="font-medium">{reservation._id?.slice(-8) || "Pending"}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Customer</span>
              <span className="font-semibold">{reservation.customer_name}</span>
            </div>

            {/* FIXED: Table Display */}
            <div className="flex justify-between">
              <span className="text-gray-600">Table</span>
              <span className="font-semibold">
                {tableInfo.table_id || tableInfo.table_number || "N/A"}
              </span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Date</span>
              <span className="font-semibold">{reservation.reservation_date}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Time</span>
              <span className="font-semibold">{reservation.reservation_time}</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Guests</span>
              <span className="font-semibold">{reservation.guest_count}</span>
            </div>

            {reservation.special_request && (
              <div>
                <span className="text-gray-600 block mb-1">Special Request</span>
                <p className="text-gray-800 border-l-4 border-amber-500 pl-3">
                  {reservation.special_request}
                </p>
              </div>
            )}

            <div className="flex justify-between pt-4 border-t">
              <span className="text-gray-600">Status</span>
              <span className="font-semibold uppercase text-green-600">
                {reservation.status}
              </span>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 mt-10">
            Thank you for choosing Cloud9 Pub!<br />
            We look forward to serving you.
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
          <button
            onClick={handlePrint}
            className="px-8 py-4 bg-amber-600 text-white rounded-2xl font-semibold hover:bg-amber-700 transition-all flex items-center justify-center gap-2"
          >
            🖨️ Print Receipt
          </button>
          <button
            onClick={handleNewReservation}
            className="px-8 py-4 border border-gray-300 text-gray-700 rounded-2xl font-medium hover:bg-gray-50 transition-all"
          >
            Make Another Reservation
          </button>
        </div>
      </main>
    );
  }

  // Form View remains the same as before...
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <div className="rounded-3xl bg-white shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#0e0c0a] px-10 py-12 text-white">
          <div className="flex items-center gap-5">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500 text-5xl font-bold text-black shadow-xl shadow-amber-500/30">
              C
            </div>
            <div>
              <h1 className="text-4xl font-bold tracking-tighter">Book a Table</h1>
              <p className="text-amber-400 mt-1 text-lg">Cloud9 Pub • Phnom Penh</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-10">
          {/* ... your existing form fields (Customer Name, Table Select, Date, Time, Guests, Special Request) ... */}
          {/* Keep your current form as it was - only the receipt part was changed */}

          <div className="space-y-8">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Customer Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="customer_name"
                value={form.customer_name}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-lg focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none transition-all"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                Select Table <span className="text-red-500">*</span>
              </label>
              <select
                name="table_id"
                value={form.table_id}
                onChange={handleChange}
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 text-base focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none bg-white"
                required
              >
                <option value="">Choose an available table</option>
                {tables.map((table) => {
                  const tableId = table._id || table.id;
                  const displayId = table.table_id || table.table_number || "Unknown";
                  return (
                    <option key={tableId} value={tableId}>
                      {displayId} — Capacity: {table.capacity} guests
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Date</label>
                <input type="date" name="reservation_date" value={form.reservation_date} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Time</label>
                <input type="time" name="reservation_time" value={form.reservation_time} onChange={handleChange} className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-3">Guests</label>
                <input type="number" name="guest_count" value={form.guest_count} onChange={handleChange} min="1" max="100" className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none" required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">Special Request (Optional)</label>
              <textarea
                name="special_request"
                value={form.special_request}
                onChange={handleChange}
                rows="4"
                placeholder="e.g. Birthday celebration, window seat..."
                className="w-full rounded-2xl border border-gray-300 px-6 py-4 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 outline-none resize-y"
              />
            </div>
          </div>

          <div className="pt-6">
            <button
              type="submit"
              disabled={submitting || !user}
              className="w-full rounded-2xl bg-amber-600 py-5 text-xl font-semibold text-white hover:bg-amber-700 disabled:bg-gray-400 transition-all active:scale-[0.98] shadow-lg shadow-amber-600/30"
            >
              {submitting ? "Processing Reservation..." : "Confirm Reservation"}
            </button>
          </div>
        </form>
      </div>

      <p className="text-center text-gray-500 text-sm mt-10">
        We will confirm your reservation shortly via email or phone.
      </p>
    </main>
  );
}

export default ReservationForm;