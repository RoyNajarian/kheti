import { Routes, Route } from "react-router";

import Accueil from "./pages/Accueil";
import Auth from "./pages/Auth";
import Profil from "./pages/Profil";
import Immersive from "./pages/Immersive";
import Jeu from "./pages/Jeu";
import Reservation from "./pages/Reservation";

export default function App() {
  return (
    <Routes>
      <Route index element={<Accueil />} />

      <Route path="auth" element={<Auth />} />
      <Route path="profil" element={<Profil />} />
      <Route path="immersive" element={<Immersive />} />
      <Route path="jeu" element={<Jeu />} />
      <Route path="reservation" element={<Reservation />} />

    </Routes>
  );
}