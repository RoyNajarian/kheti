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

        // Caméra
        const camera = new THREE.PerspectiveCamera(60, container.clientWidth / container.clientHeight, 0.1, 1000);
        camera.position.set(13, 18, 9);
        camera.up.set(0, 0, -2);
        camera.lookAt(13, 2, 7);

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        container.appendChild(renderer.domElement);

        // Animation
        let animId;
        const animate = () => {
            animId = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Nettoyage quand on quitte la page
        return () => {
            cancelAnimationFrame(animId);
            renderer.dispose();
            container.removeChild(renderer.domElement);
        };
    }, []);

    return (
        <div className='container-3d' ref={containerRef}></div>
    );
}

export default Jeu;
