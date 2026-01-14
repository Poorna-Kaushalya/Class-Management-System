import { useState } from "react";
import {
    Play,
    CheckCircle2,
    GraduationCap,
    Users,
    BookOpen,
    Clock,
    Shield,
    Star,
    Facebook,
    Twitter,
    Instagram,
    Linkedin,
} from "lucide-react";

import LoginForm from "../components/LoginForm";

import Man from "../Assets/Man.png";
import learnImg from "../Assets/think.jpg";
import attentionImg from "../Assets/personal.jpg";
import testImg from "../Assets/unit.jpg";
import syllabusImg from "../Assets/syllubus.jpg";
import limitedImg from "../Assets/limited.jpg";
import successImg from "../Assets/exam.jpg";

export default function LandingPage() {
    const cards = [
        {
            title: "Learn Complex Topics Simply",
            icon: <GraduationCap />,
            color: "bg-purple-100 text-purple-600",
            desc: "Complex concepts are broken down into simple, easy-to-understand explanations suitable for every learner.",
            image: learnImg,
        },
        {
            title: "Personal Attention",
            icon: <Users />,
            color: "bg-pink-100 text-pink-600",
            desc: "Each student receives individual attention to identify weaknesses and improve performance effectively.",
            image: attentionImg,
        },
        {
            title: "Regular Unit Tests",
            icon: <CheckCircle2 />,
            color: "bg-blue-100 text-blue-600",
            desc: "Frequent unit tests help track progress, strengthen understanding, and prepare students for exams.",
            image: testImg,
        },
        {
            title: "Syllabus Covered Early",
            icon: <BookOpen />,
            color: "bg-emerald-100 text-emerald-600",
            desc: "The complete O/L syllabus is covered at least 4 months before exams, allowing ample revision time.",
            image: syllabusImg,
        },
        {
            title: "Limited Students per Class",
            icon: <Clock />,
            color: "bg-orange-100 text-orange-600",
            desc: "Small class sizes ensure focused learning, better interaction, and effective doubt clarification.",
            image: limitedImg,
        },
        {
            title: "O/L Exam Success",
            icon: <Shield />,
            color: "bg-amber-100 text-amber-600",
            desc: "A structured learning approach that supports every student to pass the G.C.E. Ordinary Level examination.",
            image: successImg,
        },
    ];

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 relative">
            {/* 1. Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-4 max-w-7xl mx-auto">
                <div className="text-2xl font-black text-indigo-700">Education</div>

                <div className="hidden md:flex gap-8 font-medium text-slate-600">
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

                <div className="flex items-center gap-4">
                    <button className="font-bold text-slate-800 px-4 hover:text-indigo-600 transition-colors">
                        Sign In
                    </button>
                    <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition-all hover:shadow-lg active:scale-95">
                        SIGN UP
                    </button>
                </div>
            </nav>

            {/* 2. Hero Section (3 columns) */}
            <section className="relative max-w-8xl px-0 md:px-20 overflow-hidden top-16">
                {/* Decorative background blob */}
                <div className="absolute -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-70 -z-10" />

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-0 items-center">
                    {/* LEFT: TEXT */}
                    <div className="lg:col-span-2">
                        <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
                            Master <span className="text-indigo-600">Mathematics</span>
                            <br />
                            with Clarity and{" "}
                            <span className="relative inline-block">
                                Precision
                                <span className="absolute bottom-2 left-0 w-full h-9 bg-amber-200 -z-10" />
                            </span>
                        </h1>

                        <p className="text-slate-500 text-lg mb-8 max-w-lg leading-relaxed">
                            Interactive calculus, algebra, and geometry modules. Master complex
                            theorems through visualized logic and real-time problem-solving.
                        </p>

                        <div className="flex items-center gap-6">
                            <button className="bg-amber-400 text-slate-900 px-8 py-4 rounded-xl font-black hover:bg-amber-500 transition-all shadow-[0_10px_20px_-5px_rgba(251,191,36,0.4)] hover:-translate-y-1">
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

                    {/* MIDDLE: LOGIN CARD (ALWAYS VISIBLE) */}
                    <div className="lg:col-span-1 flex justify-center relative -left-16" >
                        <div className="w-600">
                            <LoginForm
                                title="Login"
                                subtitle="Sign in to access the dashboard"
                                onSuccess={() => {
                                }}
                            />
                        </div>
                    </div>

                    {/* RIGHT: HERO IMAGE */}
                    <div className="lg:col-span-1 relative flex justify-center items-end">

                        <div className="absolute right-10 top-10 h-96 w-96  opacity-80 -z-10" />
                        <img
                            src={Man}
                            alt="Student"
                            className="h-130 md:h-105 object-contain object-bottom"

                        />
                    </div>
                </div>
            </section>

            {/* 3. Stats Bar */}
            <div className="relative top-24 bg-indigo-600 py-8 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.626 10.5H60v2H54.626L47.126 2H49.954L54.626 10.5z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-around text-white text-center gap-8">
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">6 - 11</div>
                        <div className="text-indigo-100 font-medium">Grade Levels</div>
                    </div>
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">98%</div>
                        <div className="text-indigo-100 font-medium">Exam Success</div>
                    </div>
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">Step-by-step</div>
                        <div className="text-indigo-100 font-medium">
                            mathematical derivations
                        </div>
                    </div>
                </div>
            </div>

            {/* 4. Why We Are Best */}
            <section className="relative top-24 max-w-7xl mx-auto px-6 md:px-10 py-14 text-center">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-50 rounded-full blur-3xl -z-10" />

                <h2 className="text-5xl font-black mb-6 italic tracking-tight">
                    Why we are{" "}
                    <span className="text-indigo-600 underline decoration-amber-400">
                        best from others?
                    </span>
                </h2>

                <p className="text-slate-500 max-w-2xl mx-auto mb-16 text-lg">
                    We focus on student-centered learning with simplified teaching methods,
                    continuous evaluation, and personal attention to ensure academic success.
                </p>

                <div className="grid md:grid-cols-3 gap-10 text-left">
                    {cards.map((item, i) => (
                        <div
                            key={i}
                            className="relative p-10 rounded-4xl bg-white border border-slate-100
              shadow-[0_4px_20px_rgba(0,0,0,0.03)]
              hover:shadow-2xl hover:shadow-indigo-100
              transition-all duration-300 group hover:-translate-y-2
              overflow-hidden"
                        >
                            <img
                                src={item.image}
                                alt=""
                                className="absolute inset-0 h-full w-full object-cover opacity-95
                group-hover:opacity-25 transition-opacity duration-500"
                            />
                            <div className="absolute inset-0 bg-white/30" />

                            <div className="relative z-10">
                                <div
                                    className={`${item.color} w-16 h-16 rounded-[20px]
                  flex items-center justify-center mb-8
                  group-hover:rotate-6 transition-transform shadow-inner`}
                                >
                                    {item.icon}
                                </div>

                                <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-700 transition-colors">
                                    {item.title}
                                </h3>

                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* Class Timetable */}
            <section className="max-w-6xl mx-auto px-6 md:px-10 py-24">
                <div className="mb-12 text-center">
                    <h2 className="text-5xl font-black mb-4">
                        Class <span className="text-indigo-600">Timetable</span>
                    </h2>
                    <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                        Weekly Mathematics classes for Grades 6–11 covering both theory lessons
                        and paper-based exam practice.
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
                            {[
                                { grade: "Grade 6", day: "Thursday", time: "4:00 PM – 6:00 PM" },
                                { grade: "Grade 7", day: "Wednesday", time: "4:00 PM – 6:30 PM" },
                                { grade: "Grade 8", day: "Saturday", time: "7:00 AM – 9:30 AM" },
                                { grade: "Grade 9", day: "Sunday", time: "1:30 PM – 4:00 PM" },
                                { grade: "Grade 10", day: "Saturday", time: "11:00 AM – 3:00 PM" },
                                { grade: "Grade 11", day: "Friday", time: "7:00 PM – 10:00 PM" },
                                { grade: "Grade 11", day: "Saturday", time: "3:00 PM – 6:30 PM" },
                            ].map((row, i) => (
                                <tr key={i} className="hover:bg-indigo-50 transition">
                                    <td className="px-6 py-4 font-black text-indigo-700">
                                        {row.grade}
                                    </td>
                                    <td className="px-6 py-4 font-semibold text-slate-700">
                                        {row.day}
                                    </td>
                                    <td className="px-6 py-4 text-slate-600 font-semibold">
                                        {row.time}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="px-4 py-2 rounded-full text-xs font-black uppercase bg-amber-100 text-amber-700">
                                            Theory & Paper
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="mt-8 text-center text-slate-500 font-medium">
                    ✔ Theory lessons &nbsp; • &nbsp; ✔ Exam paper discussions &nbsp; • &nbsp;
                    ✔ O/L syllabus completed early
                </div>
            </section>


            {/* 6. Footer */}
            <footer className="bg-slate-900 text-white pt-8 pb-6 relative overflow-hidden ">
                <div className="absolute bottom-0 right-0 w-96 h-72 bg-indigo-500/10 rounded-full blur-[120px]" />

                <div className="relative z-20 max-w-5xl mx-auto px-6 md:px-10 grid md:grid-cols-4 gap-8">
                    <div className="col-span-1 relative -left-24">
                        <div className="text-3xl font-black mb-4 text-indigo-400">
                            Education
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            A premium class management system designed for the modern teacher and
                            student. Built for reliability and ease of use.
                        </p>
                        <div className="flex gap-5">
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

                    <div className="relative left-8">
                        <h4 className="font-bold text-xl mb-8 border-b border-slate-800 pb-2 inline-block">
                            About
                        </h4>
                        <ul className="text-slate-400 space-y-4">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Our Story
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Courses
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Teachers
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Academic
                            </li>
                        </ul>
                    </div>

                    <div className="relative left-8">
                        <h4 className="font-bold text-xl mb-8 border-b border-slate-800 pb-2 inline-block">
                            Company
                        </h4>
                        <ul className="text-slate-400 space-y-4">
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Membership
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Terms of Service
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                Privacy
                            </li>
                            <li className="hover:text-white transition-colors cursor-pointer">
                                FAQ
                            </li>
                        </ul>
                    </div>

                    <div className="relative left-12">
                        <h4 className="font-bold text-xl mb-8 border-b border-slate-800 pb-2 inline-block">
                            Support
                        </h4>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                            <p className="text-sm text-slate-300 mb-2">Email us at:</p>
                            <p className="font-bold text-indigo-400 mb-4">hello@education.com</p>
                            <p className="text-sm text-slate-300">Call anytime:</p>
                            <p className="font-bold text-indigo-400">+1 (555) 000-1234</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-2 mt-6">
                    © 2026 Education Dashboard Design. Built with passion for better learning.
                </div>
            </footer>
        </div>
    );
}
