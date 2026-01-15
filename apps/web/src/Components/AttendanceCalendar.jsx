import { useMemo } from "react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const WEEKDAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const MONTH_NAMES = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
];

function ymd(d) {
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

export default function AttendanceCalendar({
  year,
  month, // 0-11
  timetableDays = {},   // { Monday:true, Saturday:true }
  attendanceMap = {},   // { "2026-01-18":"PRESENT" }
  onPrev,
  onNext,
}) {
  const cells = useMemo(() => {
    const first = new Date(year, month, 1);
    const startIndex = first.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const result = [];

    // prev month tail
    const prevMonthDays = new Date(year, month, 0).getDate();
    for (let i = startIndex - 1; i >= 0; i--) {
      result.push({ date: new Date(year, month - 1, prevMonthDays - i), inMonth: false });
    }

    // current month
    for (let d = 1; d <= daysInMonth; d++) {
      result.push({ date: new Date(year, month, d), inMonth: true });
    }

    // next month head
    while (result.length < 42) {
      const nextDay = result.length - (startIndex + daysInMonth) + 1;
      result.push({ date: new Date(year, month + 1, nextDay), inMonth: false });
    }

    return result;
  }, [year, month]);

  // ✅ letter for each status
  const letterMap = {
    PRESENT: "P",
    ABSENT: "A",
    LATE: "L",
    EXCUSED: "E",
    PENDING: "•",
  };

  // ✅ whole cell background colors
  function cellStyle(status, inMonth) {
    const base = inMonth ? "border-slate-200" : "border-slate-100 opacity-60";

    if (!status) return `bg-white ${base}`;

    const map = {
      PRESENT: "bg-emerald-50 border-emerald-200",
      ABSENT: "bg-rose-50 border-rose-200",
      LATE: "bg-amber-50 border-amber-200",
      EXCUSED: "bg-sky-50 border-sky-200",
      PENDING: "bg-slate-50 border-slate-200",
    };

    return `${map[status] || "bg-white border-slate-200"} ${!inMonth ? "opacity-60" : ""}`;
  }

  // ✅ letter color
  function letterColor(status) {
    const map = {
      PRESENT: "text-emerald-700",
      ABSENT: "text-rose-700",
      LATE: "text-amber-800",
      EXCUSED: "text-sky-700",
      PENDING: "text-slate-500",
    };
    return map[status] || "text-slate-500";
  }

  return (
    <div className="rounded-2xl bg-white border border-slate-200 p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-base font-black text-slate-900">Attendance Calendar</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            {MONTH_NAMES[month]} {year}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPrev}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-extrabold hover:bg-slate-100"
          >
            ◀
          </button>
          <button
            onClick={onNext}
            className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-extrabold hover:bg-slate-100"
          >
            ▶
          </button>
        </div>
      </div>

      {/* Week labels */}
      <div className="mt-3 grid grid-cols-7 gap-1">
        {WEEKDAYS.map((w) => (
          <div key={w} className="text-[11px] font-extrabold text-slate-500 text-center">
            {w}
          </div>
        ))}

        {/* Cells */}
        {cells.map((c, idx) => {
          const d = c.date;
          const key = ymd(d);
          const weekdayName = WEEKDAY_NAMES[d.getDay()];

          const isTimetableClassDay = !!timetableDays[weekdayName];
          const recorded = attendanceMap[key];

          const isClassDay = isTimetableClassDay || !!recorded;
          const status = isClassDay ? (recorded || "PENDING") : null;

          return (
            <div
              key={idx}
              className={`rounded-xl border p-2 ${cellStyle(status, c.inMonth)} min-h-9.5`}
            >
              <div className="flex items-start justify-between">
                <span className={`text-[11px] font-black ${c.inMonth ? "text-slate-900" : "text-slate-400"}`}>
                  {d.getDate()}
                </span>

                {isClassDay && (
                  <span className={`text-sm font-black ${letterColor(status)}`}>
                    {letterMap[status]}
                  </span>
                )}
              </div>

              <div className="mt-1">
                {!isClassDay ? (
                  <p className="text-[10px] text-slate-400 font-semibold">No class</p>
                ) : (
                  <p className="text-[10px] text-slate-600 font-semibold">
                    {isTimetableClassDay ? "Class" : "Extra"}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend (compact) */}
      <div className="mt-3 flex flex-wrap gap-2 text-[11px] font-extrabold text-slate-600">
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" /> Present
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-rose-400" /> Absent
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-amber-400" /> Late
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-sky-400" /> Extra Class
        </span>
        <span className="inline-flex items-center gap-1">
          <span className="h-2.5 w-2.5 rounded-full bg-slate-300" /> Pending
        </span>
      </div>
    </div>
  );
}
