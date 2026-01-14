import { useState } from "react";
import axios from "axios";
import { Mail, Lock, X } from "lucide-react";

export default function LoginForm({
  title = "Admin Login",
  subtitle = "Sign in to access the dashboard",
  onClose,
  onSuccess,
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      setMsg("Login successful");

      if (onSuccess) onSuccess(res.data.accessToken, res);
    } catch (err) {
      setMsg("❌ Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-white relative top-">
      {/* Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-8 right-4 p-2 rounded-xl"
        >
          <X size={18} />
        </button>
      )}

      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-8">
        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Email Address
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-indigo-600 transition">
            <Mail size={18} className="text-slate-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full outline-none text-sm text-slate-700"
              placeholder="admin@cms.com"
              required
            />
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>
          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-indigo-600 transition">
            <Lock size={18} className="text-slate-400" />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-sm text-slate-700"
              placeholder="••••••••"
              required
            />
          </div>
        </div>

        {/* Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {/* Message */}
      {msg && (
        <p className="mt-6 text-center text-sm font-medium text-slate-600">
          {msg}
        </p>
      )}
    </div>
  );
}
