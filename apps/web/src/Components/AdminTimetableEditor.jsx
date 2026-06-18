import { useEffect, useMemo, useState } from "react";
import {
  fetchTimetable,
  createTimetableRow,
  updateTimetableRow,
  deleteTimetableRow,
} from "../services/timetableApi";

const SUBJECTS = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "ICT",
  "Commerce",
  "Civics",
];

export default function AdminTimetableEditor() {
  const GRADES = useMemo(
    () => ["Grade 6", "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11"],
    []
  );

  const DAYS = useMemo(
    () => ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"],
    []
  );

  const TYPES = useMemo(() => ["Theory & Paper", "Theory", "Paper"], []);

  const GRADE_ORDER = useMemo(() => {
    const m = {};
    GRADES.forEach((g, idx) => (m[g] = idx));
    return m;
  }, [GRADES]);

  const DAY_ORDER = useMemo(() => {
    const m = {};
    DAYS.forEach((d, idx) => (m[d] = idx));
    return m;
  }, [DAYS]);

  const [rows, setRows] = useState([]);
  const [busyId, setBusyId] = useState(null);
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const subjectNames = subjects.map((s) => s.name);

  const [form, setForm] = useState({
    grade: "Grade 6",
    subject: "",
    day: "Thursday",
    time: "",
    classType: "Theory & Paper",
  });

  const SUBJECT_COLORS = {
    Mathematics: {
      light: "bg-blue-200 text-blue-700",
      main: "bg-blue-400 text-white",
      dark: "bg-blue-500 text-white",
    },
    Science: {
      light: "bg-green-200 text-green-700",
      main: "bg-green-400 text-white",
      dark: "bg-green-500 text-white",
    },
    English: {
      light: "bg-purple-200 text-purple-700",
      main: "bg-purple-400 text-white",
      dark: "bg-purple-500 text-white",
    },
    History: {
      light: "bg-amber-200 text-amber-700",
      main: "bg-amber-400 text-white",
      dark: "bg-amber-500 text-white",
    },
    Geography: {
      light: "bg-cyan-200 text-cyan-700",
      main: "bg-cyan-400 text-white",
      dark: "bg-cyan-500 text-white",
    },
    ICT: {
      light: "bg-indigo-200 text-indigo-700",
      main: "bg-indigo-400 text-white",
      dark: "bg-indigo-500 text-white",
    },
    Commerce: {
      light: "bg-pink-200 text-pink-700",
      main: "bg-pink-400 text-white",
      dark: "bg-pink-500 text-white",
    },
    Civics: {
      light: "bg-slate-200 text-slate-700",
      main: "bg-slate-400 text-white",
      dark: "bg-slate-500 text-white",
    },
  };

  const selectedSubjectData = selectedSubject;

  function timeToMinutes(t = "") {
    const start = t.split("–")[0]?.split("-")[0]?.trim() || "";
    const m = start.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
    if (!m) return 999999;
    let hh = parseInt(m[1], 10);
    let mm = parseInt(m[2] || "0", 10);
    const ap = m[3].toUpperCase();
    if (ap === "PM" && hh !== 12) hh += 12;
    if (ap === "AM" && hh === 12) hh = 0;
    return hh * 60 + mm;
  }

  function sortRows(data) {
    return [...data].sort((a, b) => {
      const gA = GRADE_ORDER[a.grade] ?? 999;
      const gB = GRADE_ORDER[b.grade] ?? 999;
      if (gA !== gB) return gA - gB;

      const dA = DAY_ORDER[a.day] ?? 999;
      const dB = DAY_ORDER[b.day] ?? 999;
      if (dA !== dB) return dA - dB;

      return timeToMinutes(a.time) - timeToMinutes(b.time);
    });
  }

  async function load(subjectId = selectedSubject?._id) {
    if (!subjectId) return;
    const data = await fetchTimetable(subjectId);
    setRows(sortRows(data));
  }

  useEffect(() => {
    if (selectedSubject?._id) {
      load(selectedSubject._id);
    }
  }, [selectedSubject]);

  async function addRow(e) {
    e.preventDefault();

    await createTimetableRow(form);

    setForm({
      grade: "Grade 6",
      subject: selectedSubject,
      day: "Thursday",
      time: "",
      classType: "Theory & Paper",
    });

    load(selectedSubject);
  }

  useEffect(() => {
    async function loadSubjects() {
      try {
        const res = await fetch("http://localhost:5000/api/subjects");
        const data = await res.json();

        setSubjects(data);

        // AUTO SELECT FIRST SUBJECT
        if (data.length > 0) {
          setSelectedSubject(data[0]);

          setForm((prev) => ({
            ...prev,
            subject: data[0]._id,
          }));
        }
      } catch (err) {
        console.error("Failed to load subjects");
      }
    }

    loadSubjects();
  }, []);

  async function update(id, patch) {
    try {
      setBusyId(id);
      const row = rows.find((r) => r._id === id);
      if (!row) return;
      await updateTimetableRow(id, { ...row, ...patch });
      await load();
    } finally {
      setBusyId(null);
    }
  }

  async function remove(id) {
    await deleteTimetableRow(id);
    load();
  }

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  const inputClass =
    "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-indigo-600";
  const selectClass =
    "w-full border border-slate-300 rounded-lg px-2 py-1 text-sm font-semibold outline-none focus:border-indigo-600 bg-white";
  const btnPrimary =
    "bg-indigo-600 text-white rounded-lg font-black text-sm px-2 py-2 hover:bg-indigo-700 active:scale-95 transition";
  const btnDanger =
    "bg-red-600 text-white rounded-lg font-black text-sm px-2 py-1.5 hover:bg-red-700 active:scale-95 transition";

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-6 py-5 relative">

      <div className="w-full mb-6">

        {/* HEADING */}
        <div className="mb-3 text-center">
          <h2 className="text-xl md:text-2xl font-black text-slate-800">
            Select <span className="text-indigo-600">Subject</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Choose a subject to filter timetable
          </p>
        </div>

        {/* SUBJECT CARDS */}
        <div className="flex flex-wrap gap-3 w-full justify-center">
          {subjects.map((subject) => {

            const active =
              selectedSubject?._id === subject._id
                ? SUBJECT_COLORS[subject.name]?.dark + " border-transparent shadow-lg scale-105"
                : SUBJECT_COLORS[subject.name]?.light + " border";

            return (
              <button
                key={subject._id}
                onClick={() => {
                  setSelectedSubject(subject);
                  setForm((prev) => ({
                    ...prev,
                    subject: subject._id,
                  }));
                }}
                className={`w-34 h-10 rounded-xl ${active}`}
              >
                {subject.name}
              </button>
            );
          })}
        </div>

        {/* BOTTOM HR */}
        <hr className="border-slate-600 mt-2" />

      </div>

      {/* Add Row */}
      <form
        onSubmit={addRow}
        className="grid grid-cols-1 md:grid-cols-6 gap-3 mb-2"
      >
        <select
          className={selectClass}
          value={form.subject}
          onChange={(e) => setForm({ ...form, subject: e.target.value })}
        >
          {subjects.map((s) => (
            <option key={s._id} value={s._id}>
              {s.name}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={form.grade}
          onChange={(e) => setForm({ ...form, grade: e.target.value })}
        >
          {GRADES.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>

        <select
          className={selectClass}
          value={form.day}
          onChange={(e) => setForm({ ...form, day: e.target.value })}
        >
          {DAYS.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        <input
          className={inputClass}
          placeholder="Time (4:00 PM – 6:00 PM)"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          required
        />

        <select
          className={selectClass}
          value={form.classType}
          onChange={(e) => setForm({ ...form, classType: e.target.value })}
        >
          {TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>

        <button className={btnPrimary}>Add Timetable Entry</button>
      </form>

      <hr className="border-slate-600 mb-4 mt-4" />

      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead
            className={`
    ${selectedSubjectData?.colors?.main || "bg-indigo-600"} text-white
  `}
          >
            <tr>
              <th className="px-4 py-2 text-left font-black uppercase tracking-wide text-xs">
                Grade
              </th>
              <th className="px-4 py-2 text-left text-xs font-black uppercase">
                Subject
              </th>
              <th className="px-4 py-2 text-left font-black uppercase tracking-wide text-xs">
                Day
              </th>
              <th className="px-4 py-2 text-left font-black uppercase tracking-wide text-xs">
                Time
              </th>
              <th className="px-4 py-2 text-left font-black uppercase tracking-wide text-xs">
                Type
              </th>
              <th className="px-4 py-2 text-center font-black uppercase tracking-wide text-xs">
                Action
              </th>
            </tr>
          </thead>

          <tbody>
            {rows.map((r) => (
              <tr
                key={r._id}
                className="border-t bg-white hover:bg-slate-50 transition"
              >
                <td className="px-4 py-1.5">
                  <select
                    className={selectClass}
                    value={r.grade}
                    onChange={(e) => update(r._id, { grade: e.target.value })}
                  >
                    {GRADES.map((g) => (
                      <option key={g} value={g}>
                        {g}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-1.5">
                  <select
                    className={selectClass}
                    value={r.subject?._id}
                    onChange={(e) => update(r._id, { subject: e.target.value })}
                  >
                    {subjects.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-1.5">
                  <select
                    className={selectClass}
                    value={r.day}
                    disabled={busyId === r._id}
                    onChange={(e) => update(r._id, { day: e.target.value })}
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-1.5">
                  <input
                    value={r.time}
                    disabled={busyId === r._id}
                    onChange={(e) => {
                      setRows((prev) =>
                        sortRows(
                          prev.map((x) =>
                            x._id === r._id ? { ...x, time: e.target.value } : x
                          )
                        )
                      );
                    }}
                    onBlur={(e) => update(r._id, { time: e.target.value })}
                    className={inputClass}
                  />
                </td>

                <td className="px-4 py-1.5">
                  <select
                    className={selectClass}
                    value={r.classType || "Theory & Paper"}
                    disabled={busyId === r._id}
                    onChange={(e) => update(r._id, { classType: e.target.value })}
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>
                        {t}
                      </option>
                    ))}
                  </select>
                </td>

                <td className="px-4 py-1.5 text-center">
                  <button onClick={() => remove(r._id)} className={btnDanger}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {rows.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-slate-500">
                  No timetable data
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
