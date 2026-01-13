import { useState } from "react";
import axios from "axios";

export default function AddStudent() {
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    studentId: "",
  });
  const [msg, setMsg] = useState("");

  function update(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function submit(e) {
    e.preventDefault();
    setMsg("");
    try {
      const token = localStorage.getItem("accessToken");
      const res = await axios.post("http://localhost:5000/api/students", form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMsg(res.data.message);
      setForm({ fullName: "", email: "", password: "", studentId: "" });
    } catch {
      setMsg("Failed to create student");
    }
  }

  return (
    <div className="mx-auto max-w-lg">
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-2xl font-bold">Add Student</h2>
        <p className="mt-1 text-sm text-slate-600">Admin access only</p>

        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input label="Full Name" value={form.fullName} onChange={(v)=>update("fullName", v)} />
          <Input label="Email" value={form.email} onChange={(v)=>update("email", v)} />
          <Input label="Temporary Password" type="password" value={form.password} onChange={(v)=>update("password", v)} />
          <Input label="Student ID" value={form.studentId} onChange={(v)=>update("studentId", v)} />

          <button className="w-full rounded-lg bg-indigo-600 py-3 font-semibold text-white hover:bg-indigo-500">
            Create Student
          </button>
        </form>

        {msg && <p className="mt-4 text-sm text-slate-600">{msg}</p>}
      </div>
    </div>
  );
}

function Input({ label, value, onChange, type = "text" }) {
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
