import { useEffect, useState } from "react";
import { apiFetch } from "../services/api";

function StaffManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [open, setOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);

  const [form, setForm] = useState({
    _id: null,
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "staff",
    status: "active",
  });

  const user = JSON.parse(localStorage.getItem("user"));

  // ================= ACCESS =================
  if (user?.role !== "admin") {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="bg-white shadow-lg border rounded-xl p-8 max-w-md text-center">
          <div className="text-5xl mb-3">🚫</div>

          <h1 className="text-2xl font-bold text-red-600">Access Restricted</h1>

          <p className="text-gray-600 mt-3">
            Only Admin can access Staff Management.
          </p>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-5 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ================= LOAD USERS =================
  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await apiFetch("/admin/users");
      setUsers(res.users || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ================= FORM HANDLER =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= CREATE + UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editMode) {
        // UPDATE
        await apiFetch(`/admin/users/${form._id || form.id}`, {
          method: "PUT",
          body: JSON.stringify(form),
        });
      } else {
        // CREATE
        await apiFetch("/admin/create-user", {
          method: "POST",
          body: JSON.stringify(form),
        });
      }

      setOpen(false);
      setEditMode(false);

      setForm({
        _id: null,
        name: "",
        email: "",
        password: "",
        phone: "",
        role: "staff",
        status: "active",
      });

      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= DELETE =================
  const handleDelete = async (row) => {
    const ok = window.confirm(`Delete ${row.name}?`);
    if (!ok) return;

    try {
      await apiFetch(`/admin/users/${row._id || row.id}`, {
        method: "DELETE",
      });

      loadUsers();
    } catch (err) {
      alert(err.message);
    }
  };

  // ================= EDIT =================
  const handleEdit = (row) => {
    setForm({
      _id: row._id || row.id,
      name: row.name || "",
      email: row.email || "",
      password: "",
      phone: row.phone || "",
      role: row.role || "staff",
      status: row.status || "active",
    });
    setEditMode(true);
    setOpen(true);
  };

  // ================= STYLE =================
  const roleStyle = (role) => {
    switch (role) {
      case "admin":
        return "bg-red-100 text-red-700";
      case "staff":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const statusStyle = (status) =>
    status === "active"
      ? "bg-emerald-100 text-emerald-700"
      : "bg-gray-100 text-gray-600";

  // ================= UI =================
  return (
    <div>
      {/* HEADER */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Staff</h1>
          <p className="text-gray-500 mt-1">Manage staff and admin accounts</p>
        </div>

        <button
          onClick={() => {
            setOpen(true);
            setEditMode(false);
            setForm({
              _id: null,
              name: "",
              email: "",
              password: "",
              phone: "",
              role: "staff",
              status: "active",
            });
          }}
          className="rounded-lg cursor-pointer bg-gray-900 px-4 py-2 text-white hover:bg-black"
        >
          + Add Staff
        </button>
      </div>

      {/* LOADING / ERROR */}
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {/* TABLE */}
      {!loading && !error && (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-100 text-left">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Email</th>
                <th className="p-3">Role</th>
                <th className="p-3">Phone</th>
                <th className="p-3">Status</th>
                <th className="p-3">Actions</th>
              </tr>
            </thead>

            <tbody>
              {users.map((row, i) => (
                <tr key={i} className="border-t hover:bg-gray-50">
                  <td className="p-3 font-medium">{row.name}</td>
                  <td className="p-3 text-gray-600">{row.email}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${roleStyle(row.role)}`}
                    >
                      {row.role}
                    </span>
                  </td>

                  <td className="p-3 text-gray-600">{row.phone || "-"}</td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 text-xs rounded-full ${statusStyle(row.status)}`}
                    >
                      {row.status}
                    </span>
                  </td>

                  {/* ACTIONS */}
                  <td className="p-3 flex gap-2">
                    <button
                      onClick={() => handleEdit(row)}
                      className="bg-blue-500 cursor-pointer text-white px-3 py-1 rounded text-xs hover:bg-blue-600"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(row)}
                      className="bg-red-500 cursor-pointer text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= MODAL ================= */}
      {open && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-xl rounded-xl p-6 relative">
            {/* Close */}
            <button
              onClick={() => setOpen(false)}
              className="absolute top-3 cursor-pointer right-3 text-gray-500 hover:text-black"
            >
              ✕
            </button>

            <h2 className="text-xl font-bold text-center mb-4">
              {editMode ? "Edit Staff" : "Create Staff"}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Name"
                className="w-full border p-3 rounded"
              />

              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Email"
                className="w-full border p-3 rounded"
              />

              {!editMode && (
                <input
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full border p-3 rounded"
                />
              )}

              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Phone"
                className="w-full border p-3 rounded"
              />

              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="staff">Staff</option>
                <option value="admin">Admin</option>
              </select>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full border p-3 rounded"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>

              <button className="w-full cursor-pointer bg-gray-900 text-white py-3 rounded hover:bg-black">
                {editMode ? "Update User" : "Create User"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffManagement;
