import { Routes, Route, Outlet } from "react-router";

import Accueil from "./pages/Accueil";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
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

const PublicLayout = () => (
  <>
    {/* <Navbar /> */}
    <Outlet />
    <Footer />
  </>
);

const App = () => {
  return (
    <Routes>
      {/* Routes publiques avec la Navbar */}
      <Route element={<PublicLayout />}>
        <Route index element={<Accueil />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
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