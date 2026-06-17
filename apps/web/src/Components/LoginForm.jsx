import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, X, Eye, EyeOff } from "lucide-react";

export default function LoginForm({
  title = "Login",
  subtitle = "Sign in to access the dashboard",
  onClose,
}) {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      const { accessToken, user } = res.data;

      //  store token + user (recommended)
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      setMsg(" Login successful");

      //  Role-based navigation
      if (user.role === "ADMIN") {
        navigate("/admin");
      } else if (user.role === "STUDENT") {
        navigate("/student");
      } else {
        setMsg(" Your account role is not supported");
      }
    } catch (err) {
      setMsg(err.response?.data?.message || " Invalid email or password");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full max-w-md rounded-2xl p-6 shadow-sm bg-white relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl"
        >
          <X size={18} />
        </button>
      )}

      <div className="text-center mb-8">
        <h2 className="text-3xl font-black text-slate-900">{title}</h2>
        <p className="mt-2 text-sm text-slate-500">{subtitle}</p>
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
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
              placeholder="user@gmail.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-semibold text-slate-700 mb-2">
            Password
          </label>

          <div className="flex items-center gap-3 rounded-xl border border-slate-300 px-4 py-3 focus-within:border-indigo-600 transition">

            <Lock size={18} className="text-slate-400" />

            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full outline-none text-sm text-slate-700"
              placeholder="••••••••"
              required
            />

            {/* SHOW / HIDE BUTTON */}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-slate-400 hover:text-indigo-600"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>

          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 transition-all active:scale-95 disabled:opacity-70"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>

      {msg && (
        <p className="mt-5 text-center text-sm font-semibold text-slate-600">
          {msg}
        </p>
      )}
    </div>
  );
}
