import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./app/lib/AuthContext.jsx";
import Layout from "./app/components/Layout.jsx";
import DashboardLayout from "./app/components/DashboardLayout.jsx";
import HomePage from "./app/pages/HomePage.jsx";
import DestinationsPage from "./app/pages/DestinationsPage.jsx";
import DestinationDetailPage from "./app/pages/DestinationDetailPage.jsx";
import BookingPage from "./app/pages/BookingPage.jsx";
import MyBookingsPage from "./app/pages/MyBookingsPage.jsx";
import ProfilePage from "./app/pages/ProfilePage.jsx";
import DashboardPage from "./app/pages/DashboardPage.jsx";
import LoginPage from "./app/pages/LoginPage.jsx";
import RegisterPage from "./app/pages/RegisterPage.jsx";
import NotFoundPage from "./app/pages/NotFoundPage.jsx";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
          </Route>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/destinations" element={<DestinationsPage />} />
            <Route path="/destinations/:id" element={<DestinationDetailPage />} />
            <Route path="/book/:id" element={<BookingPage />} />
            <Route path="/my-bookings" element={<MyBookingsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
