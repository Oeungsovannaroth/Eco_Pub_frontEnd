import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Register() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    role: "customer",
    phone: "",
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`${API_BASE_URL}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Register failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      setSuccess("Welcome to the pub! Registration successful.");

      const role = data?.user?.role;

      if (role === "admin" || role === "staff") {
        navigate("/dashboard");
      } else {
        navigate("/");
      }
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] flex items-center justify-center px-6 py-10 relative overflow-hidden">
      {/* Subtle pub background texture */}
      <div className="absolute inset-0 bg-[radial-gradient(#3c2f1f_0.8px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>

      <div className="w-full max-w-2xl relative">
        {/* Pub Sign / Logo Area */}
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <div className="text-6xl">🍺</div>
          </div>
          <h1 className="text-4xl font-bold uppercase text-amber-100 tracking-wider font-serif">
            Cloud9 pub
          </h1>
          <p className="text-amber-400 text-sm tracking-[4px] mt-1">EST. 1892</p>
        </div>

        {/* Main Register Card - Wooden Pub Look */}
        <div className="bg-[#2c2118] border border-amber-900/50 rounded-2xl p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Wood grain effect overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#3c2f1f_25%,#2c2118_25%,#2c2118_50%,#3c2f1f_50%)] bg-[length:60px_60px] opacity-20 pointer-events-none"></div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-amber-100">Join the regulars</h2>
            <p className="text-amber-400/80 mt-2 text-sm uppercase">Sign up and get your first pint on us</p>
          </div>

          {/* Messages */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-400 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="mb-6 rounded-xl border border-green-800 bg-green-950/50 p-4 text-sm text-green-400 flex items-center gap-3">
              <span className="text-xl">🍻</span>
              <span>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Full Name</label>
              <input
                type="text"
                name="name"
                placeholder="John Doe"
                value={form.name}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Confirm Password</label>
              <input
                type="password"
                name="password_confirmation"
                placeholder="••••••••"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Phone Number</label>
              <input
                type="text"
                name="phone"
                placeholder="+855 12 345 678"
                value={form.phone}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-amber-300 text-sm mb-2 font-medium">Account Status</label>
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="md:col-span-2 mt-4 bg-amber-600 uppercase cursor-pointer hover:bg-amber-500 disabled:bg-amber-800 transition-all duration-300 text-white font-semibold py-4 rounded-xl text-lg shadow-inner shadow-amber-900/50 active:scale-[0.985]"
            >
              {loading ? "Pouring your account..." : "Join The Cloud9 pub!"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
            <span className="text-amber-500 text-xs tracking-widest">ALREADY A REGULAR?</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
          </div>

          {/* Login Link */}
          <Link
            to="/login"
            className="block w-full text-center cursor-pointer bg-[#1a120b] hover:bg-[#3c2f1f] border border-amber-900/70 text-amber-300 font-medium py-4 rounded-xl transition-all hover:text-amber-100"
          >
            Back to Login
          </Link>

          <p className="text-center text-amber-500/60 text-xs mt-6">
            Your first round is waiting 🍻
          </p>
        </div>

        {/* Bottom pub vibe */}
        <div className="text-center mt-8 text-amber-400/40 text-xs tracking-widest uppercase">
          • cloude9 pub •
        </div>
      </div>
    </div>
  );
}

export default Register;