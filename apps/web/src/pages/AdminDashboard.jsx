import { useState } from "react";
import AdminNavbar from "../Components/AdminNavbar";
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
    <div className="min-h-screen bg-slate-50">
      {/* NAVBAR */}
      <AdminNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onLogout={logout}
      />

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-6">
        {activeTab === "Timetable" && <AdminTimetableEditor />}
        {activeTab === "Students" && <AdminStudentsPanel />}

      </div>
    </div>
  );
}
