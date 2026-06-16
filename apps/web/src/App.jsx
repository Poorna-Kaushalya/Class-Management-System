import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import LandingPage from "./pages/Landing";
import LumoraLoader from "./Components/LumoraLoader";
import AdminDashboard from "./pages/AdminDashboard";
import StudentDashboard from "./pages/StudentDashboard";
import AdminStudentDashboard from "./pages/AdminStudentDashboard";

function AdminRoute({ children }) {
  const token = localStorage.getItem("accessToken");
  const role = localStorage.getItem("role");
  if (!token || role !== "ADMIN") return <Navigate to="/" replace />;
  return children;
}

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LumoraLoader />}

      {!loading && (
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/student" element={<StudentDashboard />} />

            <Route
              path="/admin"
              element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              }
            />

            <Route
              path="/admin/students/:studentUserId"
              element={
                <AdminRoute>
                  <AdminStudentDashboard />
                </AdminRoute>
              }
            />

          </Routes>
        </BrowserRouter>
      )}
    </>
  );
}

export default App;
