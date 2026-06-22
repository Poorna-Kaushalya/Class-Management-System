import { useEffect, useState } from "react";
import Select from "react-select";
import toast from "react-hot-toast";
import {
  getTeachers,
  deleteTeacher,
  createTeacher,
  updateTeacher,
} from "../services/teacherApi";

const GRADES = [
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "A/L",
];

export default function AdminTeachersPanel() {
  const [teachers, setTeachers] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [search, setSearch] = useState("");
  const [editId, setEditId] = useState(null);

  const [form, setForm] = useState({
    name: "",
    teacherId: "",
    email: "",
    password: "",
    phone: "",
    roles: ["TEACHER"],
    address: { no: "", street: "", lane: "", city: "" },
    subjects: [],
    grades: [],
  });

  /* ================= LOAD ================= */
  async function load() {
    try {
      const [tRes, sRes] = await Promise.all([
        getTeachers(),
        fetch("http://localhost:5000/api/subjects").then((r) => r.json()),
      ]);

      setTeachers(tRes.data.teachers || []);

      setSubjects(
        (sRes || []).map((s) => ({
          value: s._id,
          label: s.name,
        }))
      );
    } catch {
      toast.error("Failed to load data");
    }
  }

  useEffect(() => {
    load();
  }, []);

  /* ================= RESET ================= */
  function resetForm() {
    setForm({
      name: "",
      teacherId: "",
      email: "",
      password: "",
      phone: "",
      roles: ["TEACHER"],
      address: { no: "", street: "", lane: "", city: "" },
      subjects: [],
      grades: [],
    });
    setEditId(null);
  }

  /* ================= EDIT ================= */
  function handleEdit(t) {
    setForm({
      name: t.name || "",
      teacherId: t.teacherId || "",
      email: t.email || "",
      password: "",
      phone: t.phone || "",
      roles: t.roles || ["TEACHER"],
      address: t.address || { no: "", street: "", lane: "", city: "" },
      subjects: t.subjects?.map((s) => (typeof s === "object" ? s._id : s)) || [],
      grades: t.grades || [],
    });

    setEditId(t._id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  /* ================= TOGGLES ================= */
  function toggleGrade(g) {
    setForm((p) => ({
      ...p,
      grades: p.grades.includes(g)
        ? p.grades.filter((x) => x !== g)
        : [...p.grades, g],
    }));
  }

  function toggleRole(r) {
    setForm((p) => ({
      ...p,
      roles: p.roles.includes(r)
        ? p.roles.filter((x) => x !== r)
        : [...p.roles, r],
    }));
  }

  /* ================= SAVE ================= */
  async function handleSave() {
    try {
      // ✅ VALIDATION
      if (!form.name || !form.teacherId || !form.email) {
        toast.error("Name, Teacher ID, Email are required");
        return;
      }

      const basePayload = {
        name: form.name,
        teacherId: form.teacherId,
        email: form.email,
        phone: form.phone,
        roles: form.roles,
        address: form.address,
        subjects: form.subjects,
        grades: form.grades,
      };

      // CREATE
      if (!editId) {
        if (!form.password) {
          toast.error("Password is required");
          return;
        }

        await createTeacher({
          ...basePayload,
          password: form.password,
        });

        toast.success("Teacher created");
      }

      // UPDATE
      else {
        const payload = { ...basePayload };

        // only send password if user typed it
        if (form.password.trim()) {
          payload.password = form.password;
        }

        await updateTeacher(editId, payload);
        toast.success("Teacher updated");
      }

      resetForm();
      load();

    } catch (err) {
      toast.error(err.response?.data?.message || "Save failed");
    }
  }

  /* ================= DELETE ================= */
  function handleDelete(id) {
    toast((t) => (
      <div className="flex flex-col gap-2">
        <p>Delete this teacher?</p>

        <div className="flex gap-2">
          <button
            className="bg-red-500 text-white px-2 py-1 rounded"
            onClick={async () => {
              toast.dismiss(t.id);
              await deleteTeacher(id);
              toast.success("Deleted");
              load();
            }}
          >
            Delete
          </button>

          <button
            className="bg-gray-300 px-2 py-1 rounded"
            onClick={() => toast.dismiss(t.id)}
          >
            Cancel
          </button>
        </div>
      </div>
    ));
  }

  /* ================= SEARCH + SORT ================= */
  const filtered = teachers
    .filter((t) =>
      `${t.name} ${t.email} ${t.phone} ${t.teacherId}`
        .toLowerCase()
        .includes(search.toLowerCase())
    )
    .sort((a, b) =>
      (a.teacherId || "").localeCompare(b.teacherId || "", undefined, {
        numeric: true,
      })
    );

  return (
    <div className="p-4 bg-slate-50 min-h-screen">
      <h2 className="text-2xl font-black mb-2">
        Manage <span className="text-indigo-600">Teachers</span>
      </h2>

      {/* ================= FORM ================= */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">

        {/* ROW 1: USER DETAILS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 px-1">Name</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="Mr. / Mrs. / Miss"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 px-1">Teacher ID</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="T00X"
              value={form.teacherId}
              onChange={(e) => setForm({ ...form, teacherId: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 px-1">Email Address</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="user@gmail.com"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-gray-500 px-1">Phone Number</label>
            <input
              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
              placeholder="07X XXXX XXX"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>

          {/* Password only appears on Create - Spans full width on mobile, nicely aligns on desktop */}
          {!editId && (
            <div className="flex flex-col gap-1">
              <label className="text-xs font-medium text-gray-500 px-1">Password</label>
              <input
                className="w-full lg:w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-sm"
                type="password"
                placeholder="••••••••"
                onChange={(e) => setForm({ ...form, password: e.target.value })}
              />
            </div>
          )}
        </div>

        {/* ROW 2: ASSIGNMENTS & ROLES */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          {/* ROLES */}
          <div className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
            <p className="text-sm font-semibold text-gray-700 mb-2">
              System Roles
            </p>

            <div className="flex flex-row gap-8 flex-wrap">
              {["ADMIN", "TEACHER"].map((r) => (
                <label
                  key={r}
                  className="flex items-center gap-2 cursor-pointer text-sm font-medium text-gray-600 hover:text-gray-900 select-none"
                >
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500/30 accent-blue-600"
                    checked={form.roles.includes(r)}
                    onChange={() => toggleRole(r)}
                  />
                  <span className="px-3 py-1 rounded-full bg-white border text-xs font-semibold shadow-sm">
                    {r}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* SUBJECTS */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Assigned Subjects</p>
            <Select
              isMulti
              options={subjects}
              value={subjects.filter((s) => form.subjects.includes(s.value))}
              onChange={(val) => setForm({ ...form, subjects: val.map((v) => v.value) })}
              className="text-sm"
              theme={(theme) => ({
                ...theme,
                borderRadius: 4,
                colors: {
                  ...theme.colors,
                  primary: '#2563eb',
                },
              })}
            />
          </div>

          {/* GRADES */}
          <div>
            <p className="text-sm font-semibold text-gray-700 mb-2">Assigned Grades</p>
            <div className="grid grid-cols-4 gap-2">
              {GRADES.map((g) => {
                const isSelected = form.grades.includes(g);
                return (
                  <button
                    key={g}
                    type="button"
                    onClick={() => toggleGrade(g)}
                    className={`px-2 py-1 border rounded-lg text-xs font-medium transition-all text-center ${isSelected
                      ? "bg-blue-600 border-blue-600 text-white shadow-sm shadow-blue-500/20"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                      }`}
                  >
                    {g}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 mt-8 pt-4 border-t border-gray-100">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
          >
            Clear Form
          </button>

          <button
            onClick={handleSave}
            className="px-5 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 rounded-lg shadow-sm shadow-blue-500/10 transition-colors"
          >
            {editId ? 'Update Teacher' : 'Save Teacher'}
          </button>
        </div>
      </div>

      {/* ================= SEARCH ================= */}
      <div className="flex justify-between mb-3">
        <h2 className="text-xl font-bold">Teachers List</h2>

        <input
          className="border p-2 rounded w-64 h-8"
          placeholder="Search..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
      <div className="bg-white rounded-xl shadow overflow-x-auto">

        <table className="w-full text-xs">
          <thead className="bg-slate-800 text-white">
            <tr>
              <th className="p-2">Teacher</th>
              <th>Email</th>
              <th>ID</th>
              <th>Phone</th>
              <th>Roles</th>
              <th>Subjects</th>
              <th>Grades</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {filtered.map((t) => (
              <tr key={t._id} className="border-b">

                <td className="p-2 font-bold">{t.name}</td>
                <td>{t.email}</td>
                <td>{t.teacherId}</td>
                <td>{t.phone}</td>
                <td>{t.roles?.join(", ")}</td>
                <td>{t.subjects?.map(s => s.name || s).join(", ")}</td>
                <td>{t.grades?.join(", ")}</td>

                <td className="flex gap-2 p-2">
                  <button
                    onClick={() => handleEdit(t)}
                    className="bg-yellow-400 px-2 py-1 rounded"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(t._id)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    Delete
                  </button>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

      <style>{`
        .input {
          border: 1px solid #ddd;
          padding: 8px;
          border-radius: 8px;
          outline: none;
        }
      `}</style>

    </div>
  );
}