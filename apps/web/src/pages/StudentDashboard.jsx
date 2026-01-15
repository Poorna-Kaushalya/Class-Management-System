// client/src/pages/StudentDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import logo from "../assets/Landing_Logo_icon.png";
import AttendanceCalendar from "../Components/AttendanceCalendar";
import AlgeonLoader from "../Components/AlgeonLoader";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export default function StudentDashboard() {
  const API = "http://localhost:5000";

  const [user, setUser] = useState(null);

  // loaders
  const [pageLoading, setPageLoading] = useState(true);
  const [monthLoading, setMonthLoading] = useState(false);

  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  // Edit modal
  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolName, setSchoolName] = useState("");

  // Calendar state
  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth()); // 0-11

  // Data needed by calendar
  const [timetableDays, setTimetableDays] = useState({});
  const [attendanceMap, setAttendanceMap] = useState({});

  // Fees (Jan–Dec) for year
  const [feeYearRecords, setFeeYearRecords] = useState([]); // array of 12

  const marks = useMemo(
    () => [
      { exam: "Unit Test 01", score: 78, max: 100, date: "2025-11-20", status: "Good" },
      { exam: "Unit Test 02", score: 84, max: 100, date: "2025-12-18", status: "Excellent" },
      { exam: "Model Paper 01", score: 72, max: 100, date: "2026-01-05", status: "Good" },
    ],
    []
  );

  function monthKey(y, m) {
    return `${y}-${String(m + 1).padStart(2, "0")}`; // "YYYY-MM"
  }

  async function fetchAttendanceForMonth(y, m) {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const mKey = monthKey(y, m);
    const res = await axios.get(`${API}/api/attendance/me?month=${mKey}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const records = res.data?.records || [];
    const map = {};
    records.forEach((r) => {
      map[r.date] = r.status;
    });
    setAttendanceMap(map);
  }

  async function fetchTimetableDays() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await axios.get(`${API}/api/timetable/my-class`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const tt = res.data?.timetable || res.data || [];
    const daysObj = {};
    (tt || []).forEach((row) => {
      if (row.day) daysObj[row.day] = true;
    });
    setTimetableDays(daysObj);
  }

  //  get full year Jan–Dec
  async function fetchFeesForYear(y) {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await axios.get(
      `${API}/api/fees/me?year=${y}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    setFeeYearRecords(res.data?.records || []);
  }

  // First load
  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      setErr("No access token found. Please login again.");
      setPageLoading(false);
      return;
    }

    (async () => {
      try {
        setErr("");
        setPageLoading(true);

        const res = await axios.get(`${API}/api/students/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const u = res.data?.user;
        setUser(u);
        setFullName(u?.fullName || "");
        setPhone(u?.phone || "");
        setSchoolName(u?.schoolName || "");

        await fetchTimetableDays();

        await Promise.all([
          fetchAttendanceForMonth(calYear, calMonth),
          fetchFeesForYear(calYear),
        ]);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load dashboard");
      } finally {
        setPageLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if (!user) return;

    (async () => {
      try {
        setMonthLoading(true);
        await fetchAttendanceForMonth(calYear, calMonth);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load month data");
      } finally {
        setMonthLoading(false);
      }
    })();
  }, [calYear, calMonth, user]);

  // When year changes: refetch fees for year
  useEffect(() => {
    if (!user) return;
    fetchFeesForYear(calYear);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calYear, user]);

  async function handleSaveProfile() {
    setMsg("");
    setErr("");

    const token = localStorage.getItem("accessToken");
    if (!token) return setErr("No access token found. Please login again.");

    if (phone && !/^07\d{8}$/.test(phone)) {
      return setErr("Enter a valid phone number (ex: 07XXXXXXXX).");
    }

    try {
      const res = await axios.put(
        `${API}/api/students/me`,
        { fullName, phone, schoolName },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updated = res.data?.user;
      setUser(updated);

      setFullName(updated?.fullName || "");
      setPhone(updated?.phone || "");
      setSchoolName(updated?.schoolName || "");

      setMsg("✅ Profile updated successfully");
      setEditOpen(false);
    } catch (e) {
      setErr(e.response?.data?.message || "Update failed");
    }
  }

  function handleLogout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    sessionStorage.clear();
    window.location.replace("/");
  }

  function prevMonth() {
    setCalMonth((m) => {
      if (m === 0) {
        setCalYear((y) => y - 1);
        return 11;
      }
      return m - 1;
    });
  }

  function fmtDate(iso) {
    if (!iso) return "—";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return "—";
    return d.toISOString().slice(0, 10);
  }

  function nextMonth() {
    setCalMonth((m) => {
      if (m === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  if (pageLoading) return <AlgeonLoader />;

  if (err && !user) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="max-w-lg w-full rounded-2xl bg-white border border-slate-200 p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-900">Unable to load</h2>
          <p className="mt-2 text-sm text-rose-600 font-semibold">{err}</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 active:scale-95 transition"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  function monthLabel(monthStr) {
    if (!monthStr || !monthStr.includes("-")) return monthStr;

    const [, mm] = monthStr.split("-");
    const idx = Number(mm) - 1;
    return MONTH_NAMES[idx] || monthStr;
  }


  const selectedMonthKey = monthKey(calYear, calMonth);
  const selectedFee = feeYearRecords.find((r) => r.month === selectedMonthKey) || null;

  return (
    <div className="max-w-8xl bg-slate-50 min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-8xl px-4 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-16 w-auto select-none pointer-events-none" />
            <div className="text-left">
              <p className="font-black text-slate-900 leading-tight text-xl">
                |&nbsp;&nbsp;Student Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right">
              <p className="text-sm font-extrabold text-slate-900">{user.fullName}</p>
              <span className="hidden md:inline-flex rounded-full bg-indigo-50 text-indigo-700 px-3 py-1 text-xs font-bold">
                {user.role}
              </span>
            </div>

            <button
              onClick={handleLogout}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-bold hover:bg-slate-800 active:scale-95 transition"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Status */}
      <div className="mx-auto max-w-7xl px-4 pt-4">
        {msg && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 font-semibold">
            {msg}
          </div>
        )}
        {err && (
          <div className="mt-3 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 font-semibold">
            {err}
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="mx-auto max-w-8xl px-4 py-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <aside className="lg:col-span-3 space-y-6">
            <Card>
              <div className="flex items-center gap-2">
                <Avatar initials={getInitials(user.fullName)} />
                <div>
                  <p className="text-sm text-slate-500">Student</p>
                  <p className="font-extrabold text-slate-900">{user.fullName}</p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                <InfoRow label="Student ID" value={user.studentId || "-"} />
                <InfoRow label="Class ID" value={user.classId || "Not Assigned"} />
                <InfoRow label="School" value={user.schoolName || "Not Set"} />
                <InfoRow label="Phone" value={user.phone || "Not Set"} />
                <InfoRow label="Email" value={user.email} />
                <InfoRow label="Joined Date" value={formatDate(user.createdAt)} />
              </div>

              <button
                onClick={() => {
                  setFullName(user.fullName || "");
                  setPhone(user.phone || "");
                  setSchoolName(user.schoolName || "");
                  setEditOpen(true);
                }}
                className="mt-5 w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 active:scale-95 transition"
              >
                Edit Profile
              </button>

              <p className="mt-3 text-xs text-slate-500">
                You can edit your <b>Name</b>, <b>Phone</b>, and <b>School</b> only.
              </p>
            </Card>
          </aside>

          {/* CENTER */}
          <main className="lg:col-span-6 space-y-6">
            {monthLoading && (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                Loading month data...
              </div>
            )}

            <AttendanceCalendar
              year={calYear}
              month={calMonth}
              timetableDays={timetableDays}
              attendanceMap={attendanceMap}
              onPrev={prevMonth}
              onNext={nextMonth}
            />

            <Card>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-black text-slate-900">Marks & Performance</h2>
                  <p className="text-sm text-slate-500">Recent exams and results</p>
                </div>
                <button className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-bold hover:bg-indigo-700 active:scale-95 transition">
                  View All
                </button>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-3 pr-4 font-semibold">Exam</th>
                      <th className="py-3 pr-4 font-semibold">Score</th>
                      <th className="py-3 pr-4 font-semibold">Date</th>
                      <th className="py-3 pr-4 font-semibold">Status</th>
                    </tr>
                  </thead>

                  <tbody>
                    {marks.map((m, idx) => (
                      <tr key={idx} className="border-b last:border-b-0">
                        <td className="py-3 pr-4 font-bold text-slate-900">{m.exam}</td>
                        <td className="py-3 pr-4">
                          <span className="font-extrabold text-slate-900">{m.score}</span>
                          <span className="text-slate-500"> / {m.max}</span>
                        </td>
                        <td className="py-3 pr-4 text-slate-600">{m.date}</td>
                        <td className="py-3 pr-4">
                          <StatusPill status={m.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </main>

          {/* RIGHT */}
          <aside className="lg:col-span-3 space-y-6">
            <Card>
              <div className="flex items-center justify-between">
                <h3 className="font-extrabold text-slate-900">Class Fees </h3>
                <span className="text-xs font-bold text-slate-500">{calYear}</span>
              </div>

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-2 pr-1 font-semibold">Month</th>
                      <th className="py-2 pr-1 font-semibold">Status</th>
                      <th className="py-2 pr-1 font-semibold">Paid Date</th>
                    </tr>
                  </thead>

                  <tbody>
                    {feeYearRecords.map((r) => (
                      <tr key={r.month} className="border-b last:border-b-0">
                        <td className="py-0 pr-2 font-bold text-slate-900">
                          {monthLabel(r.month)}
                        </td>


                        <td className="py-0 pr-1">
                          <span
                            className={`inline-flex rounded-full px-2 py-0 text-xs font-extrabold ${r.status === "PAID"
                              ? "bg-emerald-50 text-emerald-700"
                              : r.status === "PENDING"
                                ? "bg-amber-50 text-amber-800"
                                : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="py-2 pr-1 font-semibold text-slate-700">
                          {r.paidDate ? r.paidDate : "—"}
                        </td>

                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </aside>

        </div>
      </div>

      {/* Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Profile</h3>
                <p className="text-sm text-slate-500 mt-1">You can update your Name, Phone, and School.</p>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 font-bold hover:bg-slate-200 transition"
              >
                ✕
              </button>
            </div>

            <div className="mt-5">
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Name</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600"
                placeholder="Enter your name"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">Phone Number</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600"
                placeholder="07XXXXXXXX"
              />
              <p className="mt-1 text-xs text-slate-500">Example: 07XXXXXXXX</p>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-bold text-slate-700 mb-2">School Name</label>
              <input
                value={schoolName}
                onChange={(e) => setSchoolName(e.target.value)}
                className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-indigo-600"
                placeholder="Enter your school name"
              />
            </div>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setEditOpen(false)}
                className="w-full rounded-xl bg-slate-100 py-3 font-bold text-slate-800 hover:bg-slate-200 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="w-full rounded-xl bg-indigo-600 py-3 font-bold text-white hover:bg-indigo-700 active:scale-95 transition"
              >
                Save
              </button>
            </div>

            <p className="mt-4 text-xs text-slate-500">
              Student cannot delete the account. Only Admin controls deletion.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

/* UI Helpers */

function Card({ children }) {
  return <div className="rounded-3xl bg-white border border-slate-200 p-5 shadow-sm">{children}</div>;
}

function Avatar({ initials }) {
  return (
    <div className="h-12 w-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
      {initials}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-xs font-bold text-slate-500">{label}</span>
      <span className="text-sm font-extrabold text-slate-900 text-right break-all">{value}</span>
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    Excellent: "bg-emerald-50 text-emerald-700",
    Good: "bg-indigo-50 text-indigo-700",
    Average: "bg-amber-50 text-amber-800",
    Weak: "bg-rose-50 text-rose-700",
  };
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${map[status] || "bg-slate-100 text-slate-700"}`}>
      {status}
    </span>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0]?.[0] || "S";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

function formatDate(iso) {
  if (!iso) return "-";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}
