import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import '../styles/Jeu.css';
import { construction } from '../components/Labyrinthe';
import { createPersonnage, movePersonnage } from '../components/Personnage';

export const Jeu = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        // Scène
        const scene = new THREE.Scene();
        construction(scene);
        createPersonnage(scene);

        // Suivi de la direction
        const cameraMouvement = { x: 0, z: 0 };

        const keyboardArrow = (e) => {
            const touche = e.key.toLowerCase();

            cameraMouvement.x = 0;
            cameraMouvement.z = 0;

            if (touche === 'arrowup' || touche === 'z') {
                movePersonnage('haut');
                cameraMouvement.z = 1;
            }
            if (touche === 'arrowdown' || touche === 's') {
                movePersonnage('bas');
                cameraMouvement.z = -1;
            }
            if (touche === 'arrowleft' || touche === 'q') {
                movePersonnage('gauche');
                cameraMouvement.x = 1;
            }
            if (touche === 'arrowright' || touche === 'd') {
                movePersonnage('droite');
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
    }, []);

    return (
        <div className='container-3d' ref={containerRef}></div>
    );
}

export default Jeu;