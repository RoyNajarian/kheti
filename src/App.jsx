import { Routes, Route, Outlet, useLocation } from "react-router";

import MenuNavbar from "./components/menu_navbar";

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

  const ifGamePage = location.pathname === "/jeu" || location.pathname === "/login" || location.pathname === "/register" || location.pathname === "/reservation";

  return (
    <>
      {!ifGamePage && <MenuNavbar />}
      <Outlet />
      {!ifGamePage && <Footer />}
    </>
  );
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

      {/* Routes back-office (sans Navbar publique) */}
      <Route path="back-office" element={<BackOfficeLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="reservations" element={<BackOfficeReservations />} />
        <Route path="users" element={<BackOfficeUsers />} />
      </Route>
    </Routes>
  );
};

export default App;