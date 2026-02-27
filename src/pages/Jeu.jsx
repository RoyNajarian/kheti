import * as THREE from 'three';
import { useEffect, useRef } from 'react';
import '../styles/Jeu.css';
import { construction } from '../components/Labyrinthe';

export const Jeu = () => {
    const containerRef = useRef(null);

    useEffect(() => {
        const container = containerRef.current;

        // Scène
        const scene = new THREE.Scene();
        construction(scene);

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
            camera.position.x += (13 + mouse.x * 1.5 - camera.position.x) * 0.15;
            camera.position.z += (7 + mouse.y * 1.5 - camera.position.z) * 0.15;
            camera.lookAt(13, 0, 6.4);
            renderer.render(scene, camera);
        };
        animate();

        // Nettoyage quand on quitte la page
        return () => {
            cancelAnimationFrame(animId);
            window.removeEventListener('mousemove', mouseMove);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className='container-3d' ref={containerRef}></div>
    );
}

export default Jeu;
