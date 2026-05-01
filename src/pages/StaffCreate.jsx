import { useState } from "react";
import { apiFetch } from "../services/api";

function StaffCreate() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "staff",
  });

  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  // 🔐 Protect page
  if (user?.role !== "admin") {
    return <div className="p-6 text-red-500 font-bold">Access Denied 🚫</div>;
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await apiFetch("/admin/create-user", {
        method: "POST",
        body: JSON.stringify(form),
      });

      alert("User created ✅");
    } catch (err) {
      console.error(err);
      alert(err.message);
    }
  };

  return (
    <div className="p-6 flex justify-center">
      <div className="w-full max-w-xl bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Create Staff / Admin
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email Address"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone (optional)"
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          />

          <select
            name="role"
            value={form.role}
            onChange={handleChange}
            className="w-full border rounded-lg p-3 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option value="staff">Staff</option>
            <option value="admin">Admin</option>
          </select>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
          >
            {loading ? "Creating..." : "Create User"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default StaffCreate;
