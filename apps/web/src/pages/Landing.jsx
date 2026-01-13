import React from "react";
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

import Man from "../Assets/Man.png";

export default function LandingPage() {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-100 relative">
            {/* 1. Navbar */}
            <nav className="relative z-50 flex items-center justify-between px-6 md:px-10 py-6 max-w-7xl mx-auto">
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

            {/* 2. Hero Section */}
            <section className="relative max-w-7xl mx-auto px-6 md:px-16 py-5 flex flex-col lg:flex-row items-center overflow-hidden">
                {/* Decorative Background Element 1 */}
                <div className="absolute -top-20 -left-24 w-96 h-96 bg-indigo-50 rounded-full blur-3xl opacity-70 -z-10" />

                {/* LEFT TEXT */}
                <div className="lg:w-1/2 z-5">
                    {/* Hero Section Update */}
                    <h1 className="text-4xl md:text-5xl font-black leading-tight mb-4 tracking-tight">
                        Master <span className="text-indigo-600">Mathematics</span><br />
                        with Clarity and <span className="relative inline-block">Precision<span className="absolute bottom-2 left-0 w-full h-9 bg-amber-200 -z-10"></span></span>
                    </h1>
                    <p className="text-slate-500 text-lg mb-10 max-w-lg leading-relaxed">
                        Interactive calculus, algebra, and geometry modules. Master complex theorems through visualized logic and real-time problem-solving.
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

                {/* RIGHT HERO – FULL LENGTH IMAGE */}
                <div className="lg:w-1/2 mt-0 lg:mt-0 relative flex justify-center items-end">

                    {/* Yellow decorative blob */}
                    <div className="absolute right-24 top-20 h-85 w-85 rounded-[140px] bg-amber-200 opacity-80 -z-10" />

                    {/* Full-length hero image */}
                    <img
                        src={Man}
                        alt="Student"
                        className="h-125 md:h-100 lg:h-120 object-contain object-bottom"
                    />
                </div>

            </section>

            {/* 3. Stats Bar */}
            <div className="relative bg-indigo-600 py-8 overflow-hidden">
                <div
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M54.626 10.5H60v2H54.626L47.126 2H49.954L54.626 10.5z' fill='%23ffffff' fill-opacity='1' fill-rule='evenodd'/%3E%3C/svg%3E")`,
                    }}
                />
                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 flex flex-wrap justify-around text-white text-center gap-8">
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">150+</div>
                        <div className="text-indigo-100 font-medium">Total Courses</div>
                    </div>
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">250</div>
                        <div className="text-indigo-100 font-medium">Total Instructors</div>
                    </div>
                    <div className="min-w-37.5">
                        <div className="text-4xl font-black mb-1">35K+</div>
                        <div className="text-indigo-100 font-medium">Total Students</div>
                    </div>
                </div>
            </div>

            {/* 4. Why We Are Best Section */}
            <section className="relative max-w-7xl mx-auto px-6 md:px-10 py-10 text-center">
                <div className="absolute top-1/2 left-0 w-72 h-72 bg-purple-50 rounded-full blur-3xl -z-10" />

                <h2 className="text-5xl font-black mb-6 italic tracking-tight">
                    Why we are{" "}
                    <span className="text-indigo-600 underline decoration-amber-400">
                        best from others?
                    </span>
                </h2>

                <p className="text-slate-500 max-w-2xl mx-auto mb-20 text-lg">
                    We provide a comprehensive ecosystem for learning, tracking, and
                    succeeding in your professional journey.
                </p>

                <div className="grid md:grid-cols-3 gap-10 text-left">
                    {[
                        {
                            title: "Digital Platform",
                            icon: <GraduationCap />,
                            color: "bg-purple-100 text-purple-600",
                        },
                        {
                            title: "Optimal Ideation",
                            icon: <BookOpen />,
                            color: "bg-emerald-100 text-emerald-600",
                        },
                        {
                            title: "Favorable Testing",
                            icon: <CheckCircle2 />,
                            color: "bg-blue-100 text-blue-600",
                        },
                        {
                            title: "Effective Interaction",
                            icon: <Users />,
                            color: "bg-pink-100 text-pink-600",
                        },
                        {
                            title: "Flexible Time",
                            icon: <Clock />,
                            color: "bg-orange-100 text-orange-600",
                        },
                        {
                            title: "Reliable",
                            icon: <Shield />,
                            color: "bg-amber-100 text-amber-600",
                        },
                    ].map((item, i) => (
                        <div
                            key={i}
                            className="p-10 rounded-4xl bg-white border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.03)] hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-300 group hover:-translate-y-2"
                        >
                            <div
                                className={`${item.color} w-16 h-16 rounded-[20px] flex items-center justify-center mb-8 group-hover:rotate-6 transition-transform shadow-inner`}
                            >
                                {item.icon}
                            </div>
                            <h3 className="text-2xl font-black mb-4 group-hover:text-indigo-700 transition-colors">
                                {item.title}
                            </h3>
                            <p className="text-slate-500 leading-relaxed">
                                Experience a modern approach to education with our state-of-the-art
                                interaction modules.
                            </p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 5. Effortless Enrollment */}
            <section className="max-w-7xl mx-auto px-6 md:px-10 py-24 flex flex-col lg:flex-row items-center gap-20">
                <div className="lg:w-1/2 relative">
                    <div className="w-full h-137.5 bg-amber-400 rounded-[40px] overflow-hidden shadow-2xl relative">
                        <img
                            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1000&auto=format&fit=crop"
                            alt="Students Studying"
                            className="w-full h-full object-cover mix-blend-multiply opacity-90"
                        />
                    </div>

                    <div className="absolute -bottom-10 -right-6 bg-white p-8 rounded-3xl shadow-2xl border border-slate-50">
                        <div className="flex items-center gap-4">
                            <div className="bg-amber-100 text-amber-500 p-3 rounded-2xl">
                                <Star fill="currentColor" size={24} />
                            </div>
                            <div>
                                <div className="text-2xl font-black">4.9/5.0</div>
                                <div className="text-sm font-bold text-slate-400 uppercase tracking-widest">
                                    Student Reviews
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:w-1/2">
                    <h2 className="text-5xl font-black mb-10">
                        Effortless <span className="text-indigo-600">Enrollment</span>
                    </h2>

                    <div className="space-y-5">
                        {[
                            "Choose a Program",
                            "Enroll and Submit Documents",
                            "Choose a Date and Time",
                            "Pay an Instructor",
                            "Then Start",
                        ].map((step, i) => (
                            <div
                                key={i}
                                className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-slate-100 font-bold hover:shadow-lg hover:border-indigo-200 transition-all cursor-pointer group"
                            >
                                <span className="flex items-center justify-center w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                    0{i + 1}
                                </span>
                                <span className="text-lg text-slate-700 group-hover:text-indigo-900 transition-colors">
                                    {step}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 6. Footer */}
            <footer className="bg-slate-900 text-white pt-24 pb-12 relative overflow-hidden">
                <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px]" />

                <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 grid md:grid-cols-4 gap-16 mb-24">
                    <div className="col-span-1">
                        <div className="text-3xl font-black mb-8 text-indigo-400">
                            Education
                        </div>
                        <p className="text-slate-400 leading-relaxed mb-8">
                            A premium class management system designed for the modern teacher
                            and student. Built for reliability and ease of use.
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

                    <div>
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

                    <div>
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

                    <div>
                        <h4 className="font-bold text-xl mb-8 border-b border-slate-800 pb-2 inline-block">
                            Support
                        </h4>
                        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-800">
                            <p className="text-sm text-slate-300 mb-2">Email us at:</p>
                            <p className="font-bold text-indigo-400 mb-4">
                                hello@education.com
                            </p>
                            <p className="text-sm text-slate-300">Call anytime:</p>
                            <p className="font-bold text-indigo-400">+1 (555) 000-1234</p>
                        </div>
                    </div>
                </div>

                <div className="relative z-10 text-center text-slate-500 text-sm border-t border-slate-800 pt-12">
                    © 2026 Education Dashboard Design. Built with passion for better
                    learning.
                </div>
            </footer>
        </div>
    );
}
