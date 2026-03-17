import * as THREE from 'three';
import { useEffect, useRef, useState } from 'react';
import '../styles/Jeu.css';
import { mapLevel1, mapLevel2, construction } from '../components/Labyrinthe';
import { createPersonnage, movePersonnage } from '../components/Personnage';
import { Popup } from '../components/Popup';
/* TEST */

const maps = [mapLevel1, mapLevel2]; 

export const Jeu = () => {
    const containerRef = useRef(null);

    const [currentLevel, setCurrentLevel] = useState(0);
    const [showPopup, setShowPopup] = useState(false);

    const nextLevel = () => {
        setShowPopup(false);
        setCurrentLevel(currentLevel + 1);
    };

    useEffect(() => {
        const container = containerRef.current;
        const currentMap = maps[currentLevel];

        // Scène
        const scene = new THREE.Scene();
        construction(scene, currentMap);
        createPersonnage(scene, currentMap);

        // Suivi de la direction
        const cameraMouvement = { x: 0, z: 0 };

        const win = () => {
            setShowPopup(true);
        };

        const keyboardArrow = (e) => {
            const touche = e.key.toLowerCase();

            cameraMouvement.x = 0;
            cameraMouvement.z = 0;

            if (touche === 'arrowup' || touche === 'z') {
                movePersonnage('haut', currentMap, win);
                cameraMouvement.z = 1;
            }
            if (touche === 'arrowdown' || touche === 's') {
                movePersonnage('bas', currentMap, win);
                cameraMouvement.z = -1;
            }
            if (touche === 'arrowleft' || touche === 'q') {
                movePersonnage('gauche', currentMap, win);
                cameraMouvement.x = 1;
            }
            if (touche === 'arrowright' || touche === 'd') {
                movePersonnage('droite', currentMap, win);
                cameraMouvement.x = -1;
            }
        }
        window.addEventListener('keydown', keyboardArrow);

        // Lumière
        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(13, 20, 7);
        scene.add(light);

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        scene.add(ambientLight);

        // Caméra
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(13, 18, 7);
        camera.up.set(0, 0, -1);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Suivi de la souris
        const mouse = { x: 0, y: 0 };

        const mouseMove = (e) => {
            const relativeMouseX = e.clientX / window.innerWidth;
            const relativeMouseY = e.clientY / window.innerHeight;

            mouse.x = -(relativeMouseX * 2 - 1);
            mouse.y = -(relativeMouseY * 2 - 1);
        };
        window.addEventListener('mousemove', mouseMove);

        // Animation
        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            camera.position.x += (13 + cameraMouvement.x * 1.5 - camera.position.x) * 0.08;
            camera.position.z += (7 + cameraMouvement.z * 1.5 - camera.position.z) * 0.08;
            camera.lookAt(13, 0, 6.4);
            renderer.render(scene, camera);
        };
        animate();

        // Nettoyage quand on quitte la page
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('keydown', keyboardArrow);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, [currentLevel]);

    // Contenu du popup de fin de niveau en fonction du niveau actuel
    let popupContenu;
    if (currentLevel < maps.length - 1) {
        popupContenu = <button onClick={nextLevel}>Niveau suivant</button>;
    } 
    else {
        popupContenu = <p>Félicitations, tu as terminé tous les niveaux !</p>;
    }

    // Si le popup doit être affiché, on le crée avec le contenu approprié
    let popup;
    if (showPopup === true) {
        popup = <Popup titre={'Niveau ' + (currentLevel + 1) + ' terminé !'} contenu={popupContenu} />;
    }

    // Rendu du composant
    return (
        <div className='jeu-wrapper'>
            <div className='container-3d' ref={containerRef}></div>
            {popup}
        </div>
    );
}

export default Jeu;