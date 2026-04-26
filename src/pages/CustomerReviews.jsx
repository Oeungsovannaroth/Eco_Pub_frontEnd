import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function CustomerReviews() {
  const [reviews, setReviews] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [form, setForm] = useState({
    menu_item_id: "",
    rating: "",
    comment: "",
  });

  // =========================
  // NORMALIZE MONGODB ID
  // =========================
  const normalizeId = (val) => {
    if (!val) return null;

    if (typeof val === "object") {
      return val.$oid || val.toString();
    }

    return val.toString();
  };

  // =========================
  // FETCH REVIEWS
  // =========================
  const fetchReviews = async () => {
    try {
      const res = await apiFetch("/reviews");

      const data = Array.isArray(res)
        ? res
        : res.data || [];

      setReviews(data);
    } catch (err) {
      console.error(err);
      setReviews([]);
    }
  };

  // =========================
  // FETCH MENU ITEMS
  // =========================
  const fetchMenuItems = async () => {
    try {
      const res = await apiFetch("/menu-items");

      const data = Array.isArray(res)
        ? res
        : res.data || [];

      setMenuItems(data);
    } catch (err) {
      console.error(err);
      setMenuItems([]);
    }
  };

  useEffect(() => {
    fetchReviews();
    fetchMenuItems();
  }, []);

  // =========================
  // SUBMIT REVIEW
  // =========================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.menu_item_id) {
      alert("Please select a menu item");
      return;
    }

    try {
      await apiFetch("/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          rating: Number(form.rating), // ensure number
        }),
      });

      setForm({ menu_item_id: "", rating: "", comment: "" });
      fetchReviews();
    } catch (err) {
      console.error(err);
    }
  };

  // =========================
  // GET MENU NAME
  // =========================
  const getMenuName = (menuItemId) => {
    const cleanId = normalizeId(menuItemId);

    const found = menuItems.find(
      (item) => normalizeId(item._id) === cleanId
    );

    return found?.name || "Unknown Item";
  };

  // =========================
  // UI
  // =========================
  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <div className="max-w-4xl mx-auto">

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Customer Reviews
        </h2>

        {/* ================= FORM ================= */}
        <div className="bg-white p-6 rounded-2xl shadow mb-8">
          <h3 className="text-lg font-semibold mb-4">
            Leave a Review
          </h3>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* MENU DROPDOWN */}
            <select
              className="w-full border p-2 rounded-lg"
              value={form.menu_item_id}
              onChange={(e) =>
                setForm({ ...form, menu_item_id: e.target.value })
              }
            >
              <option value="">Select Menu Item</option>

              {menuItems.map((item) => {
                const id = normalizeId(item._id);

                return (
                  <option key={id} value={id}>
                    {item.name}
                  </option>
                );
              })}
            </select>

            {/* RATING */}
            <input
              type="number"
              min="1"
              max="5"
              className="w-full border p-2 rounded-lg"
              placeholder="Rating (1-5)"
              value={form.rating}
              onChange={(e) =>
                setForm({ ...form, rating: e.target.value })
              }
            />

            {/* COMMENT */}
            <textarea
              className="w-full border p-2 rounded-lg"
              placeholder="Write your comment..."
              value={form.comment}
              onChange={(e) =>
                setForm({ ...form, comment: e.target.value })
              }
            />

            <button className="bg-amber-500 text-black px-4 py-2 rounded-lg hover:bg-amber-600">
              Submit Review
            </button>
          </form>
        </div>

        {/* ================= REVIEWS ================= */}
        <div className="space-y-4">
          {reviews.length > 0 ? (
            reviews.map((r) => (
              <div
                key={normalizeId(r._id)}
                className="bg-white p-4 rounded-xl shadow"
              >
                {/* HEADER */}
                <div className="flex justify-between">
                  <h4 className="font-semibold text-gray-800">
                    {r.user?.name || "Anonymous"}
                  </h4>

                  <span className="text-yellow-500 font-bold">
                    ⭐ {r.rating}/5
                  </span>
                </div>

                {/* MENU NAME */}
                <p className="text-sm text-gray-500">
                  {r.menu_item_id}
                </p>

                {/* COMMENT */}
                <p className="mt-2 text-gray-700">
                  {r.comment || "No comment"}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">
              No reviews yet.
            </p>
          )}
        </div>

      </div>
    </div>
  );
}