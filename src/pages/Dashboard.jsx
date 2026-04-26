import { useEffect, useMemo, useState } from "react";
import { apiFetch } from "../services/api";
import Loader from "../components/Loader";
import { 
  TrendingUp, 
  Users, 
  Calendar, 
  DollarSign, 
  UtensilsCrossed, 
  Table, 
  Image, 
  CalendarClock,
  AlertTriangle 
} from "lucide-react";

function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [payments, setPayments] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [tables, setTables] = useState([]);
  const [banners, setBanners] = useState([]);
  const [events, setEvents] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [
        ordersRes,
        reservationsRes,
        paymentsRes,
        menuItemsRes,
        tablesRes,
        bannersRes,
        eventsRes,
      ] = await Promise.all([
        apiFetch("/orders"),
        apiFetch("/reservations"),
        apiFetch("/payments"),
        apiFetch("/menu-items"),
        apiFetch("/pub-tables"),
        apiFetch("/banners"),
        apiFetch("/events"),
      ]);

      setOrders(ordersRes.data || []);
      setReservations(reservationsRes.data || []);
      setPayments(paymentsRes.data || []);
      setMenuItems(menuItemsRes.data || []);
      setTables(tablesRes.data || []);
      setBanners(bannersRes.data || []);
      setEvents(eventsRes.data || []);
    } catch (err) {
      setError(err.message || "Failed to load dashboard data.");
    } finally {
      setLoading(false);
    }
  };

  const stats = useMemo(() => {
    const totalRevenue = payments
      .filter((payment) => payment.payment_status === "paid")
      .reduce((sum, payment) => sum + Number(payment.amount || 0), 0);

    const activeReservations = reservations.filter((r) =>
      ["pending", "confirmed"].includes(r.status)
    ).length;

    const availableTables = tables.filter(
      (table) => table.status === "available"
    ).length;

    const occupiedTables = tables.filter(
      (table) => table.status === "occupied"
    ).length;

    const lowStockItems = menuItems.filter(
      (item) => Number(item.stock_qty || 0) <= 5
    ).length;

    return {
      totalOrders: orders.length,
      totalReservations: reservations.length,
      totalPayments: payments.length,
      totalRevenue,
      totalMenuItems: menuItems.length,
      totalTables: tables.length,
      totalBanners: banners.length,
      totalEvents: events.length,
      activeReservations,
      availableTables,
      occupiedTables,
      lowStockItems,
    };
  }, [orders, reservations, payments, menuItems, tables, banners, events]);

  const recentOrders = useMemo(() => orders.slice(0, 5), [orders]);
  const recentReservations = useMemo(() => reservations.slice(0, 5), [reservations]);
  const recentPayments = useMemo(() => payments.slice(0, 5), [payments]);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-lg text-gray-600">
            Welcome back! Here's what's happening at your pub today.
          </p>
        </div>

        <button
          onClick={loadDashboardData}
          className="flex cursor-pointer items-center gap-2 rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-black active:scale-95"
        >
          <span>Refresh Data</span>
        </button>
      </div>

      {loading && <Loader text="Loading dashboard..." />}

      {!loading && error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center">
          <p className="text-red-600 font-medium">{error}</p>
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Main Stats Grid */}
          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Total Orders" 
              value={stats.totalOrders} 
              icon={<UtensilsCrossed className="w-8 h-8" />}
              color="blue"
            />
            <StatCard 
              title="Total Revenue" 
              value={`$${stats.totalRevenue.toFixed(2)}`} 
              icon={<DollarSign className="w-8 h-8" />}
              color="emerald"
            />
            <StatCard 
              title="Active Reservations" 
              value={stats.activeReservations} 
              icon={<Calendar className="w-8 h-8" />}
              color="violet"
            />
            <StatCard 
              title="Available Tables" 
              value={stats.availableTables} 
              icon={<Table className="w-8 h-8" />}
              color="amber"
            />
          </section>

          {/* Secondary Stats */}
          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            <StatCard 
              title="Menu Items" 
              value={stats.totalMenuItems} 
              icon={<UtensilsCrossed className="w-8 h-8" />}
              color="slate"
            />
            <StatCard 
              title="Total Payments" 
              value={stats.totalPayments} 
              icon={<DollarSign className="w-8 h-8" />}
              color="rose"
            />
            <StatCard 
              title="Banners" 
              value={stats.totalBanners} 
              icon={<Image className="w-8 h-8" />}
              color="teal"
            />
            <StatCard 
              title="Upcoming Events" 
              value={stats.totalEvents} 
              icon={<CalendarClock className="w-8 h-8" />}
              color="indigo"
            />
          </section>

          {/* Alert Cards */}
          <section className="mb-10 grid grid-cols-1 gap-6 md:grid-cols-3">
            <MiniCard 
              title="Occupied Tables" 
              value={stats.occupiedTables} 
              description="Currently in use"
              icon={<Table />}
              alert={stats.occupiedTables > 0}
            />
            <MiniCard 
              title="Low Stock Items" 
              value={stats.lowStockItems} 
              description="Need restocking soon"
              icon={<AlertTriangle />}
              alert={stats.lowStockItems > 0}
            />
            <MiniCard 
              title="Total Reservations" 
              value={stats.totalReservations} 
              description="All time records"
              icon={<Calendar />}
            />
          </section>

          {/* Recent Activity */}
          <section className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            <DashboardTable
              title="Recent Orders"
              columns={["Order No", "Customer", "Status", "Total"]}
              rows={recentOrders.map((order) => [
                order.order_no || "-",
                order.user?.name || "-",
                order.order_status || "-",
                `$${Number(order.total_amount || 0).toFixed(2)}`,
              ])}
              emptyText="No recent orders yet"
            />

            <DashboardTable
              title="Recent Reservations"
              columns={["Customer", "Table", "Date", "Status"]}
              rows={recentReservations.map((reservation) => [
                reservation.user?.name || "-",
                reservation.table?.table_number || "-",
                reservation.reservation_date || "-",
                reservation.status || "-",
              ])}
              emptyText="No recent reservations"
            />

            <DashboardTable
              title="Recent Payments"
              columns={["Order", "Method", "Status", "Amount"]}
              rows={recentPayments.map((payment) => [
                payment.order?.order_no || "-",
                payment.payment_method || "-",
                payment.payment_status || "-",
                `$${Number(payment.amount || 0).toFixed(2)}`,
              ])}
              emptyText="No recent payments"
            />
          </section>
        </>
      )}
    </div>
  );
}

