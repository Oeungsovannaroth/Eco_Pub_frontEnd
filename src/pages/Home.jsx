import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import Loader from "../components/Loader";
import SearchBar from "../components/SearchBar";
import LedBar from "../components/LedBar";
import { useCart } from "../context/CartContext";
import Swal from "sweetalert2";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500&display=swap');

  :root {
    --bg:        #0e0c0a;
    --surface:   #171410;
    --card:      #1e1a16;
    --border:    #2e2820;
    --amber:     #e8a427;
    --amber-dim: #9c6d17;
    --cream:     #f5ead8;
    --muted:     #6b5f50;
    --text:      #d4c5ae;
    --serif:     'Playfair Display', Georgia, serif;
    --sans:      'DM Sans', system-ui, sans-serif;
  }

  .pub-root {
    background: var(--bg);
    min-height: 100vh;
    color: var(--text);
    font-family: var(--sans);
  }

  /* Grain overlay */
  .pub-root::before {
    content: '';
    position: fixed;
    inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none;
    z-index: 0;
  }

  .pub-root > * { position: relative; z-index: 1; }
`;

function Home() {
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const API_BASE_URL = "http://127.0.0.1:8000/api";

  const [menuItems, setMenuItems] = useState([]);
  const [banners, setBanners] = useState([]);
  const [ledMessages, setLedMessages] = useState([]);
  const [events, setEvents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);

  const isLoggedIn = !!localStorage.getItem("token");

  // Auto slide for Hero
  useEffect(() => {
    if (banners.length === 0) return;
    const interval = setInterval(() => {
      setCurrentHeroSlide((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [banners.length]);

  // Auto slide for small banner
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % banners.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [banners.length]);

  useEffect(() => {
    loadHomeData();
  }, []);

  const loadHomeData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const headers = {
        Accept: "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      };

      const [menuRes, bannerRes, ledRes, eventRes] = await Promise.all([
        fetch(`${API_BASE_URL}/menu-items`, { headers }),
        fetch(`${API_BASE_URL}/banners`, { headers }),
        fetch(`${API_BASE_URL}/led-messages`, { headers }),
        fetch(`${API_BASE_URL}/events`, { headers }),
      ]);

      const [menuData, bannerData, ledData, eventData] = await Promise.all([
        menuRes.json(),
        bannerRes.json(),
        ledRes.json(),
        eventRes.json(),
      ]);

      setMenuItems(Array.isArray(menuData?.data) ? menuData.data : []);
      setBanners(Array.isArray(bannerData?.data) ? bannerData.data : []);
      setLedMessages(Array.isArray(ledData?.data) ? ledData.data : []);
      setEvents(Array.isArray(eventData?.data) ? eventData.data : []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data. Please login.");
    } finally {
      setLoading(false);
    }
  };

  const filteredMenuItems = useMemo(() => {
    return menuItems.filter((item) =>
      item.name?.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }, [menuItems, searchTerm]);

  // Handle Add to Cart with Login Check
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
    });
  };

  return (
    <div className="pub-root">
      <style>{css}</style>

      {/* HERO SECTION */}
      <section className="relative h-screen bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0">
          {banners.length > 0 ? (
            banners.map((banner, index) => (
              <div
                key={banner._id || index}
                className={`absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
                  index === currentHeroSlide ? "opacity-100" : "opacity-0"
                }`}
                style={{ backgroundImage: `url('${banner.image_url}')` }}
              />
            ))
          ) : (
            <div
              className="absolute inset-0 bg-cover bg-center"
              style={{
                backgroundImage:
                  "url('https://image2url.com/r2/default/images/1775188296928-f2dcefde-6342-4449-91ff-bb80de2d6004.jpg')",
              }}
            />
          )}
        </div>

        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70" />

        <div className="relative z-10 text-center max-w-4xl px-6">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-amber-400/70" />
            <p className="text-amber-300 tracking-[4px] text-sm font-medium uppercase">
              THE CLOUD9 PUB
            </p>
            <div className="h-px w-12 bg-amber-400/70" />
          </div>

          <h1 className="text-white text-5xl md:text-6xl font-bold tracking-tight leading-none mb-6 font-serif">
            {banners[currentHeroSlide]?.title || "Welcome to Cloud9 Pub"}
          </h1>

          <p className="text-white/80 text-lg md:text-xl max-w-lg mx-auto">
            {banners[currentHeroSlide]?.description ||
              "A warm, cozy pub where every pint tells a story."}
          </p>
        </div>

        {banners.length > 1 && (
          <>
            <button
              onClick={() =>
                setCurrentHeroSlide(
                  (prev) => (prev - 1 + banners.length) % banners.length,
                )
              }
              className="absolute left-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-6xl z-20"
            >
              ←
            </button>
            <button
              onClick={() =>
                setCurrentHeroSlide((prev) => (prev + 1) % banners.length)
              }
              className="absolute right-8 top-1/2 -translate-y-1/2 text-white/70 hover:text-white text-6xl z-20"
            >
              →
            </button>
          </>
        )}
      </section>

      <LedBar messages={ledMessages} />

      <main>
        {loading && <Loader text="Loading the pub..." />}

        {!loading && error && (
          <div className="text-center py-20 text-red-400">{error}</div>
        )}

        {!loading && !error && (
          <>
            {/* Upcoming Events */}
            <section className="py-16">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-amber-400 text-sm font-medium tracking-[3px] uppercase">
                    WHAT'S ON TONIGHT
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
                </div>

                <h2 className="text-4xl font-serif text-white mb-12">
                  Upcoming Events
                </h2>

                {events.length === 0 ? (
                  <div className="bg-[#171410] border border-[#2e2820] rounded-3xl p-16 text-center">
                    <p className="text-amber-300/70">
                      No events at the moment. Check back soon!
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {events.map((event) => (
                      <div
                        key={event._id}
                        className="group bg-[#1e1a16] border border-[#2e2820] rounded-3xl overflow-hidden hover:border-amber-400/50 transition-all hover:-translate-y-2"
                      >
                        <div className="relative h-64 overflow-hidden">
                          {event.image_url ? (
                            <img
                              src={event.image_url}
                              alt={event.title}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full bg-[#171410] flex items-center justify-center">
                              <span className="text-amber-300/30">
                                Event Image
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="p-7">
                          <h3 className="text-2xl font-serif text-white mb-3">
                            {event.title}
                          </h3>
                          <p className="text-[#d4c5ae]/70 text-sm leading-relaxed mb-6 line-clamp-3">
                            {event.description}
                          </p>
                          <div className="text-sm text-amber-300/80">
                            {event.event_date} • {event.start_time} –{" "}
                            {event.end_time}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Featured Banners */}
            <section className="py-16 bg-[#0e0c0a]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-amber-400 uppercase text-sm font-medium tracking-[3px]">
                    HIGHLIGHTS
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
                </div>
                <h2 className="text-4xl font-serif text-white mb-12">
                  Featured Offers
                </h2>

                {banners.length > 0 && (
                  <div className="relative h-[520px] rounded-3xl overflow-hidden shadow-2xl">
                    {banners.map((banner, index) => (
                      <div
                        key={index}
                        className={`absolute inset-0 transition-opacity duration-1000 ${index === currentBannerIndex ? "opacity-100" : "opacity-0"}`}
                      >
                        <img
                          src={banner.image_url}
                          alt={banner.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                        <div className="absolute bottom-0 left-0 right-0 p-10 md:p-16">
                          <h3 className="text-white text-5xl font-serif font-bold leading-tight">
                            {banner.title}
                          </h3>
                        </div>
                      </div>
                    ))}

                    {/* Dots */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
                      {banners.map((_, i) => (
                        <button
                          key={i}
                          onClick={() => setCurrentBannerIndex(i)}
                          className={`w-3 h-3 rounded-full transition-all ${i === currentBannerIndex ? "bg-amber-400 w-10" : "bg-white/40"}`}
                        />
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>

            {/* Menu Section */}
            <section className="py-16 bg-[#0e0c0a]">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex items-center gap-4 mb-6">
                  <p className="text-amber-400 text-sm font-medium tracking-[3px] uppercase">
                    MENU
                  </p>
                  <div className="h-px flex-1 bg-gradient-to-r from-amber-400/30 to-transparent"></div>
                </div>

                <h2 className="text-4xl font-serif text-white mb-10">
                  Our Menu
                </h2>

                <div className="mb-12 max-w-2xl">
                  <SearchBar
                    searchTerm={searchTerm}
                    setSearchTerm={setSearchTerm}
                    placeholder="Search beers, cocktails, food..."
                  />
                </div>

                {filteredMenuItems.length === 0 ? (
                  <div className="bg-[#171410] border border-[#2e2820] rounded-3xl p-20 text-center">
                    <p className="text-amber-300/70">No items found.</p>
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

                {!isLoggedIn && (
                  <div className="mt-12 text-center text-amber-300/70 text-sm">
                    Login to add items to your cart and place orders
                  </div>
                )}
              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
}

export default Home;
