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
  Calculator,
  FlaskConical,
  Landmark,
  Globe,
  Monitor,
  BarChart3,
  Scale,
} from "lucide-react";


import LoginForm from "../Components/LoginForm.jsx";
import { fetchTimetable } from "../services/timetableApi";
import { fetchSubjects } from "../services/subjectApi";
import Man from "../Assets/Man.png";
import learnImg from "../Assets/think.jpg";
import attentionImg from "../Assets/personal.jpg";
import testImg from "../Assets/unit.jpg";
import syllabusImg from "../Assets/syllubus.jpg";
import limitedImg from "../Assets/limited.jpg";
import successImg from "../Assets/exam.jpg";
import logo from "../Assets/logo1.png";


export default function LandingPage() {
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

  const [timetable, setTimetable] = useState([]);
  const [ttLoading, setTtLoading] = useState(true);
  const [ttError, setTtError] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");
  const [subjects, setSubjects] = useState([]);
  const [subLoading, setSubLoading] = useState(true);

  const gradeOrder = {
    "Grade 6": 0,
    "Grade 7": 1,
    "Grade 8": 2,
    "Grade 9": 3,
    "Grade 10": 4,
    "Grade 11": 5,
  };

  const dayOrder = {
    Monday: 0,
    Tuesday: 1,
    Wednesday: 2,
    Thursday: 3,
    Friday: 4,
    Saturday: 5,
    Sunday: 6,
  };

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

  function LiveDateTime() {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
      const timer = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(timer);
    }, []);

    return (
      <div className="text-xs sm:text-sm font-semibold text-slate-600">
        <div className="text-indigo-600 font-bold">
          {now.toLocaleTimeString()}
        </div>
        <div>
          {now.toLocaleDateString(undefined, {
            weekday: "short",
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </div>
      </div>
    );
  }

  useEffect(() => {
    let mounted = true;

    const loadTimetable = async () => {
      if (!selectedSubject) {
        setTimetable([]);
        setTtLoading(false);
        return;
      }

      try {
        setTtLoading(true);
        setTtError("");

        const data = await fetchTimetable(selectedSubject);

        //  SORT DATA HERE
        const sortedData = [...data].sort((a, b) => {
          return (
            (gradeOrder[a.grade] ?? 999) - (gradeOrder[b.grade] ?? 999) ||
            (dayOrder[a.day] ?? 999) - (dayOrder[b.day] ?? 999) ||
            timeToMinutes(a.time) - timeToMinutes(b.time)
          );
        });

        if (mounted) setTimetable(sortedData);

      } catch (err) {
        if (mounted) setTtError("Failed to load timetable.");
      } finally {
        if (mounted) setTtLoading(false);
      }
    };

    loadTimetable();

    return () => {
      mounted = false;
    };
  }, [selectedSubject]);

  useEffect(() => {
    const loadSubjects = async () => {
      try {
        setSubLoading(true);
        const data = await fetchSubjects();

        setSubjects(data);

        // OPTIONAL: auto-select first subject
        if (data.length > 0) {
          setSelectedSubject(data[0].name);
        }

      } catch (err) {
        console.error("Failed to load subjects");
      } finally {
        setSubLoading(false);
      }
    };

    loadSubjects();
  }, []);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100">

      {/* NAVBAR */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-10 py-3 flex items-center justify-between">

          {/* LEFT - LOGO + BRAND */}
          <div className="flex items-center gap-3">

            <img
              src={logo}
              alt="LUMORA Logo"
              className="h-10 sm:h-12 md:h-14 w-auto object-contain"
            />

            <div className="flex flex-col leading-tight">
              <span className="text-xl sm:text-2xl font-black text-indigo-900 tracking-wide">
                LUMORA
              </span>

              <span className="text-xs sm:text-sm text-slate-500 font-medium">
                Learn. Think. Master Every Subject.
              </span>
            </div>

          </div>

          {/* CENTER NAV LINKS */}
          <div className="hidden md:flex items-center gap-6 lg:gap-8 font-semibold text-slate-600 text-sm lg:text-base">

            <a href="#home" className="hover:text-indigo-600 transition">Home</a>

            <a href="#courses" className="hover:text-indigo-600 transition">Courses</a>

            <a href="#teachers" className="hover:text-indigo-600 transition">Teachers</a>

            <a href="#schedule" className="hover:text-indigo-600 transition">Schedule</a>

            <a href="#about" className="hover:text-indigo-600 transition">About</a>

            <a href="#contact" className="hover:text-indigo-600 transition">Contact</a>

          </div>

          {/* RIGHT - DATE & TIME */}
          <div className="hidden sm:block text-right">
            <LiveDateTime />
          </div>

        </div>
      </nav>

      {/* HERO */}
      <section id="home" className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-10 pb-5">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">

          {/* LEFT */}
          <div className="lg:col-span-5 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black leading-tight">
              Master <span className="text-indigo-600">Every Subject</span>
              <br />
              with Clarity and <br />
              Confidence
            </h1>

            <p className="mt-5 text-slate-500 text-base sm:text-lg">
              Interactive learning experiences designed for school success.
              Learn through structured lessons, guided practice, and real-time problem solving — all in one platform.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6">
              <button className="bg-amber-400 text-slate-900 px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-black w-full sm:w-auto">
                JOIN CLASS
              </button>

              <button className="flex items-center gap-3 font-bold">
                <div className="bg-indigo-600 p-2 rounded-full text-white">
                  <Play size={18} fill="currentColor" />
                </div>
                See how it works?
              </button>
            </div>
          </div>

          {/* MIDDLE LOGIN */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="w-full max-w-sm sm:max-w-md">
              <LoginForm
                title="Login"
                subtitle="Sign in to access the dashboard"
                onSuccess={() => { }}
              />
            </div>
          </div>

          {/* RIGHT IMAGE */}
          <div className="lg:col-span-3 flex justify-center">
            <img
              src={Man}
              alt="Student"
              className="w-40 sm:w-56 md:w-72 lg:w-full object-contain"
            />
          </div>

        </div>

        <div className="mt-6 text-center">
          <h2 className="text-lg sm:text-xl font-bold text-yellow-600">
            " One Platform. All Subjects. Unlimited Learning "
          </h2>
        </div>
      </section>

      {/* STATS */}
      <div className="bg-indigo-600 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap justify-center gap-40 text-white text-center">
          <div>
            <div className="text-3xl sm:text-4xl font-black">6 - 11</div>
            <div>Grade Levels</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">98%</div>
            <div>Exam Success</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">150 +</div>
            <div>Students</div>
          </div>
          <div>
            <div className="text-3xl sm:text-4xl font-black">100%</div>
            <div>Syllabus Covered</div>
          </div>
        </div>
      </div>

      {/* WHY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-2xl md:text-4xl font-black italic">
            Why we are <span className="text-indigo-600 underline">best from others?</span>
          </h2>
          <p className="text-slate-500 mt-4 max-w-2xl mx-auto">
            Student-centered learning with simplified teaching methods designed for better understanding and exam success.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">

          {cards.map((c, i) => {
            const Icon = c.icon;

            return (
              <div
                key={i}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
              >

                {/* TOP GRADIENT STRIP */}
                <div className="h-2 bg-linear-to-r from-indigo-600 via-purple-500 to-pink-500" />

                {/* IMAGE BACKGROUND */}
                <img
                  src={c.image}
                  className="absolute inset-0 w-full h-full object-cover opacity-45 group-hover:opacity-30 transition"
                  alt=""
                />

                {/* CONTENT */}
                <div className="relative p-6">

                  {/* ICON + CHIP */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600">
                      <Icon size={22} />
                    </div>

                    <span className="text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full bg-slate-100 text-slate-600">
                      {c.chip}
                    </span>
                  </div>

                  {/* TITLE */}
                  <h3 className="text-xl font-black text-slate-900">
                    {c.title}
                  </h3>

                  {/* DESCRIPTION */}
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    {c.desc}
                  </p>

                  {/* FOOTER TAG */}
                  <div className="mt-5 flex items-center gap-2 text-xs font-bold text-indigo-600">
                    <span className="w-2 h-2 rounded-full bg-indigo-600"></span>
                    Theory & Exam Focus
                  </div>

                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* SUBJECTS SECTION */}
      <section id="courses" className="max-w-7xl mx-auto px-4 sm:px-6 py-16">

        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black">
            Our <span className="text-indigo-600">Subjects</span>
          </h2>

          <p className="text-slate-500 mt-3 max-w-4xl mx-auto text-sm sm:text-base">
            Comprehensive subject coverage designed for Grades 6–11 with theory,
            revision, and exam-focused learning.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">

          {subLoading && (
            <p className="col-span-full text-center text-slate-500">
              Loading subjects...
            </p>
          )}

          {!subLoading && subjects.map((sub, i) => {

            // Optional icon mapping
            const iconMap = {
              Mathematics: Calculator,
              Science: FlaskConical,
              English: BookOpen,
              History: Landmark,
              Geography: Globe,
              ICT: Monitor,
              Commerce: BarChart3,
              Civics: Scale,
            };

            const Icon = iconMap[sub.name] || BookOpen;

            return (
              <div
                key={sub._id}
                onClick={() => {
                  setSelectedSubject(sub.name);

                  document.getElementById("schedule")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className={`group cursor-pointer relative bg-white border rounded-xl p-5 text-center shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300
        ${selectedSubject === sub.name ? "ring-2 ring-indigo-500" : ""}`}
              >

                {/* ICON */}
                <div className="w-12 h-12 mx-auto flex items-center justify-center rounded-xl mb-3 bg-indigo-100 text-indigo-600">
                  <Icon size={22} />
                </div>

                {/* NAME */}
                <h3 className="font-semibold text-base text-slate-800">
                  {sub.name}
                </h3>

                {/* DESC */}
                <p className="text-xs text-slate-500 mt-1">
                  Theory classes, revision, and exam preparation.
                </p>

                {/* HOVER */}
                <div className="absolute inset-0 bg-white/40 backdrop-blur-xs flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition rounded-xl">
                  <span className="text-sm font-bold">View Timetable</span>
                </div>

              </div>
            );
          })}

        </div>
      </section>

      {/* TABLE */}
      <section id="schedule" className="max-w-5xl mx-auto px-4 sm:px-6 py-12">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl md:text-4xl font-black">
            {selectedSubject ? (
              <>
                {selectedSubject}{" "}Class
                <span className="text-indigo-600"> Timetable</span>
              </>
            ) : (
              <>
                Class <span className="text-indigo-600">Timetable</span>
              </>
            )}
          </h2>

          <p className="text-slate-500 mt-3 max-w-2xl mx-auto">
            Weekly structured learning schedule for Grades 6–11 covering theory and exam preparation.
          </p>
        </div>

        {/* TABLE WRAPPER */}
        <div className="overflow-x-auto rounded-3xl border border-slate-200 shadow-xl bg-white">

          <table className="w-full min-w-175 text-left">

            {/* HEADER */}
            <thead className="bg-linear-to-r from-indigo-600 to-indigo-500 text-white">
              <tr>
                <th className="px-6 py-2 text-sm font-black uppercase">Grade</th>
                <th className="px-6 py-2 text-sm font-black uppercase">Day</th>
                <th className="px-6 py-2 text-sm font-black uppercase">Time</th>
                <th className="px-6 py-2 text-sm font-black uppercase text-center">
                  Class Type
                </th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody className="divide-y divide-slate-100">

              {/* LOADING */}
              {ttLoading && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-slate-500 font-semibold">
                    Loading timetable...
                  </td>
                </tr>
              )}

              {/* ERROR */}
              {!ttLoading && ttError && (
                <tr>
                  <td colSpan="4" className="px-6 py-10 text-center text-red-600 font-bold">
                    {ttError}
                  </td>
                </tr>
              )}

              {/* NO SUBJECT (only if you ever reset it) */}
              {!selectedSubject && !ttLoading && !ttError && (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-semibold">
                    Please select a subject to view timetable 📚
                  </td>
                </tr>
              )}

              {/* DATA */}
              {!ttLoading &&
                !ttError &&
                selectedSubject &&
                timetable.length > 0 &&
                timetable.map((r, index) => (
                  <tr
                    key={r._id}
                    className={`hover:bg-indigo-50 transition ${index % 2 === 0 ? "bg-white" : "bg-slate-50"
                      }`}
                  >
                    {/* Grade */}
                    <td className="px-5 py-3">
                      <span className="px-3 py-1 rounded-full text-xs font-black bg-indigo-100 text-indigo-700">
                        {r.grade}
                      </span>
                    </td>

                    {/* Day */}
                    <td className="px-6 py-2 font-semibold text-slate-700">
                      {r.day}
                    </td>

                    {/* Time */}
                    <td className="px-6 py-2 font-bold text-slate-900">
                      {r.time}
                    </td>

                    {/* Class Type */}
                    <td className="px-6 py-2 text-center">
                      <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-700">
                        {r.classType || "Theory & Paper"}
                      </span>
                    </td>
                  </tr>
                ))}

              {/* NO DATA */}
              {selectedSubject &&
                !ttLoading &&
                !ttError &&
                timetable.length === 0 && (
                  <tr>
                    <td colSpan="4" className="px-6 py-12 text-center text-slate-500 font-semibold">
                      No timetable available for{" "}
                      <span className="text-indigo-600 font-bold">
                        {selectedSubject}
                      </span>
                    </td>
                  </tr>
                )}

            </tbody>
          </table>
        </div>

        {/* FOOT NOTE */}
        <div className="mt-6 text-center text-slate-500 text-sm font-medium">
          ✔ Theory lessons • ✔ Exam paper discussions • ✔ Early syllabus completion
        </div>

      </section>

      {/* FOOTER */}
      <footer id="contact" className="bg-slate-900 text-white mt-10">
        <div className="max-w-6xl mx-auto px-4 py-10 grid sm:grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <h2 className="text-2xl font-black text-indigo-400">LUMORA</h2>
            <p className="text-sm text-slate-400 mt-2">
              One Platform. All Subjects. Unlimited Learning.
            </p>
          </div>

          <div>
            <h3 className="font-bold mb-2">About</h3>
            <p className="text-sm text-slate-400">Our Story</p>
            <p className="text-sm text-slate-400">Classes</p>
            <p className="text-sm text-slate-400">Teachers</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Company</h3>
            <p className="text-sm text-slate-400">Membership</p>
            <p className="text-sm text-slate-400">Privacy</p>
            <p className="text-sm text-slate-400">FAQ</p>
          </div>

          <div>
            <h3 className="font-bold mb-2">Support</h3>
            <p className="text-sm text-slate-400">info@lumora.com</p>
            <p className="text-sm text-slate-400">+94 76 3933 586</p>
          </div>
        </div>

        <div className="text-center text-slate-500 py-4 border-t border-slate-800">
          © 2026 LUMORA
        </div>
      </footer>

    </div>
  );
}