/* Enhanced StatCard */
function StatCard({ title, value, icon, color = "blue" }) {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-100",
    emerald: "text-emerald-600 bg-emerald-100",
    violet: "text-violet-600 bg-violet-100",
    amber: "text-amber-600 bg-amber-100",
    slate: "text-slate-600 bg-slate-100",
    rose: "text-rose-600 bg-rose-100",
    teal: "text-teal-600 bg-teal-100",
    indigo: "text-indigo-600 bg-indigo-100",
  };

  return (
    <div className="group rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-xl border border-gray-100 hover:-translate-y-1">
      <div className={`inline-flex h-14 w-14 items-center justify-center rounded-2xl ${colorClasses[color]}`}>
        {icon}
      </div>
      <div className="mt-6">
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <h3 className="mt-2 text-4xl font-semibold text-gray-900 tracking-tight">{value}</h3>
      </div>
    </div>
  );
}

/* Enhanced MiniCard */
function MiniCard({ title, value, description, icon, alert = false }) {
  return (
    <div className={`rounded-3xl bg-white p-8 shadow-sm transition-all hover:shadow-xl border ${alert ? 'border-orange-200' : 'border-gray-100'}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <h3 className="mt-3 text-4xl font-semibold text-gray-900">{value}</h3>
        </div>
        <div className={`rounded-2xl p-3 ${alert ? 'bg-orange-100 text-orange-600' : 'bg-gray-100 text-gray-500'}`}>
          {icon}
        </div>
      </div>
      <p className="mt-4 text-sm text-gray-500">{description}</p>
    </div>
  );
}

/* Enhanced DashboardTable */
function DashboardTable({ title, columns, rows, emptyText }) {
  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-sm border border-gray-100">
      <div className="border-b border-gray-100 bg-gray-50/80 px-8 py-5">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-100">
          <thead>
            <tr className="bg-gray-50">
              {columns.map((column, i) => (
                <th
                  key={i}
                  className="px-8 py-4 text-left text-sm font-semibold text-gray-600"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-8 py-16 text-center text-gray-400"
                >
                  {emptyText}
                </td>
              </tr>
            ) : (
              rows.map((row, rowIndex) => (
                <tr key={rowIndex} className="hover:bg-gray-50 transition-colors">
                  {row.map((cell, cellIndex) => (
                    <td
                      key={cellIndex}
                      className="px-8 py-5 text-sm text-gray-700 whitespace-nowrap"
                    >
                      {cell}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Dashboard;