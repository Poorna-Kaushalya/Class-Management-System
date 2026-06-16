// client/src/pages/AdminStudentDashboard.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Plus, Trash2, PencilLine, Save } from "lucide-react";

import AttendanceCalendar from "../Components/AttendanceCalendar";
import MarksMiniChart from "../Components/MarksMiniChart";
import LumoraLoader from "../Components/LumoraLoader";

import {
  adminFetchStudentDashboard,
  adminUpdateStudentProfile,
  adminUpsertAttendance,
  adminDeleteAttendance,
  adminUpsertFee,
  adminDeleteFee,
  adminUpsertMark,
  adminDeleteMark,
  adminCreateNotice,
  adminDeleteNotice,
} from "../services/adminStudentsApi";

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const MONTH_SHORT = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const GRADES = ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"];

export default function AdminStudentDashboard() {
  const { studentUserId } = useParams();
  const navigate = useNavigate();

  const [pageLoading, setPageLoading] = useState(true);
  const [err, setErr] = useState("");
  const [msg, setMsg] = useState("");

  const [student, setStudent] = useState(null);
  const [notices, setNotices] = useState([]);
  const [fees, setFees] = useState([]);
  const [marks, setMarks] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [timetable, setTimetable] = useState([]);

  // ✅ Year + Month dropdown controls
  const YEARS = useMemo(() => {
    const y = new Date().getFullYear();
    return Array.from({ length: 6 }, (_, i) => y - i); // last 6 years
  }, []);

  const MONTHS = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        idx: i,
        value: String(i + 1).padStart(2, "0"),
        label: MONTH_NAMES[i],
      })),
    []
  );

  const [calYear, setCalYear] = useState(new Date().getFullYear());
  const [calMonth, setCalMonth] = useState(new Date().getMonth()); // 0-11

  // ✅ Collapsible panels
  const [showProfileCard, setShowProfileCard] = useState(true);
  const [showManageNotices, setShowManageNotices] = useState(true);
  const [showManageAttendance, setShowManageAttendance] = useState(true);
  const [showManageFees, setShowManageFees] = useState(true);
  const [showManageMarks, setShowManageMarks] = useState(true);

  // ------- profile edit modal state -------
  const [editOpen, setEditOpen] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [schoolName, setSchoolName] = useState("");
  const [classId, setClassId] = useState("");

  // ------- attendance editor -------
  const [attDate, setAttDate] = useState("");
  const [attStatus, setAttStatus] = useState("PRESENT");

  // ------- fee editor -------
  const [feeMonth, setFeeMonth] = useState("");
  const [feeStatus, setFeeStatus] = useState("PAID");
  const [feePaidDate, setFeePaidDate] = useState("");

  // ------- marks editor -------
  const [markMonth, setMarkMonth] = useState("");
  const [markTitle, setMarkTitle] = useState("");
  const [markMarks, setMarkMarks] = useState("");
  const [markMax, setMarkMax] = useState("");

  // ------- notice editor -------
  const [noticeTitle, setNoticeTitle] = useState("");
  const [noticeExpiresAt, setNoticeExpiresAt] = useState("");

  function ymValue(y, mIdx) {
    return `${y}-${String(mIdx + 1).padStart(2, "0")}`; // YYYY-MM
  }

  function monthKey(y, mIdx) {
    return ymValue(y, mIdx);
  }

  const attendanceMap = useMemo(() => {
    const map = {};
    (attendance || []).forEach((r) => (map[r.date] = r.status));
    return map;
  }, [attendance]);

  const timetableDays = useMemo(() => {
    const daysObj = {};
    (timetable || []).forEach((row) => {
      if (row.day) daysObj[row.day] = true;
    });
    return daysObj;
  }, [timetable]);

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

  function monthLabel(monthStr) {
    if (!monthStr || !monthStr.includes("-")) return monthStr;
    const [, mm] = monthStr.split("-");
    const idx = Number(mm) - 1;
    return `${MONTH_NAMES[idx] || monthStr} ${monthStr.slice(0, 4)}`;
  }

  async function load() {
    try {
      setErr("");
      setMsg("");
      setPageLoading(true);

      const month = monthKey(calYear, calMonth);
      const data = await adminFetchStudentDashboard(studentUserId, {
        year: String(calYear),
        month,
      });

      setStudent(data.student);
      setNotices(data.notices || []);
      setFees(data.fees || []);
      setMarks(data.marks || []);
      setAttendance(data.attendance || []);
      setTimetable(data.timetable || []);

      const s = data.student;
      setFullName(s?.fullName || "");
      setPhone(s?.phone || "");
      setSchoolName(s?.schoolName || "");
      setClassId(s?.classId || "");
    } catch {
      setErr("Failed to load student dashboard");
    } finally {
      setPageLoading(false);
    }
  }

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentUserId, calYear, calMonth]);

  // ------------------ ACTIONS ------------------

  async function saveProfile() {
    try {
      setErr("");
      setMsg("");
      const res = await adminUpdateStudentProfile(studentUserId, {
        fullName,
        phone,
        schoolName,
        classId,
      });
      setStudent(res.user);
      setMsg("Profile updated");
      setEditOpen(false);
      await load();
    } catch {
      setErr("Failed to update profile");
    }
  }

  async function addOrUpdateAttendance() {
    try {
      setErr("");
      setMsg("");
      if (!attDate) return setErr("Select a date");
      await adminUpsertAttendance(studentUserId, { date: attDate, status: attStatus });
      setMsg("Attendance saved");
      setAttDate("");
      await load();
    } catch {
      setErr("Failed to save attendance");
    }
  }

  async function removeAttendance(date) {
    try {
      setErr("");
      setMsg("");
      await adminDeleteAttendance(studentUserId, date);
      setMsg("Attendance deleted");
      await load();
    } catch {
      setErr("Failed to delete attendance");
    }
  }

  async function addOrUpdateFee() {
    try {
      setErr("");
      setMsg("");
      if (!feeMonth) return setErr("Select month");
      await adminUpsertFee(studentUserId, {
        month: feeMonth,
        status: feeStatus,
        paidDate: feePaidDate,
      });
      setMsg("Fee saved");
      setFeeMonth("");
      setFeePaidDate("");
      await load();
    } catch {
      setErr("Failed to save fee");
    }
  }

  async function removeFee(month) {
    try {
      setErr("");
      setMsg("");
      await adminDeleteFee(studentUserId, month);
      setMsg("Fee deleted");
      await load();
    } catch {
      setErr("Failed to delete fee");
    }
  }

  async function addMark() {
    try {
      setErr("");
      setMsg("");
      if (!markMonth || !markTitle) return setErr("Select month and enter title");
      await adminUpsertMark(studentUserId, {
        month: markMonth,
        title: markTitle,
        marks: Number(markMarks),
        maxMarks: Number(markMax),
      });
      setMsg("Mark added");
      setMarkMonth("");
      setMarkTitle("");
      setMarkMarks("");
      setMarkMax("");
      await load();
    } catch {
      setErr("Failed to add marks");
    }
  }

  async function updateMark(m) {
    try {
      setErr("");
      setMsg("");
      await adminUpsertMark(studentUserId, {
        markId: m._id,
        month: m.month,
        title: m.title,
        marks: m.marks,
        maxMarks: m.maxMarks,
      });
      setMsg("Mark updated");
      await load();
    } catch {
      setErr("Failed to update marks");
    }
  }

  async function removeMark(markId) {
    try {
      setErr("");
      setMsg("");
      await adminDeleteMark(markId);
      setMsg("Mark deleted");
      await load();
    } catch {
      setErr("Failed to delete mark");
    }
  }

  async function createNotice() {
    try {
      setErr("");
      setMsg("");
      if (!noticeTitle) return setErr("Notice title required");

      await adminCreateNotice({
        grade: student?.classId || "ALL",
        title: noticeTitle,
        expiresAt: noticeExpiresAt ? new Date(noticeExpiresAt) : null,
      });

      setMsg("Notice created");
      setNoticeTitle("");
      setNoticeExpiresAt("");
      await load();
    } catch {
      setErr("Failed to create notice");
    }
  }

  async function removeNotice(noticeId) {
    try {
      setErr("");
      setMsg("");
      await adminDeleteNotice(noticeId);
      setMsg("Notice deleted");
      await load();
    } catch {
      setErr("Failed to delete notice");
    }
  }

  // ------------------ UI ------------------

  if (pageLoading) return <LumoraLoader />;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white/90 backdrop-blur border-b border-slate-200">
        <div className="max-w-8xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-extrabold text-slate-500">Admin Student View</p>
            <h1 className="text-lg md:text-xl font-black text-slate-900 truncate">
              {student?.fullName || "Student"} — {student?.classId || "No Grade"}
            </h1>
            <p className="text-xs text-slate-500 font-semibold">
              Student ID: {student?.studentId || "-"} • {student?.email || "-"}
            </p>
          </div>

          {/* ✅ Month + Year dropdown */}
          <div className="flex items-center gap-2">
            <select className={sel()} value={calYear} onChange={(e) => setCalYear(Number(e.target.value))}>
              {YEARS.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>

            <select className={sel()} value={calMonth} onChange={(e) => setCalMonth(Number(e.target.value))}>
              {MONTH_NAMES.map((m, idx) => (
                <option key={m} value={idx}>
                  {m}
                </option>
              ))}
            </select>

            <button
              onClick={() => setEditOpen(true)}
              className="rounded-xl bg-indigo-600 text-white px-4 py-2 text-sm font-black hover:bg-indigo-700 active:scale-95 transition"
            >
              Edit Profile
            </button>

            <button
              onClick={() => navigate("/admin")}
              className="rounded-xl bg-slate-900 text-white px-4 py-2 text-sm font-black hover:bg-slate-800 active:scale-95 transition"
            >
              Back
            </button>
          </div>
        </div>
      </div>

      {/* status */}
      <div className="max-w-8xl mx-auto px-4 pt-4">
        {err && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-rose-700 font-semibold">
            {err}
          </div>
        )}
        {msg && (
          <div className="mt-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800 font-semibold">
            {msg}
          </div>
        )}
      </div>

      {/* Layout */}
      <div className="max-w-8xl mx-auto px-4 pt-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* LEFT */}
          <aside className="lg:col-span-3 space-y-4">
            <Card accent="slate">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-slate-900">Quick Profile</h3>
                <ToggleBtn open={showProfileCard} setOpen={setShowProfileCard} />
              </div>

              {showProfileCard && (
                <div className="mt-2 space-y-2 text-sm">
                  <InfoRow label="Name" value={student?.fullName || "-"} />
                  <InfoRow label="Grade" value={student?.classId || "-"} />
                  <InfoRow label="School" value={student?.schoolName || "Not Set"} />
                  <InfoRow label="Phone" value={student?.phone || "Not Set"} />
                </div>
              )}
            </Card>

            <Card accent="emerald">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-black text-slate-900">Marks Summary</h3>
                <span className="text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                  {calYear}
                </span>
              </div>
              <div className="mt-2">
                <MarksMiniChart data={marksChartData} height={120} />
              </div>
            </Card>

            {/* ✅ Manage Marks (month dropdown + icons) */}
            <Card accent="emerald">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-slate-900">Manage Marks</h3>
                <ToggleBtn open={showManageMarks} setOpen={setShowManageMarks} />
              </div>

              {showManageMarks && (
                <>
                  <div className="mt-3 grid grid-cols-1 gap-2">
                    <select className={selFull()} value={markMonth} onChange={(e) => setMarkMonth(e.target.value)}>
                      <option value="">Select Month</option>
                      {MONTHS.map((m) => (
                        <option key={m.value} value={ymValue(calYear, m.idx)}>
                          {m.label} {calYear}
                        </option>
                      ))}
                    </select>

                    <input
                      className={inp()}
                      placeholder="Title (e.g., Unit Test 1)"
                      value={markTitle}
                      onChange={(e) => setMarkTitle(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <input className={inp()} placeholder="Marks" value={markMarks} onChange={(e) => setMarkMarks(e.target.value)} />
                      <input className={inp()} placeholder="Max" value={markMax} onChange={(e) => setMarkMax(e.target.value)} />
                    </div>

                    <button onClick={addMark} className={btnIconPrimary()}>
                      <Plus size={18} />
                      <span>Add Mark</span>
                    </button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {(marks || []).slice(0, 10).map((m) => (
                      <div key={m._id} className="rounded-xl border border-slate-200 bg-white p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{m.title}</p>
                            <p className="text-xs font-semibold text-slate-500">
                              {m.month} • {m.marks}/{m.maxMarks}
                            </p>
                          </div>

                          <div className="flex items-center gap-2">
                            <button onClick={() => updateMark(m)} className={btnIconSlateSmall()} title="Update">
                              <PencilLine size={16} />
                            </button>
                            <button onClick={() => removeMark(m._id)} className={btnIconDangerSmall()} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </div>

                        {/* inline edit */}
                        <div className="mt-2 grid grid-cols-2 gap-2">
                          <input
                            className={inp()}
                            value={m.marks}
                            onChange={(e) =>
                              setMarks((p) => p.map((x) => (x._id === m._id ? { ...x, marks: Number(e.target.value) } : x)))
                            }
                          />
                          <input
                            className={inp()}
                            value={m.maxMarks}
                            onChange={(e) =>
                              setMarks((p) => p.map((x) => (x._id === m._id ? { ...x, maxMarks: Number(e.target.value) } : x)))
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </Card>
          </aside>

          {/* CENTER */}
          <main className="lg:col-span-6 space-y-4">
            {/* ✅ Notices (manage controls hideable, list always visible; delete only when manage shown) */}
            <Card accent="red">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-lg font-black text-slate-900">Notices</h2>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold rounded-full bg-slate-100 text-slate-700 px-3 py-1">
                    {student?.classId || "Grade"}
                  </span>
                  <ToggleBtn open={showManageNotices} setOpen={setShowManageNotices} />
                </div>
              </div>

              {showManageNotices && (
                <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                  <input className={inp()} placeholder="Notice title" value={noticeTitle} onChange={(e) => setNoticeTitle(e.target.value)} />
                  <input className={inp()} type="date" value={noticeExpiresAt} onChange={(e) => setNoticeExpiresAt(e.target.value)} />
                  <button onClick={createNotice} className={btnIconPrimary()}>
                    <Plus size={18} />
                    <span>Create</span>
                  </button>
                </div>
              )}

              <div className="mt-3 space-y-2">
                {(notices || []).slice(0, 10).map((n) => (
                  <div key={n._id} className="rounded-xl border border-slate-200 bg-white p-3 flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-black text-slate-900">{n.title}</p>
                      <p className="text-xs font-semibold text-slate-500">
                        {new Date(n.createdAt).toISOString().slice(0, 10)} • {n.grade}
                      </p>
                    </div>
                    {showManageNotices && (
                      <button onClick={() => removeNotice(n._id)} className={btnIconDanger()} title="Delete">
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                ))}

                {(notices || []).length === 0 && <p className="text-sm font-semibold text-slate-500 mt-2">No notices.</p>}
              </div>
            </Card>

            {/* Calendar (always visible) */}
            <AttendanceCalendar
              year={calYear}
              month={calMonth}
              timetableDays={timetableDays}
              attendanceMap={attendanceMap}
              onPrev={() => setCalMonth((m) => (m === 0 ? 11 : m - 1))}
              onNext={() => setCalMonth((m) => (m === 11 ? 0 : m + 1))}
            />

            {/* ✅ Manage Attendance: Hide => ONLY FORM, list hidden */}
            <Card accent="indigo">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-base font-black text-slate-900">Manage Attendance</h3>
                <ToggleBtn open={showManageAttendance} setOpen={setShowManageAttendance} />
              </div>

              {/* ✅ Always show form */}
              <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                <input className={inp()} type="date" value={attDate} onChange={(e) => setAttDate(e.target.value)} />
                <select className={selFull()} value={attStatus} onChange={(e) => setAttStatus(e.target.value)}>
                  <option value="PRESENT">PRESENT</option>
                  <option value="ABSENT">ABSENT</option>
                  <option value="LATE">LATE</option>
                  <option value="EXCUSED">EXCUSED</option>
                </select>
                <button onClick={addOrUpdateAttendance} className={btnIconPrimary()}>
                  <Save size={18} />
                  <span>Save</span>
                </button>
              </div>

              {/* ✅ Only show list when Manage is OPEN */}
              {showManageAttendance && (
                <div className="mt-3 space-y-2">
                  {(attendance || []).map((a) => (
                    <div key={a._id} className="rounded-xl border border-slate-200 bg-white p-3 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-black text-slate-900">{a.date}</p>
                        <p className="text-xs font-semibold text-slate-500">{a.status}</p>
                      </div>
                      <button onClick={() => removeAttendance(a.date)} className={btnIconDanger()} title="Delete">
                        <Trash2 size={16} />
                        <span>Delete</span>
                      </button>
                    </div>
                  ))}

                  {(attendance || []).length === 0 && (
                    <p className="text-sm font-semibold text-slate-500 mt-2">No attendance records for this month.</p>
                  )}
                </div>
              )}
            </Card>
          </main>

          {/* RIGHT */}
          <aside className="lg:col-span-3 space-y-4">
            {/* ✅ Manage Fees (month dropdown + icons) */}
            <Card accent="amber">
              <div className="flex items-center justify-between gap-2">
                <h3 className="font-black text-lg text-slate-900">Manage Fees</h3>
                <ToggleBtn open={showManageFees} setOpen={setShowManageFees} />
              </div>

              {showManageFees && (
                <div className="mt-3 space-y-2">
                  <select className={selFull()} value={feeMonth} onChange={(e) => setFeeMonth(e.target.value)}>
                    <option value="">Select Month</option>
                    {MONTHS.map((m) => (
                      <option key={m.value} value={ymValue(calYear, m.idx)}>
                        {m.label} {calYear}
                      </option>
                    ))}
                  </select>

                  <select className={selFull()} value={feeStatus} onChange={(e) => setFeeStatus(e.target.value)}>
                    <option value="PAID">PAID</option>
                    <option value="PENDING">PENDING</option>
                    <option value="ABSENT">ABSENT</option>
                  </select>

                  <input
                    className={inp()}
                    placeholder="Paid date (optional, YYYY-MM-DD)"
                    value={feePaidDate}
                    onChange={(e) => setFeePaidDate(e.target.value)}
                  />

                  <button onClick={addOrUpdateFee} className={btnIconPrimary()}>
                    <Plus size={18} />
                    <span>Save Fee</span>
                  </button>
                </div>
              )}

              <div className="mt-4 overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-left text-slate-500 border-b">
                      <th className="py-2 pr-1 font-semibold">Month</th>
                      <th className="py-2 pr-1 font-semibold">Status</th>
                      <th className="py-2 pr-1 font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(fees || []).map((r) => (
                      <tr key={r.month} className="border-b last:border-b-0 border-gray-300">
                        <td className="py-2 pr-2 font-black text-slate-900">{monthLabel(r.month)}</td>
                        <td className="py-2 pr-2 font-semibold text-slate-700">{r.status}</td>
                        <td className="py-2">
                          {showManageFees ? (
                            <button onClick={() => removeFee(r.month)} className={btnIconDangerSmall()} title="Delete">
                              <Trash2 size={16} />
                            </button>
                          ) : (
                            <span className="text-xs font-semibold text-slate-400">—</span>
                          )}
                        </td>
                      </tr>
                    ))}

                    {(fees || []).length === 0 && (
                      <tr>
                        <td colSpan={3} className="py-6 text-center text-slate-500 font-semibold">
                          No fee records found.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </Card>

            {/* Timetable preview (optional) */}
            <Card accent="slate">
              <h3 className="font-black text-lg text-slate-900">Timetable Days</h3>
              <p className="text-xs text-slate-500 font-semibold mt-1">Based on student grade timetable</p>

              <div className="mt-3 space-y-2">
                {(timetable || []).length === 0 && <p className="text-sm font-semibold text-slate-500">No timetable assigned.</p>}

                {(timetable || []).slice(0, 8).map((t) => (
                  <div key={t._id} className="rounded-xl border border-slate-200 bg-white p-3">
                    <p className="text-sm font-black text-slate-900">{t.day}</p>
                    <p className="text-xs font-semibold text-slate-500 mt-1">
                      {t.time} • {t.classType || "Theory & Paper"}
                    </p>
                  </div>
                ))}
              </div>
            </Card>
          </aside>
        </div>
      </div>

      {/* Profile Edit Modal */}
      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 p-6 shadow-xl">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-xl font-black text-slate-900">Edit Student Profile</h3>
                <p className="text-sm text-slate-500 mt-1">Admin can update student details.</p>
              </div>
              <button
                onClick={() => setEditOpen(false)}
                className="rounded-xl bg-slate-100 px-3 py-2 font-bold hover:bg-slate-200"
              >
                ✕
              </button>
            </div>

            <div className="mt-4 space-y-3">
              <input className={inp()} value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Full name" />
              <input className={inp()} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" />
              <input className={inp()} value={schoolName} onChange={(e) => setSchoolName(e.target.value)} placeholder="School name" />

              <select className={selFull()} value={classId} onChange={(e) => setClassId(e.target.value)}>
                <option value="">No Grade</option>
                {GRADES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>

              <button onClick={saveProfile} className={`${btnPrimary()} w-full`}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------------- UI Helpers ---------------- */

function Card({ children, accent = "indigo" }) {
  const accentMap = {
    indigo: "border-t-indigo-500",
    red: "border-t-rose-400",
    amber: "border-t-amber-400",
    emerald: "border-t-emerald-500",
    slate: "border-t-slate-300",
  };
  return (
    <div className={`rounded-2xl bg-white border border-slate-200 shadow-sm border-t-4 ${accentMap[accent]} p-4`}>
      {children}
    </div>
  );
}

function ToggleBtn({ open, setOpen }) {
  return (
    <button
      onClick={() => setOpen((v) => !v)}
      className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-700 hover:bg-slate-200 transition"
    >
      {open ? "Hide" : "Show"}
    </button>
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

function inp() {
  return "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600";
}

function sel() {
  return "border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 bg-white";
}

function selFull() {
  return "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600 bg-white";
}

function btnPrimary() {
  return "bg-indigo-600 text-white rounded-xl font-black text-sm px-4 py-2 hover:bg-indigo-700 active:scale-95 transition";
}

function btnIconPrimary() {
  return "w-full inline-flex items-center justify-center gap-2 bg-indigo-600 text-white rounded-xl font-black text-sm px-4 py-2 hover:bg-indigo-700 active:scale-95 transition";
}

function btnIconDanger() {
  return "inline-flex items-center gap-2 bg-rose-600 text-white px-4 py-2 rounded-xl text-xs font-black hover:bg-rose-700 active:scale-95 transition";
}

function btnIconDangerSmall() {
  return "inline-flex items-center justify-center bg-rose-600 text-white px-2.5 py-2 rounded-xl text-xs font-black hover:bg-rose-700 active:scale-95 transition";
}

function btnIconSlateSmall() {
  return "inline-flex items-center justify-center bg-slate-900 text-white px-2.5 py-2 rounded-xl text-xs font-black hover:bg-slate-800 active:scale-95 transition";
}
