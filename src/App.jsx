import { useEffect } from "react";
import { Routes, Route, Outlet, useLocation, Navigate } from "react-router";

import MenuNavbar from "./components/Menu_Navbar";

import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import Immersive from "./pages/Immersive";
import Jeu from "./pages/Jeu";
import Reservation from "./pages/Reservation";
import ReservationRecap from "./pages/ReservationRecap";
import MentionsLegales from "./pages/MentionsLegales";
import NotFound from "./pages/NotFound";
import Footer from "./components/Footer";
import BackOfficeLayout from "./back-office/BackOfficeLayout";
import Dashboard from "./back-office/Dashboard";
import BackOfficeReservations from "./back-office/Reservations";
import BackOfficeUsers from "./back-office/Users";
import "/src/styles/Accueil.css";
import "/src/styles/Footer.css";

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return null;
};

const PublicLayout = () => {
  const location = useLocation();

  const ifGamePage =
    location.pathname === "/jeu";
  return (
    <>
      {!ifGamePage && <MenuNavbar />}
      <Outlet />
      {!ifGamePage && <Footer />}
    </>
  );
};

const AdminRoute = () => {
  let user = null;
  let token = "";

  try {
    const rawUser = localStorage.getItem("khetiUser");
    token = String(localStorage.getItem("khetiToken") || "").trim();
    if (rawUser) {
      user = JSON.parse(rawUser);
    }
  } catch {
    localStorage.removeItem("khetiUser");
    localStorage.removeItem("khetiToken");
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (Number(user.admin_state) !== 1) {
    return <Navigate to="/profil" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route index element={<Accueil />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Login />} />
          <Route path="profil" element={<Profil />} />
          <Route path="immersive" element={<Immersive />} />
          <Route path="jeu" element={<Jeu />} />
          <Route path="reservation" element={<Reservation />} />
          <Route path="reservation/recap" element={<ReservationRecap />} />
          <Route path="mentions-legales" element={<MentionsLegales />} />
          <Route path="*" element={<NotFound />} />
        </Route>

        <Route element={<AdminRoute />}>
          <Route path="back-office" element={<BackOfficeLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="reservations" element={<BackOfficeReservations />} />
            <Route path="users" element={<BackOfficeUsers />} />
          </Route>
        </Route>
      </Routes>
    </>
  );
};

export default App;