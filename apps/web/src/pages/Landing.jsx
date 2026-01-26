
import { useEffect, useState } from "react";
import {
  Play,
  CheckCircle2,
  GraduationCap,
  Users,
  BookOpen,
  Clock,
  Shield,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
} from "lucide-react";

import LoginForm from "../components/LoginForm.jsx";

import { fetchTimetable } from "../services/timetableApi";

import Man from "../Assets/Man.png";
import learnImg from "../Assets/think.jpg";
import attentionImg from "../Assets/personal.jpg";
import testImg from "../Assets/unit.jpg";
import syllabusImg from "../Assets/syllubus.jpg";
import limitedImg from "../Assets/limited.jpg";
import successImg from "../Assets/exam.jpg";
import logo from "../Assets/Landing_Logo_icon.png";

export default function LandingPage() {
  // -------------------------
  // WHY WE ARE BEST CARDS
  // -------------------------
  const cards = [
    {
      title: "Learn Complex Topics Simply",
      icon: GraduationCap,
      chip: "Concept clarity",
      desc: "Complex concepts are broken down into simple, easy-to-understand explanations suitable for every learner.",
      image: learnImg,
      tint: "from-indigo-600/60 via-indigo-600/20",
    },
    {
      title: "Personal Attention",
      icon: Users,
      chip: "1-to-1 focus",
      desc: "Each student receives individual attention to identify weaknesses and improve performance effectively.",
      image: attentionImg,
      tint: "from-pink-600/60 via-pink-600/20",
    },
    {
      title: "Regular Unit Tests",
      icon: CheckCircle2,
      chip: "Track progress",
      desc: "Frequent unit tests help track progress, strengthen understanding, and prepare students for exams.",
      image: testImg,
      tint: "from-sky-600/60 via-sky-600/20",
    },
    {
      title: "Syllabus Covered Early",
      icon: BookOpen,
      chip: "Early revision",
      desc: "The complete O/L syllabus is covered at least 4 months before exams, allowing ample revision time.",
      image: syllabusImg,
      tint: "from-emerald-600/60 via-emerald-600/20",
    },
    {
      title: "Limited Students per Class",
      icon: Clock,
      chip: "Small batches",
      desc: "Small class sizes ensure focused learning, better interaction, and effective doubt clarification.",
      image: limitedImg,
      tint: "from-amber-600/60 via-amber-600/20",
    },
    {
      title: "O/L Exam Success",
      icon: Shield,
      chip: "Pass guarantee",
      desc: "A structured learning approach that supports every student to pass the G.C.E. Ordinary Level examination.",
      image: successImg,
      tint: "from-slate-700/60 via-slate-700/20",
    },
  ];

  // -------------------------
  // TIMETABLE: FROM DB (API)
  // -------------------------
  const [timetable, setTimetable] = useState([]);
  const [ttLoading, setTtLoading] = useState(true);
  const [ttError, setTtError] = useState("");

  // ✅ Grade order (custom)
  const gradeOrder = {
    "Grade 6": 0,
    "Grade 7": 1,
    "Grade 8": 2,
    "Grade 9": 3,
    "Grade 10": 4,
    "Grade 11": 5,
  };

  // ✅ Day order (custom)
  const dayOrder = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

  // ✅ Convert start time to minutes for sorting
  function timeToMinutes(t = "") {
    // accepts: "4:00 PM – 6:00 PM" or "4:00PM - 6:00PM"
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

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        setTtLoading(true);
        setTtError("");

        const data = await fetchTimetable();

        // ✅ Sort: Grade 6->11, then Mon->Sun, then time
        const sorted = (data || []).slice().sort((a, b) => {
          const gA = gradeOrder[a.grade] ?? 999;
          const gB = gradeOrder[b.grade] ?? 999;
          if (gA !== gB) return gA - gB;

          const dA = dayOrder[a.day] ?? 999;
          const dB = dayOrder[b.day] ?? 999;
          if (dA !== dB) return dA - dB;

          return timeToMinutes(a.time) - timeToMinutes(b.time);
        });

        if (mounted) setTimetable(sorted);
      } catch (e) {
        if (mounted) setTtError("Failed to load timetable. Please refresh.");
      } finally {
        if (mounted) setTtLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">
      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-4 border-slate-200">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="ALGEON Logo"
              className="h-auto md:h-16 w-auto object-contain"
            />
          </div>

          <div className="hidden md:flex gap-8 font-semibold text-slate-600">
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Home
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Teachers
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Class
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              Pricing
            </a>
            <a href="#" className="hover:text-indigo-600 transition-colors">
              About Us
            </a>
          </div>

          <div className="flex items-center gap-3">
            <button className="font-bold text-slate-800 px-4 hover:text-indigo-600 transition-colors">
              Sign In
            </button>
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-xl font-bold hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">
              SIGN UP
            </button>
          </div>
        </div>
      </nav>

      {/* HERO (LEFT TEXT | MIDDLE LOGIN | RIGHT IMAGE) */}
      <section className="relative max-w-7xl mx-auto px-6 pt-10 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* LEFT */}
          <div className="lg:col-span-5">
            <h1 className="text-4xl md:text-5xl font-black leading-tight tracking-tight">
              Master <span className="text-indigo-600">Mathematics</span>
              <br />
              with Clarity and <br />
              Precision
            </h1>

            <p className="mt-5 text-slate-500 text-lg max-w-xl leading-relaxed">
              Interactive calculus, algebra, and geometry modules. Master complex
              theorems through visualized logic and real-time problem-solving.
            </p>

            <div className="mt-8 flex items-center gap-6">
              <button className="bg-amber-400 text-slate-900 px-8 py-4 rounded-2xl font-black hover:bg-amber-500 transition-all shadow-[0_10px_20px_-5px_rgba(251,191,36,0.4)] hover:-translate-y-1">
                JOIN CLASS
              </button>

              <button className="flex items-center gap-3 font-bold hover:text-indigo-600 transition-colors group">
                <div className="bg-indigo-600 p-2 rounded-full text-white group-hover:scale-110 transition-transform">
                  <Play size={18} fill="currentColor" />
                </div>
                See how it works?
              </button>
            </div>
          </div>

          {/* MIDDLE LOGIN */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-md">
              <LoginForm
                title="Login"
                subtitle="Sign in to access the dashboard"
                onSuccess={() => {}}
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-3 relative">
            <div className="absolute -top-12 right-6 h-96 w-96" />
            <img src={Man} alt="Student" className="h-86 w-105 object-contain" />
          </div>
        </div>

        <br />
        <hr />

        <div className="mt-2 text-center">
          <h2 className="text-xl font-bold text-yellow-600">
            " The Core Entity of Algebra and Logical Thinking "
          </h2>
        </div>
      </section>

      {/* STATS BAR */}
      <div className="relative bg-indigo-600 py-5 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage:
              `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.626 10.5H60v2H54.626L47.126 2H49.954L54.626 10.5z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-around text-white text-center gap-8">
          <div className="min-w-37.5">
            <div className="text-4xl font-black mb-1">6 - 11</div>
            <div className="text-indigo-100 font-semibold">Grade Levels</div>
          </div>
          <div className="min-w-37.5">
            <div className="text-4xl font-black mb-1">98%</div>
            <div className="text-indigo-100 font-semibold">Exam Success</div>
          </div>
          <div className="min-w-45">
            <div className="text-4xl font-black mb-1">150 +</div>
            <div className="text-indigo-100 font-semibold">Students</div>
          </div>
          <div className="min-w-45 text-center">
            <div className="text-4xl font-black mb-1">100%</div>
            <div className="text-indigo-100 font-semibold">Syllabus Covered</div>
          </div>
        </div>
      </div>

      {/* WHY WE ARE BEST */}
      <section className="relative max-w-7xl mx-auto px-6 md:px-10 py-20">
        <div className="absolute top-20 left-0 w-72 h-72 bg-purple-50 rounded-full blur-3xl -z-10" />

        <div className="text-center mb-14">
          <h2 className="text-4xl md:text-5xl font-black italic tracking-tight">
            Why we are{" "}
            <span className="text-indigo-600 underline decoration-amber-400 underline-offset-8">
              best from others?
            </span>
          </h2>
          <p className="text-slate-500 max-w-2xl mx-auto mt-6 text-lg">
            Student-centered learning with simplified teaching methods,
            continuous evaluation, and personal attention to ensure academic
            success.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {cards.map((c, i) => {
            const Icon = c.icon;
            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-4xl border border-slate-100 bg-white shadow-[0_10px_30px_rgba(2,6,23,0.06)] hover:shadow-[0_20px_60px_rgba(79,70,229,0.18)] transition-all duration-300 hover:-translate-y-2"
              >
                <img
                  src={c.image}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover scale-105 group-hover:scale-110 transition-transform duration-700"
                />

                <div className={`absolute inset-0 bg-linear-to-b ${c.tint} to-white/95`} />

                <div className="relative p-8">
                  <div className="flex items-center justify-between">
                    <div className="w-14 h-14 rounded-2xl bg-white/80 backdrop-blur flex items-center justify-center border border-white/60">
                      <Icon className="text-slate-900" />
                    </div>

                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-white/80 border border-white/60">
                      {c.chip}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl font-black text-slate-900 drop-shadow-sm">
                    {c.title}
                  </h3>

                  <p className="mt-3 text-slate-700 leading-relaxed">{c.desc}</p>

                  <div className="mt-6 flex items-center gap-2 text-sm font-bold text-indigo-700">
                    <span className="inline-block h-2 w-2 rounded-full bg-indigo-600" />
                    Theory & Paper
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* CLASS TIMETABLE (DB) */}
      <section className="max-w-6xl mx-auto px-6 md:px-10 py-0">
        <div className="mb-10 text-center">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            Class <span className="text-indigo-600">Timetable</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-2xl mx-auto">
            Weekly Mathematics classes for Grades 6–11 covering both theory
            lessons and paper-based exam practice.
          </p>
        </div>

        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl bg-white">
          <table className="w-full border-collapse text-left">
            <thead className="bg-indigo-600 text-white">
              <tr>
                <th className="px-6 py-5 text-sm font-black uppercase">Grade</th>
                <th className="px-6 py-5 text-sm font-black uppercase">Day</th>
                <th className="px-6 py-5 text-sm font-black uppercase">Time</th>
                <th className="px-6 py-5 text-sm font-black uppercase text-center">
                  Class Type
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-200">
              {ttLoading && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-semibold">
                    Loading timetable...
                  </td>
                </tr>
              )}

              {!ttLoading && ttError && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-red-600 font-bold">
                    {ttError}
                  </td>
                </tr>
              )}

              {!ttLoading &&
                !ttError &&
                timetable.map((row) => (
                  <tr key={row._id} className="hover:bg-indigo-50 transition">
                    <td className="px-6 py-4 font-black text-indigo-700">{row.grade}</td>
                    <td className="px-6 py-4 font-semibold text-slate-700">{row.day}</td>
                    <td className="px-6 py-4 text-slate-600 font-semibold">{row.time}</td>
                    <td className="px-6 py-4 text-center">
                      <span className="px-4 py-2 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-700">
                        {row.classType || "Theory & Paper"}
                      </span>
                    </td>
                  </tr>
                ))}

              {!ttLoading && !ttError && timetable.length === 0 && (
                <tr>
                  <td colSpan="4" className="px-6 py-8 text-center text-slate-500 font-semibold">
                    No timetable data yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 mb-4 text-center text-slate-500 font-semibold">
          ✔ Theory lessons &nbsp; • &nbsp; ✔ Exam paper discussions &nbsp; • &nbsp; ✔ O/L syllabus completed early
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white pt-10 pb-6 relative overflow-hidden">
        <div className="absolute bottom-0 right-0 w-96 h-72 bg-indigo-500/10 rounded-full blur-[120px]" />

        <div className="relative z-10 max-w-6xl mx-auto px-6 md:px-10 grid md:grid-cols-4 gap-10">
          <div className="col-span-1">
            <div className="text-3xl font-black mb-3 text-indigo-400">ALGEON</div>
            <p className="text-slate-400 leading-relaxed mb-6">
              The Core Entity of Algebra and Logical Thinking.
            </p>
            <div className="flex gap-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <div
                  key={i}
                  className="bg-slate-800 p-3 rounded-xl hover:bg-indigo-600 transition-all cursor-pointer hover:-translate-y-1"
                >
                  <Icon size={20} />
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-black text-lg mb-6 border-b border-slate-800 pb-2 inline-block">
              About
            </h4>
            <ul className="text-slate-400 space-y-3 font-semibold">
              <li className="hover:text-white transition-colors cursor-pointer">Our Story</li>
              <li className="hover:text-white transition-colors cursor-pointer">Classes</li>
              <li className="hover:text-white transition-colors cursor-pointer">Teachers</li>
              <li className="hover:text-white transition-colors cursor-pointer">Academic</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg mb-6 border-b border-slate-800 pb-2 inline-block">
              Company
            </h4>
            <ul className="text-slate-400 space-y-3 font-semibold">
              <li className="hover:text-white transition-colors cursor-pointer">Membership</li>
              <li className="hover:text-white transition-colors cursor-pointer">Terms of Service</li>
              <li className="hover:text-white transition-colors cursor-pointer">Privacy</li>
              <li className="hover:text-white transition-colors cursor-pointer">FAQ</li>
            </ul>
          </div>

          <div>
            <h4 className="font-black text-lg mb-6 border-b border-slate-800 pb-2 inline-block">
              Support
            </h4>
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
              <p className="text-sm text-slate-300 mb-2">Email us at:</p>
              <p className="font-black text-indigo-400 mb-4">info@algeon.com</p>
              <p className="text-sm text-slate-300">Call anytime:</p>
              <p className="font-black text-indigo-400">+94 76 3933 586</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-2 mt-4">
          © 2026 ALGEON. Built with passion for better learning.
        </div>
      </footer>
    </div>
  );
}
