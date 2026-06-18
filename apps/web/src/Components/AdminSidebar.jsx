import { useState, useEffect } from "react";
import {
    BookOpen,
    Users,
    Settings,
    ChevronLeft,
    ChevronRight,
    Edit,
    Eye,
    EyeOff,
    LogOut,
    Layers,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { getCurrentUser, updateUser } from "../services/authApi";
import logo from "../Assets/logo1.png";

export default function AdminSidebar({ activeTab, setActiveTab }) {
    const [collapsed, setCollapsed] = useState(false);
    const [user, setUser] = useState({});
    const [editOpen, setEditOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const [form, setForm] = useState({
        fullName: "",
        email: "",
        role: "STUDENT",
        phone: "",
        password: "",
    });

    const menu = [
        { name: "Timetable", icon: BookOpen },
        { name: "Students", icon: Users },
        { name: "Teachers", icon: Users },
        { name: "Subjects", icon: Layers },
        { name: "Settings", icon: Settings },
    ];

    // ================= FETCH USER =================
    useEffect(() => {
        async function load() {
            try {
                const data = await getCurrentUser();

                setUser(data);

                setForm({
                    fullName: data.name || "",
                    email: data.email || "",
                    role: data.role || "STUDENT",
                    phone: data.phone ?? "",
                    password: "",
                });
            } catch {
                toast.error("Failed to load user");
            }
        }
        load();
    }, []);

    const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

    // ================= UPDATE =================
    async function handleUpdate() {
        try {
            setLoading(true);
            const res = await updateUser(form);
            setUser(res.user);
            toast.success("Profile updated");
            setEditOpen(false);
        } catch {
            toast.error("Update failed");
        } finally {
            setLoading(false);
        }
    }

    // ================= LOGOUT =================
    function handleLogout() {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("role");
        window.location.href = "/";
    }

    return (
        <>
            {/* ================= SIDEBAR ================= */}
            <motion.div
                animate={{ width: collapsed ? 70 : 220 }}
                transition={{ duration: 0.25 }}
                className="h-screen bg-white border-r flex flex-col justify-between relative"
            >
                {/* TOGGLE BUTTON */}
                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="absolute -right-3 top-6 bg-white border shadow-md p-1 rounded-full hover:bg-slate-100 z-50"
                >
                    {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
                </button>

                {/* ================= TOP ================= */}
                <div className="p-4 space-y-4">
                    {/* LOGO */}
                    {!collapsed ? (
                        <div className="flex flex-col items-center">
                            <img src={logo} className="h-28 object-contain" />
                            <span className="font-black text-indigo-600 text-xl mt-2">
                                LUMORA
                            </span>
                            <span className="text-xs text-slate-400">
                                Admin Panel
                            </span>
                        </div>
                    ) : (
                        <div className="flex justify-center">
                            <img src={logo} className="h-8" />
                        </div>
                    )}

                    <div className="border-t" />

                    {/* MENU */}
                    <div className="space-y-2">
                        {menu.map((item) => {
                            const Icon = item.icon;
                            const active = activeTab === item.name;

                            return (
                                <button
                                    key={item.name}
                                    onClick={() => setActiveTab(item.name)}
                                    className={`
                    flex items-center gap-3 px-3 py-2 rounded-xl w-full
                    transition-all group relative
                    ${active
                                            ? "bg-indigo-600 text-white shadow"
                                            : "hover:bg-indigo-50 text-slate-600"
                                        }
                  `}
                                >
                                    <Icon size={18} />

                                    {!collapsed && item.name}

                                    {/* Tooltip (when collapsed) */}
                                    {collapsed && (
                                        <span className="absolute left-14 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                                            {item.name}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* ================= PROFILE ================= */}
                <div className="border-t p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
                            {initial}
                        </div>

                        {!collapsed && (
                            <div className="flex-1">
                                <p className="text-sm font-semibold">{user.name}</p>
                                <p className="text-xs text-slate-500">{user.email}</p>

                                <span className="text-[10px] bg-indigo-100 text-indigo-600 px-2 py-0.5 rounded-full">
                                    {user.role}
                                </span>
                            </div>
                        )}

                        {!collapsed && (
                            <button onClick={() => setEditOpen(true)}>
                                <Edit size={16} />
                            </button>
                        )}
                    </div>

                    {/* BUTTONS */}
                    {!collapsed && (
                        <div className="space-y-2">
                            <button className="w-full bg-slate-100 hover:bg-slate-200 py-2 rounded-lg text-sm">
                                Help Center
                            </button>

                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center justify-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-lg text-sm font-semibold"
                            >
                                <LogOut size={16} />
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </motion.div>

            {/* ================= MODAL ================= */}
            <AnimatePresence>
                {editOpen && (
                    <motion.div
                        className="fixed inset-0 bg-black/50 backdrop-blur-md flex items-center justify-center z-50"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        <motion.div
                            className="w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl p-6 space-y-5 border border-white/40"
                            initial={{ scale: 0.85, y: 60 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.85, y: 60 }}
                            transition={{ duration: 0.25 }}
                        >
                            {/* HEADER */}
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-bold text-slate-800">
                                    Edit Profile
                                </h2>

                                <button
                                    onClick={() => setEditOpen(false)}
                                    className="text-slate-400 hover:text-red-500 text-lg"
                                >
                                    ✕
                                </button>
                            </div>

                            {/* FORM */}
                            <div className="space-y-4">

                                {/* FULL NAME */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={form.fullName}
                                        onChange={(e) =>
                                            setForm({ ...form, fullName: e.target.value })
                                        }
                                        className="peer w-full border rounded-xl px-3 pt-5 pb-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <label className="absolute left-3 top-2 text-xs text-slate-500 transition-all peer-focus:text-indigo-600">
                                        Full Name
                                    </label>
                                </div>

                                {/* EMAIL */}
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={form.email}
                                        onChange={(e) =>
                                            setForm({ ...form, email: e.target.value })
                                        }
                                        className="peer w-full border rounded-xl px-3 pt-5 pb-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <label className="absolute left-3 top-2 text-xs text-slate-500 peer-focus:text-indigo-600">
                                        Email Address
                                    </label>
                                </div>

                                {/* PHONE */}
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={form.phone || ""} 
                                        onChange={(e) =>
                                            setForm({ ...form, phone: e.target.value })
                                        }
                                        className="peer w-full border rounded-xl px-3 pt-5 pb-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <label className="absolute left-3 top-2 text-xs text-slate-500 peer-focus:text-indigo-600">
                                        Phone Number
                                    </label>
                                </div>

                                {/* PASSWORD */}
                                <div className="relative">
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        value={form.password}
                                        onChange={(e) =>
                                            setForm({ ...form, password: e.target.value })
                                        }
                                        className="peer w-full border rounded-xl px-3 pt-5 pb-2 pr-10 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    />
                                    <label className="absolute left-3 top-2 text-xs text-slate-500 peer-focus:text-indigo-600">
                                        New Password
                                    </label>

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                                    >
                                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                    </button>
                                </div>

                                {/* ROLE */}
                                <div className="relative">
                                    <select
                                        value={form.role}
                                        onChange={(e) =>
                                            setForm({ ...form, role: e.target.value })
                                        }
                                        className="w-full border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                                    >
                                        <option value="ADMIN">ADMIN</option>
                                        <option value="STUDENT">STUDENT</option>
                                    </select>
                                </div>
                            </div>

                            {/* ACTIONS */}
                            <div className="flex justify-end gap-3 pt-3">
                                <button
                                    onClick={() => setEditOpen(false)}
                                    className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-sm"
                                >
                                    Cancel
                                </button>

                                <button
                                    onClick={handleUpdate}
                                    disabled={loading}
                                    className="px-5 py-2 rounded-xl bg-linear-to-r from-indigo-600 to-purple-600 text-white text-sm font-semibold hover:opacity-90 disabled:opacity-50"
                                >
                                    {loading ? "Saving..." : "Save Changes"}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}