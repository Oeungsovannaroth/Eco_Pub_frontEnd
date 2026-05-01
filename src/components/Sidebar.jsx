import { NavLink, useNavigate } from "react-router-dom";
import { HiMenu } from "react-icons/hi";
import { MdPayment } from "react-icons/md";
import { FaImages } from "react-icons/fa";
import { MdOutlineEventRepeat } from "react-icons/md";
import { IoCalendarNumberOutline } from "react-icons/io5";
import { IoReceiptOutline } from "react-icons/io5";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { FaChair } from "react-icons/fa";
import { FaFantasyFlightGames } from "react-icons/fa";
import { TbCategory2 } from "react-icons/tb";
import { FaUserClock } from "react-icons/fa";
import { FaUsers } from "react-icons/fa";
const linkBase =
  "flex items-center rounded-lg px-4 py-3 text-sm font-medium transition-all";
const activeClass = "bg-gray-800 text-white";
const inactiveClass = "text-gray-300 hover:bg-gray-800 hover:text-white";

function Sidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <aside className="flex min-h-screen w-64 flex-col bg-gray-900 text-white">
      <div className="border-b border-gray-800 p-6">
        <h1 className="text-xl uppercase font-bold">Cloud9 Admin</h1>
        <p className="text-xs text-gray-400">Management Panel</p>
      </div>

      <nav className="flex-1 space-y-2 p-4">
        <NavLink
          to="/dashboard"
          end
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <MdOutlineSpaceDashboard className="text-xl mr-1.5" /> Dashboard
        </NavLink>

        <NavLink
          to="/dashboard/orders"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <IoReceiptOutline className="text-xl mr-1.5" /> Orders
        </NavLink>

        <NavLink
          to="/dashboard/reservations"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <IoCalendarNumberOutline className="text-xl mr-1.5" /> Reservations
        </NavLink>

        <NavLink
          to="/dashboard/menu-items"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <HiMenu className="text-xl mr-1.5" />
          Menu Items
        </NavLink>
        <NavLink
          to="/dashboard/categories"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <TbCategory2 className="text-xl mr-1.5" />
          Category
        </NavLink>

        <NavLink
          to="/dashboard/payments"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <MdPayment className="text-xl mr-1.5" /> Payments
        </NavLink>
        <NavLink
          to="/dashboard/pub-tables"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaChair className="text-xl mr-1.5" /> Tables
        </NavLink>

        <NavLink
          to="/dashboard/banners"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaImages className="text-xl mr-1.5" /> Banners
        </NavLink>

        <NavLink
          to="/dashboard/events"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <MdOutlineEventRepeat className="text-xl mr-1.5" /> Events
        </NavLink>
        <NavLink
          to="/dashboard/led-messages"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaFantasyFlightGames className="text-xl mr-1.5" /> LED Messages
        </NavLink>
        <NavLink
          to="/dashboard/staff-shifts"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaUserClock className="text-xl mr-1.5" /> Staff Shifts
        </NavLink>
        <NavLink
          to="/dashboard/staff"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? activeClass : inactiveClass}`
          }
        >
          <FaUsers className="text-xl mr-1.5" /> User Management
        </NavLink>
      </nav>

      <div className="border-t border-gray-800 p-4">
        <button
          onClick={handleLogout}
          className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
