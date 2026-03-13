import React, { useEffect, useRef } from "react";
import { Routes, Route } from "react-router";

import Accueil from "./pages/Accueil";
import Register from "./pages/auth/Register";
import Login from "./pages/auth/Login";
import Profil from "./pages/Profil";
import Immersive from "./pages/Immersive";
import Jeu from "./pages/Jeu";
import Reservation from "./pages/Reservation";
import Navbar from "./components/Navbar";

import "/src/styles/Accueil.css";

const App = () => {
  return (
    <>
      {/* <Navbar /> */}

      <Routes>
        <Route index element={<Accueil />} />

        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="profil" element={<Profil />} />
        <Route path="immersive" element={<Immersive />} />
        <Route path="jeu" element={<Jeu />} />
        <Route path="reservation" element={<Reservation />} />

      </Routes>
    </>
  );
}

export default App;