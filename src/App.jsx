import { Routes, Route, Outlet, useLocation, Navigate } from "react-router";

import MenuNavbar from "./components/Menu_Navbar";

import Accueil from "./pages/Accueil";
import Login from "./pages/Login";
import Profil from "./pages/Profil";
import Immersive from "./pages/Immersive";
import Jeu from "./pages/Jeu";
import Reservation from "./pages/Reservation";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import BackOfficeLayout from "./back-office/BackOfficeLayout";
import Dashboard from "./back-office/Dashboard";
import BackOfficeReservations from "./back-office/Reservations";
import BackOfficeUsers from "./back-office/Users";
import "/src/styles/Accueil.css";
import "/src/styles/Footer.css";

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

  try {
    const rawUser = localStorage.getItem("khetiUser");
    if (rawUser) {
      user = JSON.parse(rawUser);
    }
  } catch {
    localStorage.removeItem("khetiUser");
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (Number(user.admin_state) !== 1) {
    return <Navigate to="/profil" replace />;
  }

  return <Outlet />;
};

const App = () => {
  return (
    <Routes>
      {/* Routes publiques avec la Navbar */}
      <Route element={<PublicLayout />}>
        <Route index element={<Accueil />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Login />} />
        <Route path="profil" element={<Profil />} />
        <Route path="immersive" element={<Immersive />} />
        <Route path="jeu" element={<Jeu />} />
        <Route path="reservation" element={<Reservation />} />
      </Route>

      {/* Routes back-office reservees aux admins */}
      <Route element={<AdminRoute />}>
        <Route path="back-office" element={<BackOfficeLayout />}>
          <Route index element={<Dashboard />} />
          <Route path="reservations" element={<BackOfficeReservations />} />
          <Route path="users" element={<BackOfficeUsers />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;