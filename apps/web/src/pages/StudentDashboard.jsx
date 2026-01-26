// client/src/pages/StudentDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import logo from "../Assets/Landing_Logo_icon.png";
import AttendanceCalendar from "../Components/AttendanceCalendar";
import AlgeonLoader from "../Components/AlgeonLoader";
import MarksMiniChart from "../Components/MarksMiniChart";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function StudentDashboard() {
  const API = "http://localhost:5000";

  const [user, setUser] = useState(null);

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
  const [calMonth, setCalMonth] = useState(new Date().getMonth());

  // Timetable + attendance
  const [timetableDays, setTimetableDays] = useState({});
  const [timetableInfo, setTimetableInfo] = useState({});
  const [attendanceMap, setAttendanceMap] = useState({});

  // Fees
  const [feeYearRecords, setFeeYearRecords] = useState([]);

  // Notices
  const [notices, setNotices] = useState([]);

  // Marks
  const [marks, setMarks] = useState([]);

  function monthKey(y, m) {
    return `${y}-${String(m + 1).padStart(2, "0")}`; // YYYY-MM
  }

  function monthLabel(monthStr) {
    if (!monthStr || !monthStr.includes("-")) return monthStr;
    const [, mm] = monthStr.split("-");
    const idx = Number(mm) - 1;
    return MONTH_NAMES[idx] || monthStr;
  }

  function ymd(dateObj) {
    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
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
    records.forEach((r) => (map[r.date] = r.status));
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
    const infoObj = {};

    (tt || []).forEach((row) => {
      if (row.day) {
        daysObj[row.day] = true;
        infoObj[row.day] = { time: row.time || "", classType: row.classType || "" };
      }
    });

    setTimetableDays(daysObj);
    setTimetableInfo(infoObj);
  }

  async function fetchFeesForYear(y) {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await axios.get(`${API}/api/fees/me?year=${y}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setFeeYearRecords(res.data?.records || []);
  }

  async function fetchMyNotices() {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await axios.get(`${API}/api/notices/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setNotices(res.data?.notices || []);
  }

  async function fetchMyMarksForYear(y) {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    const res = await axios.get(`${API}/api/marks/me?year=${y}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setMarks(res.data?.marks || []);
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
          fetchMyNotices(),
          fetchMyMarksForYear(calYear),
        ]);
      } catch (e) {
        setErr(e.response?.data?.message || "Failed to load dashboard");
      } finally {
        setPageLoading(false);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Month change -> attendance only
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [calYear, calMonth, user]);

  // Year change -> fees + marks
  useEffect(() => {
    if (!user) return;
    fetchFeesForYear(calYear);
    fetchMyMarksForYear(calYear);
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

      setMsg("Profile updated successfully");
      setEditOpen(false);
    } catch (e) {
      setErr(e.response?.data?.message || "Update failed");
    }
  }

  // auto hide success message after 5s
  useEffect(() => {
    if (!msg) return;

    const t = setTimeout(() => setMsg(""), 5000);
    return () => clearTimeout(t);
  }, [msg]);

  useEffect(() => {
    if (!err) return;

    const t = setTimeout(() => setErr(""), 5000);
    return () => clearTimeout(t);
  }, [err]);


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

  function nextMonth() {
    setCalMonth((m) => {
      if (m === 11) {
        setCalYear((y) => y + 1);
        return 0;
      }
      return m + 1;
    });
  }

  function formatDate(iso) {
    if (!iso) return "-";
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toISOString().slice(0, 10);
  }

  const todaySummary = useMemo(() => {
    const now = new Date();
    const todayKey = ymd(now);
    const weekdayName = now.toLocaleDateString("en-US", { weekday: "long" });

    const classTodayBool = !!timetableDays[weekdayName];
    const time = timetableInfo[weekdayName]?.time || "";
    const classTodayText = classTodayBool ? (time || "Class") : "No Class";

    const todayRecorded = attendanceMap[todayKey];
    const attendanceStatus = classTodayBool ? (todayRecorded || "PENDING") : "—";

    const y = calYear;
    const m = calMonth;
    const daysInMonth = new Date(y, m + 1, 0).getDate();

    let have = 0;
    let present = 0;

    for (let d = 1; d <= daysInMonth; d++) {
      const dt = new Date(y, m, d);
      const key = ymd(dt);
      const dayName = dt.toLocaleDateString("en-US", { weekday: "long" });

      const isTimetableDay = !!timetableDays[dayName];
      const recorded = attendanceMap[key];

      const isClassDay = isTimetableDay || !!recorded;
      if (isClassDay) have += 1;
      if (recorded === "PRESENT") present += 1;
    }

    const absent = Math.max(0, have - present);

    return {
      weekdayName,
      classTodayText,
      attendanceStatus,
      have,
      present,
      absent,
    };
  }, [attendanceMap, timetableDays, timetableInfo, calYear, calMonth]);

  const marksChartData = useMemo(() => {
    const byMonth = {};
    (marks || []).forEach((m) => {
      const mk = m.month;
      const perc = m.maxMarks ? (Number(m.marks) / Number(m.maxMarks)) * 100 : null;
      if (!mk || !Number.isFinite(perc)) return;
      byMonth[mk] = byMonth[mk] || [];
      byMonth[mk].push(perc);
    });

    return MONTH_SHORT.map((label, idx) => {
      const mk = `${calYear}-${String(idx + 1).padStart(2, "0")}`;
      const arr = byMonth[mk] || [];
      if (!arr.length) return { label, value: null };
      const avg = arr.reduce((a, b) => a + b, 0) / arr.length;
      return { label, value: Math.round(avg) };
    });
  }, [marks, calYear]);

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

  return (
    <div className="max-w-8xl bg-slate-50 min-h-screen">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="mx-auto max-w-8xl px-4 py-0 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={logo} alt="Logo" className="h-16 w-auto select-none pointer-events-none" />
            <div className="text-left">
              <p className="font-black text-slate-900 leading-tight text-xl">
                |&nbsp;&nbsp;Student Portal
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:block text-right-sm">
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
      <div className="mx-auto max-w-8xl px-4 -mt-2">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <aside className="lg:col-span-2 space-y-2">
            <Card accent="indigo">
              <div className="flex items-center gap-2">
                <Avatar initials={getInitials(user.fullName)} />
                <div>
                  <p className="text-sm text-slate-500">Student</p>
                  <p className="font-extrabold text-slate-900">{user.fullName}</p>
                </div>
              </div>

              <div className="mt-4 space-y-2">
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
                className="mt-4 w-full rounded-lg bg-indigo-600 text-sm py-2 text-white font-black hover:bg-indigo-700 active:scale-95 transition"
              >
                Edit Profile
              </button>
            </Card>

            {/* Special Links */}
            <Card accent="slate">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center">
                    <IconLink />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-slate-900 leading-tight">Quick access</h3>
                  </div>
                </div>
              </div>

              <div className="mt-2 space-y-2">
                <LinkCard title="LMS" desc="Study materials" />
                <LinkCard title="Past Papers" desc="Access  past papers" />
                <LinkCard title="WhatsApp Group" desc="Important updates" />
              </div>
            </Card>
          </aside>

          {/* CENTER */}
          <main className="lg:col-span-7 space-y-4">
            {/* NOTICES */}
            <Card accent="red">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center">
                    <IconBell />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-slate-900 leading-tight">Notices</h2>
                  </div>
                </div>

                <span className="text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                  {user.classId || "Grade"}
                </span>
              </div>

              {notices.length === 0 ? (
                <div className="mt-1 border border-slate-200 bg-slate-50 p-3 rounded-xl">
                  <p className="text-sm font-black text-slate-700">No notices right now.</p>
                  <p className="mt-1 text-xs font-semibold text-slate-500">
                    Admin will post important updates for your grade here.
                  </p>
                </div>
              ) : (
                <div className="mt-2 space-y-1">
                  {notices.slice(0, 6).map((n) => (
                    <div
                      key={n._id}
                      className="relative bg-white p-3 border border-slate-200 rounded-xl overflow-hidden hover:bg-slate-50 transition"
                    >
                      <div className="absolute left-0 top-0 h-full w-1 bg-rose-300" />

                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <p className="text-sm font-black text-slate-900 truncate">{n.title} </p>
                          <p className="mt-1 text-[11px] font-bold text-slate-500">
                            {new Date(n.createdAt).toISOString().slice(0, 10)} • {n.grade}
                          </p>
                        </div>
                        <span className="inline-flex rounded-full bg-orange-100 text-rose-700 px-3 py-1 text-xs font-extrabold">
                          NOTICE
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>

            {monthLoading && (
              <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700">
                Loading month data...
              </div>
            )}

            {/* Calendar row split 3:2 */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-2">
              <div className="lg:col-span-3">
                <AttendanceCalendar
                  year={calYear}
                  month={calMonth}
                  timetableDays={timetableDays}
                  attendanceMap={attendanceMap}
                  onPrev={prevMonth}
                  onNext={nextMonth}
                />
              </div>

              <div className="lg:col-span-2 space-y-2 relative -mt-2">
                {/* Today’s Summary */}
                <Card accent="indigo">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center">
                        <IconSpark />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">Monthly Summary</h3>
                      </div>
                    </div>

                    <span className="text-xs font-bold text-slate-500">{todaySummary.weekdayName}</span>
                  </div>

                  <div className="mt-3 space-y-2">
                    <Row label="Class Today" value={todaySummary.classTodayText} />

                    <div className="flex items-center justify-between">
                      <span className="text-sm font-bold text-slate-500">Attendance Status</span>
                      <StatusBadge status={todaySummary.attendanceStatus} />
                    </div>

                    <div className="mt-3 grid grid-cols-3 gap-2">
                      <StatBox label="Have" value={todaySummary.have} />
                      <StatBox label="Present" value={todaySummary.present} />
                      <StatBox label="Absent" value={todaySummary.absent} />
                    </div>
                  </div>
                </Card>

                {/* Marks */}
                <Card accent="emerald">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-9 w-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                        <IconChart />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 leading-tight">Marks</h3>
                      </div>
                    </div>

                    <span className="text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                      {calYear}
                    </span>
                  </div>

                  <div className="mt-2">
                    <MarksMiniChart data={marksChartData} height={120} />
                  </div>
                </Card>
              </div>
            </div>
          </main>

          {/* RIGHT */}
          <aside className="lg:col-span-3 space-y-4">
            <Card accent="amber">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="h-9 w-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                    <IconCalendar />
                  </div>
                  <div>
                    <h3 className="font-black text-lg text-slate-900 leading-tight">Class Fees</h3>
                    <p className="text-xs font-bold text-slate-500">Payment status</p>
                  </div>
                </div>

                <span className="text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                  {calYear}
                </span>
              </div>

              <div className="mt-3 overflow-x-auto">
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
                      <tr key={r.month} className="border-b last:border-b-0 border-gray-300">
                        <td className="py-1.5 pr-2 font-black text-slate-900">
                          {monthLabel(r.month)}
                        </td>

                        <td className="py-1.5 pr-1">
                          <span
                            className={`inline-flex rounded-full px-2 py-0.5 text-xs font-extrabold ${r.status === "PAID"
                                ? "bg-emerald-50 text-emerald-700"
                                : r.status === "PENDING"
                                  ? "bg-amber-50 text-amber-800"
                                  : "bg-slate-100 text-slate-600"
                              }`}
                          >
                            {r.status}
                          </span>
                        </td>

                        <td className="py-1.5 pr-1 font-semibold text-slate-700">
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
                <p className="text-sm text-slate-500 mt-1">
                  You can update your Name, Phone, and School.
                </p>
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

/* =========================
   UI Helpers
   ========================= */

function Card({ children, accent = "indigo" }) {
  const accentMap = {
    indigo: "border-t-indigo-500",
    red: "border-t-rose-400",
    amber: "border-t-amber-400",
    emerald: "border-t-emerald-500",
    slate: "border-t-slate-300",
  };

  return (
    <div
      className={`
        rounded-2xl bg-white border border-slate-200 shadow-sm
        border-t-4 ${accentMap[accent] || accentMap.indigo}
        hover:shadow-md transition
        p-4
      `}
    >
      {children}
    </div>
  );
}

function Avatar({ initials }) {
  return (
    <div className="h-10 w-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-black">
      {initials}
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="text-sm font-extrabold text-slate-900 text-right break-all">{value}</span>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm font-bold text-slate-500">{label}</span>
      <span className="text-sm font-extrabold text-slate-900">{value}</span>
    </div>
  );
}

function StatBox({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-center">
      <p className="text-xs font-bold text-slate-500">{label}</p>
      <p className="text-lg font-black text-slate-900">{value}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    PRESENT: "bg-emerald-50 text-emerald-700",
    ABSENT: "bg-rose-50 text-rose-700",
    LATE: "bg-amber-50 text-amber-800",
    EXCUSED: "bg-sky-50 text-sky-700",
    PENDING: "bg-slate-100 text-slate-700",
    "—": "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-extrabold ${map[status] || "bg-slate-100 text-slate-700"
        }`}
    >
      {status}
    </span>
  );
}

function LinkCard({ title, desc }) {
  return (
    <div className="group rounded-xl border border-slate-200 bg-white p-3 hover:shadow-sm transition cursor-pointer">
      <div className="flex items-start gap-3">
        <div className="h-9 w-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-700 transition">
          <IconLink />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-black text-slate-900">{title}</p>
          <p className="text-xs font-semibold text-slate-500 mt-1">{desc}</p>
        </div>
      </div>
    </div>
  );
}

function getInitials(name = "") {
  const parts = name.trim().split(" ").filter(Boolean);
  const first = parts[0]?.[0] || "S";
  const last = parts.length > 1 ? parts[parts.length - 1][0] : "";
  return (first + last).toUpperCase();
}

/* =========================
   Icons (inline SVG)
   ========================= */

function IconBell({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22a2.2 2.2 0 0 0 2.2-2.2H9.8A2.2 2.2 0 0 0 12 22Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
      />
      <path
        d="M18 8a6 6 0 1 0-12 0c0 7-3 7-3 7h18s-3 0-3-7Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function IconCalendar({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M7 3v3M17 3v3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path
        d="M4 9h16M6 5h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Z"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSpark({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2l1.6 6.1L20 10l-6.4 1.9L12 18l-1.6-6.1L4 10l6.4-1.9L12 2Z"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
      />
    </svg>
  );
}

function IconChart({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path d="M4 19V5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M4 19h16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M8 16V11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M12 16V7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M16 16V13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function IconLink({ className = "h-4 w-4" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none">
      <path
        d="M10 13a5 5 0 0 1 0-7l1-1a5 5 0 0 1 7 7l-1 1"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
      <path
        d="M14 11a5 5 0 0 1 0 7l-1 1a5 5 0 0 1-7-7l1-1"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      />
    </svg>
  );
}
