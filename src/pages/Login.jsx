import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login() {
  const API_BASE_URL = "http://127.0.0.1:8000/api";
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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

      const response = await fetch(`${API_BASE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed.");
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

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
     
      <div className="absolute inset-0 bg-[radial-gradient(#3c2f1f_0.8px,transparent_1px)] [background-size:40px_40px] opacity-30"></div>

      <div className="w-full max-w-md relative">
        
        <div className="text-center mb-8">
          <div className="inline-block mb-3">
            <div className="text-6xl">🍺</div>
          </div>
          <h1 className="text-4xl font-bold text-amber-100 tracking-wider font-serif uppercase">
            Cloud9 Pub
          </h1>
          <p className="text-amber-400 text-sm tracking-[4px] mt-1">EST. 1892</p>
        </div>

        {/* Main Login Card - Wooden Pub Look */}
        <div className="bg-[#2c2118] border border-amber-900/50 rounded-2xl p-10 shadow-2xl shadow-black/80 relative overflow-hidden">
          {/* Wood grain effect overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(45deg,#3c2f1f_25%,#2c2118_25%,#2c2118_50%,#3c2f1f_50%)] bg-[length:60px_60px] opacity-20 pointer-events-none"></div>

          {/* Title */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-serif text-amber-100">Welcome Back</h2>
            <p className="text-amber-400/80 mt-2 text-sm">Pull up a stool and log in</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 rounded-xl border border-red-800 bg-red-950/50 p-4 text-sm text-red-400 flex items-center gap-3">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                placeholder="your@email.com"
                required
              />
            </div>

            <div>
              <label className="block text-amber-300 text-sm mb-2 font-medium">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full bg-[#1a120b] border border-amber-900/70 text-white placeholder:text-amber-400/50 rounded-xl px-5 py-4 focus:border-amber-600 outline-none transition"
                placeholder="••••••••"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 bg-amber-600 cursor-pointer hover:bg-amber-500 disabled:bg-amber-800 transition-all duration-300 text-white font-semibold py-4 rounded-xl text-lg shadow-inner shadow-amber-900/50 active:scale-[0.985]"
            >
              {loading ? "Pulling your pint..." : "Login"}
            </button>
          </form>

          {/* Divider - Like a beer tap line */}
          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
            <span className="text-amber-500 text-xs tracking-widest">OR</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-700 to-transparent"></div>
          </div>

          {/* Register Link */}
          <Link
            to="/register"
            className="block w-full text-center bg-[#1a120b] hover:bg-[#3c2f1f] border border-amber-900/70 text-amber-300 font-medium py-4 rounded-xl transition-all hover:text-amber-100"
          >
            New here? Join the regulars
          </Link>

          <p className="text-center text-amber-500/60 text-xs mt-6">
            First drink is on us after registration 🍻
          </p>
        </div>

        {/* Bottom pub vibe */}
        <div className="text-center mt-8 text-amber-400/40 text-xs tracking-widest uppercase">
          • Cloud9 Pub •
        </div>
      </div>
    </div>
  );
}

export default Login;