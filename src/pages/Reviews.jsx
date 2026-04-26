import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";
import ReviewFormModal from "../components/ReviewFormModal";

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [open, setOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  const fetchReviews = async () => {
    try {
      const data = await apiFetch("/reviews"); // ✅ fixed: no .json() call
      setReviews(data);
    } catch (err) {
      console.error("Failed to fetch reviews:", err.message);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleEdit = (item) => {
    setEditData(item);
    setOpen(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review?")) return;
    try {
      await apiFetch(`/reviews/${id}`, { method: "DELETE" });
      fetchReviews();
    } catch (err) {
      console.error("Failed to delete review:", err.message);
    }
  };

  return (
    <div>
      <h2>Reviews</h2>

      <button onClick={() => { setEditData(null); setOpen(true); }}>
        Add Review
      </button>

      <table>
        <thead>
          <tr>
            <th>User</th>
            <th>Menu Item</th>
            <th>Rating</th>
            <th>Comment</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reviews.map((r) => (
            <tr key={r.id}>
              <td>{r.user?.name}</td>
              <td>{r.menu_item?.name}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
              <td>
                <button onClick={() => handleEdit(r)}>Edit</button>
                <button onClick={() => handleDelete(r.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReviewFormModal
        open={open}
        onClose={() => setOpen(false)}
        refresh={fetchReviews}
        editData={editData}
      />
    </div>
  );
}