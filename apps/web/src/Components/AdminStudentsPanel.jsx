import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Toast from "../Components/Toast";
import { adminFetchStudents } from "../services/adminStudentsApi";

const GRADES = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];

// create students
const CREATE_STUDENT_API = "http://localhost:5000/api/students";

// admin routes
const ADMIN_STUDENTS_API = "http://localhost:5000/api/admin/students";

// ✅ helper: sort ST0601, ST0602... ST1001... correctly
function getStudentIdNumber(studentId = "") {
  const digits = String(studentId).replace(/\D/g, "");
  return digits ? Number(digits) : Number.MAX_SAFE_INTEGER;
}

export default function AdminStudentsPanel() {
  const navigate = useNavigate();

  const YEARS = useMemo(() => {
    const y = new Date().getFullYear();
    return ["", ...Array.from({ length: 6 }, (_, i) => String(y - i))];
  }, []);

  // ✅ Toast
  const [toast, setToast] = useState({ show: false, type: "success", message: "" });
  function showToast(type, message) {
    setToast({ show: true, type, message });
  }

  // Filters
  const [grade, setGrade] = useState(""); // "" = all grades
  const [year, setYear] = useState("");
  const [q, setQ] = useState("");

  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [students, setStudents] = useState([]);

  // Add modal
  const [openAdd, setOpenAdd] = useState(false);
  const [saving, setSaving] = useState(false);
  const [addErr, setAddErr] = useState("");

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    studentId: "",
    classId: "",
    phone: "",
    schoolName: "",
  });

  // Delete confirm modal
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [deleteErr, setDeleteErr] = useState("");

  // Attendance
  const today = new Date().toISOString().slice(0, 10);
  const [attDate, setAttDate] = useState(today);
  const [attBusyId, setAttBusyId] = useState("");

  function setField(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  // ✅ LOAD + SORT BY STUDENT ID
  async function load() {
    try {
      setErr("");
      setLoading(true);

      const list = await adminFetchStudents({ grade, year, q });

      const sorted = [...(list || [])].sort((a, b) => {
        const an = getStudentIdNumber(a.studentId);
        const bn = getStudentIdNumber(b.studentId);
        if (an !== bn) return an - bn;
        return String(a.studentId || "").localeCompare(String(b.studentId || ""));
      });

      setStudents(sorted);
    } catch {
      setErr("Failed to load students");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function openAddModal() {
    setAddErr("");
    setForm({
      fullName: "",
      email: "",
      password: "",
      studentId: "",
      classId: grade || "",
      phone: "",
      schoolName: "",
    });
    setOpenAdd(true);
  }

  async function createStudent(e) {
    e.preventDefault();
    setAddErr("");

    if (!form.fullName || !form.email || !form.password || !form.studentId || !form.classId) {
      setAddErr("Please fill all required fields.");
      return;
    }

    try {
      setSaving(true);
      const token = localStorage.getItem("accessToken");

      const payload = { ...form, grade: form.classId };

      await axios.post(CREATE_STUDENT_API, payload, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("success", `Student created: ${form.fullName} ✅`);
      await load();
      setTimeout(() => setOpenAdd(false), 500);
    } catch (e2) {
      const msg = e2?.response?.data?.message || "Failed to create student";
      setAddErr(msg);
      showToast("error", msg);
    } finally {
      setSaving(false);
    }
  }

  // ✅ Attendance (Toast)
  async function markAttendance(studentUserId, status, name) {
    if (!attDate) return showToast("warning", "Please select a date first.");

    try {
      setAttBusyId(studentUserId);

      const token = localStorage.getItem("accessToken");

      await axios.post(
        `${ADMIN_STUDENTS_API}/${studentUserId}/attendance`,
        { date: attDate, status },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      showToast("success", `${name} marked as ${status} ✅`);
    } catch (e) {
      showToast("error", e?.response?.data?.message || "Failed to save attendance");
    } finally {
      setAttBusyId("");
    }
  }

  function askDelete(student) {
    setDeleteErr("");
    setDeleteTarget(student);
    setOpenDelete(true);
  }

  async function confirmDelete() {
    if (!deleteTarget?._id) return;

    try {
      setDeleting(true);
      setDeleteErr("");
      const token = localStorage.getItem("accessToken");

      await axios.delete(`${ADMIN_STUDENTS_API}/${deleteTarget._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      showToast("success", `Deleted: ${deleteTarget.fullName} ✅`);
      setOpenDelete(false);
      setDeleteTarget(null);
      await load();
    } catch (e) {
      const msg = e?.response?.data?.message || "Failed to delete student";
      setDeleteErr(msg);
      showToast("error", msg);
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
      {/* ✅ Toast popup */}
      <Toast
        show={toast.show}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast((p) => ({ ...p, show: false }))}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-indigo-700">Students</h2>
          <p className="text-slate-600 font-semibold mt-1">Search and view student dashboards by grade.</p>
        </div>

        <button
          onClick={openAddModal}
          className="rounded-xl bg-slate-900 text-white px-5 py-3 text-sm font-black hover:bg-slate-800 active:scale-95 transition"
        >
          + Add Student
        </button>
      </div>

      {/* Attendance Bar */}
      <div className="mt-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <div className="text-sm font-black text-slate-800">Mark Attendance</div>
          <div className="text-xs font-semibold text-slate-600">Select one date, then mark each student as Present/Absent.</div>
        </div>

        <div className="flex gap-2 items-center">
          <label className="text-sm font-black text-slate-800">Date</label>
          <input type="date" className={inp()} value={attDate} onChange={(e) => setAttDate(e.target.value)} />
        </div>
      </div>

      {/* ✅ removed old attMsg text */}

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6 items-end">
        <div>
          <label className="text-sm font-black text-slate-800">Grade</label>
          <select className={sel()} value={grade} onChange={(e) => setGrade(e.target.value)}>
            <option value="">All Grades</option>
            {GRADES.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-black text-slate-800">Registered Year (optional)</label>
          <select className={sel()} value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">All years</option>
            {YEARS.filter(Boolean).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-black text-slate-800">Search</label>
          <input
            className={inp()}
            placeholder="Search by name / email / studentId"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>

        <button onClick={load} className={btnPrimary()}>
          {loading ? "Loading..." : "Search"}
        </button>
      </div>

      {/* Table */}
      <div className="mt-6 rounded-2xl overflow-hidden border border-slate-200">
        <div className="bg-indigo-600 text-white grid grid-cols-5 px-4 py-3 text-sm font-black">
          <div>STUDENT</div>
          <div>GRADE</div>
          <div>STUDENT ID</div>
          <div>ATTENDANCE</div>
          <div>ACTION</div>
        </div>

        <div className="bg-white">
          {err && <div className="p-6 text-center text-rose-600 font-black">{err}</div>}

          {!err && students.length === 0 && (
            <div className="p-6 text-center text-slate-500 font-bold">No students found.</div>
          )}

          {!err &&
            students.map((s) => (
              <div key={s._id} className="grid grid-cols-5 px-4 py-3 border-t text-sm items-center">
                <div className="font-black text-slate-900">{s.fullName}</div>
                <div className="font-bold text-slate-700">{s.classId || "-"}</div>
                <div className="font-semibold text-slate-700">{s.studentId || "-"}</div>

                <div className="flex gap-2">
                  <button
                    disabled={!attDate || attBusyId === s._id}
                    onClick={() => markAttendance(s._id, "PRESENT", s.fullName)}
                    className="rounded-xl bg-emerald-600 text-white px-3 py-2 text-xs font-black hover:bg-emerald-700 disabled:opacity-60"
                  >
                    {attBusyId === s._id ? "..." : "Present"}
                  </button>
                  <button
                    disabled={!attDate || attBusyId === s._id}
                    onClick={() => markAttendance(s._id, "ABSENT", s.fullName)}
                    className="rounded-xl bg-rose-600 text-white px-3 py-2 text-xs font-black hover:bg-rose-700 disabled:opacity-60"
                  >
                    {attBusyId === s._id ? "..." : "Absent"}
                  </button>
                </div>

                <div className="flex gap-2">
                  <button
                    className="bg-slate-900 text-white rounded-xl px-4 py-2 text-xs font-black hover:bg-slate-800"
                    onClick={() => navigate(`/admin/students/${s._id}`)}
                  >
                    View
                  </button>
                  <button
                    className="bg-rose-600 text-white rounded-xl px-4 py-2 text-xs font-black hover:bg-rose-700"
                    onClick={() => askDelete(s)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Add Student Modal */}
      {openAdd && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-lg rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Add Student</h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">Fill details and create a new student account.</p>
              </div>

              <button
                onClick={() => setOpenAdd(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 font-black hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={createStudent} className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-3">
              <Field label="Full Name *">
                <input className={inp()} value={form.fullName} onChange={(e) => setField("fullName", e.target.value)} />
              </Field>

              <Field label="Student ID *">
                <input className={inp()} value={form.studentId} onChange={(e) => setField("studentId", e.target.value)} />
              </Field>

              <Field label="Email *">
                <input className={inp()} value={form.email} onChange={(e) => setField("email", e.target.value)} />
              </Field>

              <Field label="Password *">
                <input
                  type="password"
                  className={inp()}
                  value={form.password}
                  onChange={(e) => setField("password", e.target.value)}
                />
              </Field>

              <Field label="Class *">
                <select className={sel()} value={form.classId} onChange={(e) => setField("classId", e.target.value)}>
                  <option value="">Select Grade</option>
                  {GRADES.map((g) => (
                    <option key={g} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
              </Field>

              <Field label="Phone (optional)">
                <input className={inp()} value={form.phone} onChange={(e) => setField("phone", e.target.value)} />
              </Field>

              <div className="md:col-span-2">
                <Field label="School Name (optional)">
                  <input className={inp()} value={form.schoolName} onChange={(e) => setField("schoolName", e.target.value)} />
                </Field>
              </div>

              <div className="md:col-span-2">
                <button
                  disabled={saving}
                  className="w-full rounded-xl bg-indigo-600 text-white py-3 font-black hover:bg-indigo-700 disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Create Student"}
                </button>
              </div>

              {addErr && <div className="md:col-span-2 text-rose-600 font-black text-sm">{addErr}</div>}
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {openDelete && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-xl p-6">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h3 className="text-xl font-black text-slate-900">Delete Student</h3>
                <p className="text-sm font-semibold text-slate-600 mt-1">This action cannot be undone.</p>
              </div>

              <button
                onClick={() => setOpenDelete(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 font-black hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-4">
              <div className="text-sm font-black text-rose-800">Warning</div>
              <div className="text-sm font-semibold text-rose-700 mt-1">
                Are you sure you want to delete <span className="font-black">{deleteTarget?.fullName}</span>?
              </div>
            </div>

            {deleteErr && <div className="mt-3 text-rose-600 font-black text-sm">{deleteErr}</div>}

            <div className="mt-5 flex gap-2">
              <button
                onClick={() => setOpenDelete(false)}
                className="w-full rounded-xl bg-slate-100 py-3 font-black hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                disabled={deleting}
                onClick={confirmDelete}
                className="w-full rounded-xl bg-rose-600 text-white py-3 font-black hover:bg-rose-700 disabled:opacity-70"
              >
                {deleting ? "Deleting..." : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="block">
      <div className="mb-2 text-sm font-black text-slate-800">{label}</div>
      {children}
    </label>
  );
}

function inp() {
  return "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 bg-white";
}
function sel() {
  return "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 bg-white";
}
function btnPrimary() {
  return "w-full rounded-xl bg-indigo-600 text-white px-4 py-3 text-sm font-black hover:bg-indigo-700";
}
