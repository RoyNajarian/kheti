import * as THREE from "three";
import { useEffect, useRef, useState } from "react";
import "../styles/Jeu.css";
import { mapLevel1, mapLevel2, construction } from "../components/Labyrinthe";
import { createPersonnage, movePersonnage } from "../components/Personnage";
import { Popup } from "../components/Popup";
import { useNavigate } from "react-router";

const maps = [mapLevel1, mapLevel2];

export const Jeu = () => {
  const containerRef = useRef(null);
  const [currentLevel, setCurrentLevel] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [ifTouch, setIfTouch] = useState(window.matchMedia("(max-width: 1024px)").matches);

  const gameStartedRef = useRef(false);
  const startCameraPositionRef = useRef(9);
  const navigate = useNavigate();

  // Vérification de la victoire au chargement 
  useEffect(() => {
    const isGameWon = localStorage.getItem("maze_won");
    if (isGameWon === "true") {
      setCurrentLevel(maps.length - 1);
      setShowPopup(true);
      gameStartedRef.current = false;
    }
  }, []);

  // Permet de passer au niveau suivant
  const nextLevel = () => {
    setShowPopup(false);
    setCurrentLevel(currentLevel + 1);
  };

  // Permet de recommencer le niveau
  const startGame = () => {
    gameStartedRef.current = true;
    setGameStarted(true);
  };

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1024px)");
    
    const handleTouchChange = (event) => {
      setIfTouch(event.matches);
    };

    mediaQuery.addEventListener("change", handleTouchChange);
    
    return () => {
      mediaQuery.removeEventListener("change", handleTouchChange);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const currentMap = maps[currentLevel];
    document.body.style.overflow = "hidden";
    let isPortrait = window.innerWidth < window.innerHeight;

    // Construction du labyrinthe et création du personnage
    const scene = new THREE.Scene();
    construction(scene, currentMap);
    createPersonnage(scene, currentMap);

    // Suivi de la direction du mouvement
    const cameraMouvement = { x: 0, z: 0 };

    // Affiche le popup et sauvegarde la victoire si le joueur a terminé le dernier niveau
    const handleLevelComplete = () => {
      setShowPopup(true);

      if (currentLevel === maps.length - 1) {
        localStorage.setItem("maze_won", "true");
      }
    };

    // Fonction pour déplacer le personnage dans la direction donnée et faire bouger la caméra en conséquence (mobile)
    const personnageMovement = (directionScreen) => {
      let directionMap = "";
      let cameraMoveX = 0;
      let cameraMoveZ = 0;

      if (isPortrait) {
        if  (directionScreen === "up") {
            directionMap = "left";
            cameraMoveX = 1;  
            cameraMoveZ = 0;
        }
        if (directionScreen === "down") {
          directionMap = "right"; 
          cameraMoveX = -1; 
          cameraMoveZ = 0;
        }
        if (directionScreen === "left") {
          directionMap = "down";
          cameraMoveX = 0;  
          cameraMoveZ = -1;
        }
        if (directionScreen === "right") {
          directionMap = "up";
          cameraMoveX = 0;  
          cameraMoveZ = 1;
        }
      }
      else {
        if (directionScreen === "up") {
          directionMap = "up";
          cameraMoveX = 0;  
          cameraMoveZ = 1;
        }
        if (directionScreen === "down") {
          directionMap = "down";
          cameraMoveX = 0;  
          cameraMoveZ = -1;
        }
        if (directionScreen === "left") {
          directionMap = "left";
          cameraMoveX = 1;  
          cameraMoveZ = 0;
        }
        if (directionScreen === "right") {
          directionMap = "right";
          cameraMoveX = -1;  
          cameraMoveZ = 0;
        }
      }
      
      const move = movePersonnage(directionMap, currentMap, handleLevelComplete);

      if (move) {
        cameraMouvement.x = cameraMoveX;
        cameraMouvement.z = cameraMoveZ;
      }
    };

    // Gestion du clavier pour déplacer le personnage et faire bouger la caméra
    const keyboardArrow = (e) => {
      if (!gameStartedRef.current) {
        return;
      }

      const touche = e.key.toLowerCase();

      if (touche === "arrowup" || touche === "z") {
        personnageMovement("up");
      }
      if (touche === "arrowdown" || touche === "s") {
        personnageMovement("down");
      }
      if (touche === "arrowleft" || touche === "q") {
        personnageMovement("left");
      }
      if (touche === "arrowright" || touche === "d") {
        personnageMovement("right");
      }
    };
    window.addEventListener("keydown", keyboardArrow);

    // Stocke la position de départ du toucher
    let touchStartX = 0;
    let touchStartY = 0;

    // Quand le doit touche l'écran, on stocke la position de départ du toucher
    const handleTouchStart = (event) => {
      if (!gameStartedRef.current) {
        return;
      }

      touchStartX = event.touches[0].clientX;
      touchStartY = event.touches[0].clientY;
    }
    window.addEventListener("touchstart", handleTouchStart);

    // Quand le doigt quitte l'écran
    const handleTouchEnd = (event) => {
      if (!gameStartedRef.current) {
        return;
      }

      const touchEndX = event.changedTouches[0].clientX;
      const touchEndY = event.changedTouches[0].clientY;

      const gapX = touchEndX - touchStartX;
      const gapY = touchEndY - touchStartY;

      if (Math.abs(gapX) > 30 || Math.abs(gapY) > 30) {
        if (Math.abs(gapX) > Math.abs(gapY)) {
          if (gapX > 0) {
            personnageMovement("right");
          }
          else {
            personnageMovement("left");
          }
        }
        else {
          if (gapY > 0) {
            personnageMovement("down")
          }
          else {
            personnageMovement("up")
          }
        }
      }
    }
    window.addEventListener("touchend", handleTouchEnd);

    // Lumières
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
    scene.add(ambientLight);

    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(13, 20, 7);
    scene.add(light);

    // Caméra
    const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000,);
    camera.position.set(13, 17.5, 7);
    camera.up.set(0, 0, -1);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    // Fonction pour calculer la hauteur de la caméra en fonction du ratio de l'écran et de l'orientation (portrait ou paysage)
    const calculateCameraHeight = (portrait) => {
      const ratio = window.innerWidth / window.innerHeight;

      if (portrait) {
        return Math.max(33, 14 / ratio);
      }
      else {
        return Math.max(17.5, 30 / ratio);
      }
    }

    // Fonction pour mettre à jour l'orientation et la hauteur de la caméra en fonction de l'orientation de l'écran
    const updateCameraOrientation = () => {
      if (isPortrait) {
        camera.up.set(-1, 0, 0);
        camera.position.y = calculateCameraHeight(true);
      } 
      else {
        camera.up.set(0, 0, -1);
        camera.position.y = calculateCameraHeight(false);
      }
    };
    updateCameraOrientation();
    
    // Fonction pour gérer le redimensionnement de la fenêtre.
    const handleResize = () => {
      isPortrait = window.innerWidth < window.innerHeight;
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix(); // Obligatoire quand on change l'aspect
      
      renderer.setSize(window.innerWidth, window.innerHeight);
     
      updateCameraOrientation();
    };
    window.addEventListener("resize", handleResize);

    
    let animId;
    const animateScene = () => {
      animId = requestAnimationFrame(animateScene);

      let gapCamera;

      if (gameStartedRef.current === true) {
        gapCamera = 0;
      }
      else {
        gapCamera = 9;
      }

      startCameraPositionRef.current += (gapCamera - startCameraPositionRef.current) * 0.04;
      const cameraPositionX = 13 + startCameraPositionRef.current;

      camera.position.x += (cameraPositionX + cameraMouvement.x * 1.5 - camera.position.x) * 0.08;
      camera.position.z += (7 + cameraMouvement.z * 1.5 - camera.position.z) * 0.08;

      let cameraAjustZ;
      let cameraAjustX;

      if (isPortrait) {
        cameraAjustZ = 7;
        cameraAjustX = cameraPositionX - 1.5;
      }
      else {
        cameraAjustZ = 6.4;
        cameraAjustX = cameraPositionX;
      }

      camera.lookAt(cameraAjustX, 0, cameraAjustZ);
      renderer.render(scene, camera);
    };
    animateScene();

    // Nettoyage à la fin du composant
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("keydown", keyboardArrow);
      renderer.dispose();
      container.removeChild(renderer.domElement);
      document.body.style.overflow = "visible";
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
    };
  }, [currentLevel]);

  return (
    <div className="game-jeu-container">
      <button className="game-btn-back" onClick={() => navigate(-1)}>
        <i className="fa-solid fa-arrow-left"></i>Quitter
      </button>

      <img src="/images/keyboard.webp" className="game-keyboard-info" alt="Touches ZQSD et flèches directionnelles"/>
      <img src="/images/kheti-logo.png" className="game-logo-kethi" alt="Logo du site"/>

      <div className="game-container-3d" ref={containerRef}></div>

      {showPopup && (
        <Popup
          titre={
            currentLevel < maps.length - 1 ? (
              <>
                Niveau {currentLevel + 1} <br /> terminé !
              </>
            ) : (
              "Bravo !"
            )
          }
          contenu={
            currentLevel < maps.length - 1 ? (
              <button className="game-btn-popup" onClick={nextLevel}>
                Niveau suivant
              </button>
            ) : (
              <div className="game-win-popup">
                <p className="game-win-title">Tu as terminé tous les niveaux</p>
                <p className="game-win-content">Tu as débloqué un goodies exclusif ! Utilise ce code secret lors de ta réservation ou présente-le à la sortie de l'exposition :</p>
                <span className="game-promo-code">KETHI-MAZE-26</span>
                <button
                  className="game-btn-popup"
                  onClick={() => navigate("/reservation")}
                >
                  Réserver mes billets
                </button>
              </div>
            )
          }
        />
      )}

      {!gameStarted && (
        <div className="game-intro-container">
          <div className="game-intro-content">
            <h1 className="game-intro-title">The Maze Roller</h1>

            <p className="game-intro-text">
              Votre objectif est de guider la sphère à travers les couloirs de
              ce temple labyrinthique jusqu'à en trouver l'issue. Faites appel à
              votre sens de l'orientation et à votre logique pour déjouer les
              impasses qui se dresseront sur votre chemin.
            </p>

            <p className="game-intro-text">
              Résolvez tous les niveaux pour débloquer une récompense exclusive
              à récupérer lors de votre visite à l'exposition.
            </p>

            <p className="game-intro-commandes">
              {ifTouch 
                ? "Glissez votre doigt sur l'écran pour vous déplacer." 
                : 'Utilisez les flèches directionnelles ou "ZQSD" pour vous déplacer.'}
            </p>

            <button className="game-btn-jouer" onClick={startGame}>
              Jouer
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Jeu;
