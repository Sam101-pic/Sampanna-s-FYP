import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";

// --- Public Pages ---
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import FAQ from "./pages/FAQ";

// --- Authentication ---
import AuthRoleSelector from "./pages/Auth/AuthRoleSelector";
import LoginPatient from "./pages/Auth/LoginPatient";
import LoginTherapist from "./pages/Auth/LoginTherapist";
import LoginAdmin from "./pages/Auth/LoginAdmin";
import RegisterPatient from "./pages/Auth/RegisterPatient";
import RegisterTherapist from "./pages/Auth/RegisterTherapist";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// --- Dashboards ---
import PatientDashboard from "./pages/Patient/PatientDashboard";
import TherapistDashboard from "./pages/Therapist/TherapistDashboard";
import AdminDashboard from "./pages/Admin/AdminDashboard";

// --- Profiles ---
import TherapistProfile from "./pages/Therapist/Profile";

// --- Therapist ---
import TherapistInteractions from "./pages/Therapist/PatientInteraction";
import TherapistSessionNotes from "./pages/Therapist/SessionNotes";

// --- Admin ---
import UserManagement from "./pages/Admin/UserManagement";
import TherapistVerification from "./pages/Admin/TherapistVerification";
import Reports from "./pages/Admin/Reports";
import Settings from "./pages/Admin/Settings";

// --- Patient (Consultation) ---
import ChatRoom from "./pages/Patient/ChatRoom";
import VideoCall from "./pages/Patient/VideoCall";
import SessionHistory from "./pages/Patient/SessionHistory";
import Feedback from "./pages/Patient/Feedback";
import Payment from "./pages/Patient/Payment";

// --- Therapists & Matching ---
import TherapistList from "./pages/Therapists/TherapistList";
import TherapistMatchAI from "./pages/Therapists/TherapistMatchAI";
import TherapistDetails from "./pages/Therapists/TherapistDetails";

// --- Appointments ---
import BookAppointment from "./pages/Patient/BookAppointment";
import AppointmentCalendar from "./pages/Patient/AppointmentCalendar";
import RescheduleAppointment from "./pages/Patient/RescheduleAppointment";

// --- 404 ---
const NotFound = () => <h2 style={{ textAlign: "center" }}>404: Page Not Found</h2>;

function AppChrome() {
  const { pathname } = useLocation();

  // 🆕 hold current user state
  const [user, setUser] = useState(null);

  // fetch current user once after login
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_URL || "http://localhost:5000/api"}/users/me`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );
        const data = await res.json();
        if (data && data.id) setUser(data);
      } catch (err) {
        console.error("❌ Failed to load /users/me", err);
      }
    }
    fetchMe();
  }, []);

  // Hide Navbar/Footer on app sections
  const HIDE_PREFIXES = [
    "/dashboard",
    "/admin",
    "/therapist",
    "/profile/therapist",
    "/interactions",
    "/therapists",
    "/appointments",
    "/consultation",
    "/history",
    "/feedback",
    "/payment",
  ];
  const hideChrome = HIDE_PREFIXES.some(
    (p) => pathname === p || pathname.startsWith(p + "/")
  );

  return (
    <>
      {!hideChrome && <Navbar />}

      <div style={{ minHeight: "80vh" }}>
        <Routes>
          {/* --- Public --- */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />

          {/* --- Auth --- */}
          <Route path="/auth/login" element={<AuthRoleSelector mode="login" />} />
          <Route path="/auth/register" element={<AuthRoleSelector mode="register" />} />
          <Route path="/auth/login/patient" element={<LoginPatient />} />
          <Route path="/auth/login/therapist" element={<LoginTherapist />} />
          <Route path="/auth/login/admin" element={<LoginAdmin />} />
          <Route path="/auth/register/patient" element={<RegisterPatient />} />
          <Route path="/auth/register/therapist" element={<RegisterTherapist />} />
          <Route path="/auth/forgot-password" element={<ForgotPassword />} />
          <Route path="/auth/reset-password/:token" element={<ResetPassword />} />

          {/* --- Therapists & Matching (public) --- */}
          <Route path="/therapists" element={<TherapistList />} />
          <Route path="/therapists/match" element={<TherapistMatchAI />} />
          <Route path="/therapists/:id" element={<TherapistDetails />} />

          {/* --- Protected --- */}
          <Route element={<PrivateRoute />}>
            {/* Dashboards */}
            <Route path="/dashboard" element={<PatientDashboard />} />
            <Route path="/dashboard/patient" element={<PatientDashboard />} />
            <Route path="/dashboard/therapist" element={<TherapistDashboard />} />
            <Route path="/therapist/dashboard" element={<TherapistDashboard />} />
            <Route path="/dashboard/admin" element={<AdminDashboard />} />

            {/* Profiles */}
            <Route path="/profile/therapist" element={<TherapistProfile />} />
            <Route path="/therapist/profile" element={<TherapistProfile />} />

            {/* Therapist Interactions */}
            <Route path="/interactions" element={<TherapistInteractions />} />
            <Route path="/therapist/patients" element={<TherapistInteractions />} />
            <Route path="/therapist/interactions" element={<TherapistInteractions />} />

            {/* Therapist Notes/History */}
            <Route path="/therapist/session" element={<TherapistSessionNotes />} />
            <Route path="/therapist/history" element={<TherapistSessionNotes />} />

            {/* Patients */}
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/payment" element={<Payment />} />

            {/* Appointments */}
            <Route path="/appointments" element={<AppointmentCalendar />} />
            <Route path="/appointments/book/:therapistId" element={<BookAppointment />} />
            <Route path="/appointments/calendar" element={<AppointmentCalendar />} />
            <Route path="/appointments/reschedule/:appointmentId" element={<RescheduleAppointment />} />

            {/* Consultation */}
            <Route path="/consultation" element={<ChatRoom currentUser={user} />} />
            <Route path="/consultation/:therapistId" element={<ChatRoom currentUser={user} />} />
            <Route path="/consultation/video" element={<VideoCall />} />
            <Route path="/history" element={<SessionHistory />} />

            {/* Admin tools */}
            <Route path="/admin/user-management" element={<UserManagement />} />
            <Route path="/admin/therapist-verification" element={<TherapistVerification />} />
            <Route path="/admin/reports" element={<Reports />} />
            <Route path="/admin/settings" element={<Settings />} />
            <Route path="/admin/users" element={<UserManagement />} />
          </Route>

          {/* --- 404 --- */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>

      {!hideChrome && <Footer />}
    </>
  );
}

export default function App() {
  return (
    <Router>
      <AppChrome />
    </Router>
  );
}
