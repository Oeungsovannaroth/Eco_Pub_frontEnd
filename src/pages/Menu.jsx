import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

function Menu() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const isLoggedIn = !!localStorage.getItem("token");

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const headers = {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const res = await fetch(`${API_BASE_URL}/menu-items`, {
        method: "GET",
        headers,
      });

      if (res.status === 401) {
        throw new Error("Session expired. Please login again.");
      }
      if (!res.ok) {
        throw new Error(`Failed to load menu: ${res.status}`);
      }

      const data = await res.json();
      setMenuItems(Array.isArray(data?.data) ? data.data : []);
    } catch (err) {
      setError(err.message || "Something went wrong while loading the menu.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [menuItems, searchTerm]);

  // Handle Add to Cart - SAME as Home page
  const handleAddToCart = (item) => {
    if (!isLoggedIn) {
      navigate("/login", {
        state: { message: "Please login to add items to your cart 🍺" },
      });
      return;
    }

    addToCart(item);

    Swal.fire({
      title: "Added!",
      text: `${item.name} has been added to your cart 🛒`,
      icon: "success",
      timer: 1500,
      showConfirmButton: false,
      background: "#1e1a16",
      color: "#d4c5ae",
    });
  };

  return (
    <main className="bg-[#0e0c0a] min-h-screen">
      {/* MENU SECTION */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8">
            <p className="text-amber-400 text-sm font-medium tracking-[3px] uppercase">
              ORDER NOW
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
          </div>

          <h2 className="text-5xl font-bold text-white tracking-tighter mb-4 font-serif">
            Our Menu
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mb-12">
            Discover our signature dishes and carefully selected beverages
          </p>

          {/* Search Bar */}
          <div className="mb-12 max-w-xl">
            <SearchBar
              searchTerm={searchTerm}
              setSearchTerm={setSearchTerm}
              placeholder="Search beers, cocktails, food..."
            />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex justify-center py-20">
              <Loader text="Loading menu..." />
            </div>
          )}

          {/* Error State */}
          {!loading && error && (
            <div className="bg-[#171410] border border-red-500/20 rounded-3xl p-12 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Menu Grid */}
          {!loading && !error && (
            <>
              {filteredMenuItems.length === 0 ? (
                <div className="bg-[#171410] border border-[#2e2820] rounded-3xl p-20 text-center">
                  <p className="text-amber-300/70 text-xl">
                    No menu items found matching your search.
                  </p>
                  <button
                    onClick={() => setSearchTerm("")}
                    className="mt-6 text-amber-400 hover:text-amber-300 text-sm underline"
                  >
                    Clear Search
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                  {filteredMenuItems.map((item) => (
                    <div
                      key={item._id || item.id}
                      className="product-card-wrapper"
                    >
                      <ProductCard
                        product={item}
                        onAddToCart={handleAddToCart}   
                      />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}

          {!isLoggedIn && (
            <div className="mt-16 text-center text-amber-300/70 text-sm">
              Login to add items to your cart and place orders 🍺
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

export default Menu;