import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ReservationForm from "./pages/ReservationForm";
import Login from "./pages/Login";
import About from "./pages/About";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Orders from "./pages/Orders";
import Reservations from "./pages/Reservations";
import MenuItems from "./pages/MenuItems";
import Payments from "./pages/Payments";
import PubTables from "./pages/PubTables";
import Banners from "./pages/Banners";
import Events from "./pages/Events";
import NotFound from "./pages/NotFound";
import LedMessages from "./pages/LedMessages";
import Categories from "./pages/Categories";
import PublicLayout from "./layouts/PublicLayout";
import AdminLayout from "./layouts/AdminLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import Menu from "./pages/Menu";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import StaffShifts from "./pages/StaffShifts";
import CustomerReviews from "./pages/CustomerReviews";
function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/order-success" element={<OrderSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/Cart" element={<Cart />} />
        <Route path="/reserve" element={<ReservationForm />} />
        <Route path="/events" element={<Events />} />
        <Route path="/reviews" element={<CustomerReviews />} />
      </Route>

      <Route path="/login" element={<Login />} />
      <Route path="/register" element={< Register />} />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="orders" element={<Orders />} />
        <Route path="reservations" element={<Reservations />} />
        <Route path="menu-items" element={<MenuItems />} />
        <Route path="payments" element={<Payments />} />
        <Route path="pub-tables" element={<PubTables />} />
        <Route path="categories" element={<Categories />} />
        <Route path="banners" element={<Banners />} />
        <Route path="events" element={<Events />} />
        <Route path="led-messages" element={<LedMessages />} />
        <Route path="staff-shifts" element={<StaffShifts />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
