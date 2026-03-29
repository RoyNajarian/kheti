import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

const Boat3D = ({ carouselPosition = 0 }) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const boatRef = useRef(null);
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

        // Load boat model
        const loader = new GLTFLoader();
        loader.load('/3d/herculaneum_boat_-_roman_boat.glb', (gltf) => {
            const boat = gltf.scene;
            boatRef.current = boat;

            // Scale and position the boat - smaller scale
            boat.scale.set(0.25, 0.25, 0.25);
            boat.position.set(0, 0, 0);

            scene.add(boat);

            // ========== BOAT PATH ANIMATION SETTINGS ==========
            // CUSTOMIZE THESE VALUES:
            const cycleTime = 30000; // Cycle duration in ms (higher = slower)
            const verticalRange = 5; // How far boat moves downward
            const wave1Amplitude = 0.275; // Main S-curve (↔ left-right range)
            const wave1Frequency = 2; // How many curves (2 = full S)
            const wave2Amplitude = 0.2; // Secondary wave detail
            const wave2Frequency = 4; // Secondary frequency
            const wave2Phase = -Math.PI / 2; // Secondary wave offset/phase
            const wave3Amplitude = 0.08; // Fine wave detail
            const wave3Frequency = 6; // Fine wave frequency
            // ================================================

            // Start animation loop
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }

            const animate = () => {
                animationFrameRef.current = requestAnimationFrame(animate);

                if (boatRef.current) {
                    const t = (Date.now() % cycleTime) / cycleTime; // 0 to 1 (progress along path)
                    
                    // Z: continuous downward movement
                    boatRef.current.position.z = -verticalRange + (t * verticalRange * 2);
                    
                    // X: Complex S-shaped lateral movement
                    const wave1 = Math.sin(t * Math.PI * wave1Frequency) * wave1Amplitude;
                    const wave2 = Math.sin(t * Math.PI * wave2Frequency + wave2Phase) * wave2Amplitude;
                    const wave3 = Math.sin(t * Math.PI * wave3Frequency) * wave3Amplitude;
                    
                    boatRef.current.position.x = wave1 + wave2 + wave3;
                }

                renderer.render(scene, camera);
            };

            animate();
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
            if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
                containerRef.current.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [carouselPosition]);

    return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Boat3D;
