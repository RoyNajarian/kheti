import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import gsap from 'gsap';

const Boat3D = ({ carouselPosition = 0 }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const boatRef = useRef(null);
    const rendererRef = useRef(null);
    const animationFrameRef = useRef(null);

    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;
        
        const width = containerRef.current.clientWidth;
        const height = containerRef.current.clientHeight;
        
        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
        rendererRef.current = renderer;

        renderer.setSize(width, height);
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);

        // Top-down camera view
        camera.position.set(0, 5.5, 0);
        camera.lookAt(0, 0, 0);

        // Lighting for top-down view
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        scene.add(ambientLight);

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
        directionalLight.position.set(2, 3, 2);
        scene.add(directionalLight);

        // Render loop
        const animate = () => {
            animationFrameRef.current = requestAnimationFrame(animate);
            renderer.render(scene, camera);
        };
        animate();

        // Load boat model
        const loader = new GLTFLoader();
        loader.load('/3d/herculaneum_boat_-_roman_boat.glb', (gltf) => {
            const boat = gltf.scene;
            boatRef.current = boat;

            // Scale and position the boat - smaller scale
            boat.scale.set(0.25, 0.25, 0.25);
            boat.position.set(0, 0, 0);

            scene.add(boat);
            renderer.render(scene, camera);

            // GSAP animation for boat moving downward along the Nile
            gsap.from(boat.position, {
                z: -5,
                duration: 30,
                // ease: none,
                repeat: -1
            });

            // GSAP animation for boat moving to the right
            gsap.to(boat.position, {
                z: 5,
                duration: 30,
                repeat: -1
            });
        });

        // Handle window resize
        const handleResize = () => {
            if (!containerRef.current) return;
            const width = containerRef.current.clientWidth;
            const height = containerRef.current.clientHeight;
            camera.aspect = width / height;
            camera.updateProjectionMatrix();
            renderer.setSize(width, height);
        };

        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
            if (boatRef.current) {
                gsap.killTweensOf(boatRef.current.position);
            }
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [carouselPosition]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Boat3D;
