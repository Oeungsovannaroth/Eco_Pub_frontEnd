import { useEffect, useState, useMemo } from "react";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import { useCart } from "../context/CartContext";

function Menu() {
  const { addToCart } = useCart();
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    loadMenuData();
  }, []);

  const loadMenuData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) throw new Error("Please login first.");

      const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      };

      const res = await fetch(`${API_BASE_URL}/menu-items`, {
        method: "GET",
        headers,
      });

      if (res.status === 401)
        throw new Error("Session expired. Please login again.");
      if (!res.ok) throw new Error(`Failed to load menu: ${res.status}`);

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
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [menuItems, searchTerm]);

  return (
    <main>
      {/* ==================== MENU SECTION - IMPROVED STYLE ==================== */}
      <section className="py-20 bg-[#0e0c0a]">
        <div className="max-w-7xl mx-auto px-6">
          {/* Section Header */}
          <div className="flex items-center gap-4 mb-8">
            <p className="text-amber-400 text-sm font-medium tracking-[3px] uppercase">
              ORDER NOW
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
          </div>

          <h2 className="text-5xl font-bold text-white tracking-tighter mb-4">
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
              placeholder="Search menu items..."
              textSize="text-md"
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
            <div className="bg-zinc-900 border border-red-500/20 rounded-3xl p-12 text-center">
              <p className="text-red-400">{error}</p>
            </div>
          )}

          {/* Menu Grid */}
          {!loading && !error && (
            <>
              {filteredMenuItems.length === 0 ? (
                <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-20 text-center">
                  <p className="text-zinc-400 text-xl">
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
                      <ProductCard product={item} onAddToCart={addToCart} />
                    </div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}

export default Menu;
