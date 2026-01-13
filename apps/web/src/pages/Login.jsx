import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("admin@cms.com");
  const [password, setPassword] = useState("Admin1234");
  const [msg, setMsg] = useState("");

  async function handleLogin(e) {
    e.preventDefault();
    setMsg("");
    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });
      localStorage.setItem("accessToken", res.data.accessToken);
      setMsg("Login successful");
    } catch (err) {
      setMsg("Invalid email or password");
    }
  }

  return (
    <div className="mx-auto max-w-md">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Login</h2>
        <p className="mt-1 text-sm text-slate-600">
          Sign in as administrator
        </p>

        <form onSubmit={handleLogin} className="mt-6 space-y-4">
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Password" type="password" value={password} onChange={setPassword} />

          <button className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
            Login
          </button>
        </form>

        {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-medium text-slate-700">{label}</div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm outline-none focus:border-indigo-500"
      />
    </label>
  );
}
