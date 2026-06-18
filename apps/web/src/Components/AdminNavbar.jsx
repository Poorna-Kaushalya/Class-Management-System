import { useRef, useEffect, useState } from "react";
import logo from "../Assets/logo1.png";
import {
  ChevronDown,
  User,
  Settings,
  LogOut,
  Users,
  BookOpen,
  Layers,
} from "lucide-react";

import { getCurrentUser } from "../services/authApi";

export default function AdminNavbar({
  activeTab,
  setActiveTab,
  onLogout,
}) {
  const tabs = [
    { name: "Timetable", icon: BookOpen },
    { name: "Students", icon: Users },
    { name: "Teachers", icon: Users },
     { name: "Subjects", icon: Layers },
    { name: "Settings", icon: Settings },
  ];

  const containerRef = useRef(null);
  const dropdownRef = useRef(null);

  const [indicatorStyle, setIndicatorStyle] = useState({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // USER STATE
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // Fetch logged user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getCurrentUser();

        // 👇 adjust based on API response
        setUser({
          name: data.fullName || data.name,
          email: data.email,
        });
      } catch (err) {
        console.error("User fetch failed");
      }
    };

    fetchUser();
  }, []);

  // Sliding indicator
  useEffect(() => {
    const activeEl = containerRef.current?.querySelector(
      `[data-tab="${activeTab}"]`
    );

    if (activeEl) {
      setIndicatorStyle({
        width: activeEl.offsetWidth,
        left: activeEl.offsetLeft,
      });
    }
  }, [activeTab]);

  // Close on outside click
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on scroll
  useEffect(() => {
    function handleScroll() {
      setDropdownOpen(false);
    }

    window.addEventListener("scroll", handleScroll);
    return () =>
      window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close on ESC key
  useEffect(() => {
    function handleKey(e) {
      if (e.key === "Escape") {
        setDropdownOpen(false);
      }
    }

    window.addEventListener("keydown", handleKey);
    return () =>
      window.removeEventListener("keydown", handleKey);
  }, []);

  const initial = user?.name?.charAt(0)?.toUpperCase() || "A";

  return (
    <div className="sticky top-0 z-50 bg-white/80 backdrop-blur border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">

        {/* LEFT */}
        <div className="flex items-center gap-3">
          <img src={logo} alt="LUMORA" className="h-9 w-auto" />

          <div className="leading-tight">
            <h1 className="text-base font-black text-slate-900">
              Admin Dashboard
            </h1>
            <p className="text-xs text-slate-500">
              LUMORA Management
            </p>
          </div>
        </div>

        {/* CENTER */}
        <div
          ref={containerRef}
          className="relative hidden md:flex items-center gap-6"
        >
          {tabs.map((tab) => {
            const active = activeTab === tab.name;
            const Icon = tab.icon;

            return (
              <button
                key={tab.name}
                data-tab={tab.name}
                onClick={() => setActiveTab(tab.name)}
                className={`flex items-center gap-1 relative z-10 px-2 py-2 text-sm font-semibold transition
                  ${
                    active
                      ? "text-indigo-600"
                      : "text-slate-500 hover:text-indigo-500"
                  }`}
              >
                <Icon size={16} />
                {tab.name}
              </button>
            );
          })}

          {/* Sliding Indicator */}
          <span
            className="absolute bottom-0 h-0.75 bg-indigo-600 rounded-full transition-all duration-300"
            style={indicatorStyle}
          />
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-4 relative" ref={dropdownRef}>

          {/* USER NAME */}
          <div className="hidden sm:flex flex-col text-right">
            <span className="text-sm font-semibold text-slate-800">
              {user.name || "Loading..."}
            </span>
            <span className="text-xs text-slate-500">
              {user.email}
            </span>
          </div>

          {/* AVATAR */}
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-2 bg-slate-100 hover:bg-slate-200 px-2 py-1.5 rounded-xl transition"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-bold">
              {initial}
            </div>
            <ChevronDown size={16} className="text-slate-600" />
          </button>

          {/* DROPDOWN */}
          <div
            className={`absolute right-0 top-12 w-56 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-50
            transition-all duration-200 origin-top-right
            ${
              dropdownOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            }`}
          >
            <div className="px-4 py-3 border-b">
              <p className="text-sm font-bold text-slate-800">
                {user.name}
              </p>
              <p className="text-xs text-slate-500">
                {user.email}
              </p>
            </div>

            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100">
              <User size={16} /> Profile
            </button>

            <button className="flex items-center gap-2 w-full px-4 py-2 text-sm hover:bg-slate-100">
              <Settings size={16} /> Settings
            </button>

            <div className="border-t" />

            <button
              onClick={onLogout}
              className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50"
            >
              <LogOut size={16} /> Logout
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}