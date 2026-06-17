import { useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
import AdminSidebar from "../Components/AdminSidebar";
import AdminTimetableEditor from "../Components/AdminTimetableEditor";
import AdminStudentsPanel from "../Components/AdminStudentsPanel";

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("Timetable");

  function logout() {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("role");
    window.location.href = "/";
  }

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">

      {/* SIDEBAR (no scroll) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* RIGHT SIDE */}
      <div className="flex-1 flex flex-col">

        {/* NAVBAR (fixed inside layout) */}
        <div className="shrink-0">
          <AdminNavbar
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onLogout={logout}
          />
        </div>

        {/* SCROLLABLE CONTENT ONLY */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === "Timetable" && <AdminTimetableEditor />}
          {activeTab === "Students" && <AdminStudentsPanel />}
        </div>

      </div>
    </div>
  );
}