import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const { cartCount } = useCart();
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user") || "null");

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
    setIsMenuOpen(false);
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <header className="sticky top-0 z-50 bg-[#0e0c0a] border-b border-amber-800/50 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-6 py-5 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-amber-500 text-2xl font-bold text-black shadow-lg shadow-amber-500/30 transition-transform group-hover:scale-110">
            C
          </div>
          <div>
            <h1 className="text-xl uppercase font-bold tracking-tighter text-white">
              Cloud9 Pub
            </h1>
            <p className="text-xs text-amber-400 -mt-1 tracking-widest">
              RESTAURANT • BAR • EVENTS
            </p>
          </div>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-9 text-sm font-medium">
          <Link
            to="/"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            About
          </Link>
          <Link
            to="/menu"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Menu
          </Link>
          <Link
            to="/reserve"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Reservation
          </Link>
          <Link
            to="/reviews"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Reviews
          </Link>
          {/* <Link
            to="/events"
            className="text-amber-100 hover:text-amber-400 transition-colors duration-200 cursor-pointer"
          >
            Events
          </Link> */}
        </nav>

        <div className="flex items-center gap-4">
          {/* Cart Button */}

          <Link
            to="/Cart"
            className="relative flex items-center gap-2 rounded-full bg-amber-500 hover:bg-amber-600 px-6 py-2.5 text-sm font-semibold text-black transition-all duration-200 active:scale-95 cursor-pointer"
          >
            Cart
            {cartCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-[#0e0c0a]">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Hamburger Button*/}
          <button
            onClick={toggleMenu}
            className="md:hidden flex flex-col justify-center items-center w-10 h-10 text-amber-100 hover:text-white transition-colors"
          >
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "rotate-45 translate-y-1.5" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current my-1 transition-all duration-300 ${isMenuOpen ? "opacity-0" : ""}`}
            ></span>
            <span
              className={`block w-6 h-0.5 bg-current transition-all duration-300 ${isMenuOpen ? "-rotate-45 -translate-y-1.5" : ""}`}
            ></span>
          </button>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-4">
            {token ? (
              <>
                <div className="text-right">
                  <p className="text-sm font-semibold text-white">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs text-amber-400/80 capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="rounded-full cursor-pointer border border-red-500/70 px-6 py-2.5 text-sm  font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all"
                >
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3">
                <Link
                  to="/login"
                  className="rounded-full cursor-pointer border border-amber-400/30 px-6 py-2.5 text-sm font-medium text-amber-100 hover:bg-amber-400/10 hover:border-amber-400 transition-all"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full cursor-pointer bg-amber-500 px-6 py-2.5 text-sm font-semibold text-black hover:bg-amber-400 transition-all active:scale-95"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-[#0e0c0a] border-t border-amber-800/50 py-6">
          <div className="flex flex-col px-6 space-y-6 text-lg">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              Home
            </Link>
            <Link
              to="/about"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              About
            </Link>
            <Link
              to="/menu"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              Menu
            </Link>
            <Link
              to="/reserve"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              Reservation
            </Link>
            {/* <Link
              to="/events"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              Events
            </Link> */}
            <Link
              to="/reviews"
              onClick={() => setIsMenuOpen(false)}
              className="text-amber-100 hover:text-amber-400 py-2"
            >
              Reviews
            </Link>

            {/* Mobile Auth */}
            {token ? (
              <div className="pt-4 border-t border-amber-800/50">
                <div className="mb-4">
                  <p className="text-white font-semibold">
                    {user?.name || "User"}
                  </p>
                  <p className="text-amber-400 text-sm capitalize">
                    {user?.role}
                  </p>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 border border-red-500/70 text-red-400 rounded-2xl hover:bg-red-500/10"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="pt-4 border-t border-amber-800/50 flex flex-col gap-3">
                <Link
                  to="/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-center border border-amber-400/30 text-amber-100 rounded-2xl hover:bg-amber-400/10"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsMenuOpen(false)}
                  className="py-3 text-center bg-amber-500 text-black rounded-2xl hover:bg-amber-400 font-semibold"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
