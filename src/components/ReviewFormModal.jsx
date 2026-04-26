import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

export default function ReviewFormModal({ open, onClose, refresh, editData }) {
  const [form, setForm] = useState({
    menu_item_id: "",
    rating: "",
    comment: "",
  });

  useEffect(() => {
    if (editData) {
      setForm({
        menu_item_id: editData.menu_item_id || "",
        rating: editData.rating,
        comment: editData.comment || "",
      });
    }
  }, [editData]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      await apiFetch(`/reviews/${editData.id}`, {
        method: "PUT",
        body: JSON.stringify(form),
      });
    } else {
      await apiFetch("/reviews", {
        method: "POST",
        body: JSON.stringify(form),
      });
    }

    refresh();
    onClose();
  };

  if (!open) return null;

  return (
    <div className="modal">
      <form onSubmit={handleSubmit}>
        <h3>{editData ? "Edit" : "Create"} Review</h3>

        <input
          placeholder="Menu Item ID"
          value={form.menu_item_id}
          onChange={(e) =>
            setForm({ ...form, menu_item_id: e.target.value })
          }
        />

        <input
          type="number"
          placeholder="Rating (1-5)"
          value={form.rating}
          onChange={(e) =>
            setForm({ ...form, rating: e.target.value })
          }
        />

        <textarea
          placeholder="Comment"
          value={form.comment}
          onChange={(e) =>
            setForm({ ...form, comment: e.target.value })
          }
        />

        <button type="submit">Save</button>
        <button onClick={onClose}>Cancel</button>
      </form>
    </div>
  );
}