import * as THREE from 'three';
import gsap from 'gsap';

let personnageMesh = null;
let isMoving = false;

// Position et rotation actuelles du personnage
let positionX = 0;
let positionZ = 0;
let rotationX = 0;
let rotationZ = 0;

// Trouve la position de départ du personnage
export const start = (currentLevel) => {
    for (let i = 0; i < currentLevel.length; i++) {
        for (let j = 0; j < currentLevel[i].length; j++) {
            if (currentLevel[i][j] === 2) {
                return { i, j };
            }
        }
    }
}

// Crée le personnage et l'ajoute à la scène
export const createPersonnage = (scene, currentLevel) => {
    const textureLoader = new THREE.TextureLoader();

    const ballTexture = textureLoader.load('/images/ball.jpg');
    ballTexture.colorSpace = THREE.SRGBColorSpace;

    const geometry = new THREE.SphereGeometry(0.46, 16, 16);
    const material = new THREE.MeshLambertMaterial({ map: ballTexture });
    personnageMesh = new THREE.Mesh(geometry, material);

    const depart = start(currentLevel);
    personnageMesh.position.set(depart.j, 0.6, depart.i);
    positionX = depart.j;
    positionZ = depart.i;

    scene.add(personnageMesh);
};


// Déplace le personnage dans la direction donnée, en vérifiant les collisions avec les murs et en animant le mouvement.
export const movePersonnage = (direction, currentLevel, whenFinish) => {
    if (isMoving || !personnageMesh) {
        return null;
    }

    let stepX = 0;
    let stepZ = 0;

    if (direction === 'up') {
        stepZ -= 1;
    }
    else if (direction === 'down') {
        stepZ += 1;
    }
    else if (direction === 'left') {
        stepX -= 1;
    }
    else if (direction === 'right') {
        stepX += 1;
    }

    let destinationX = positionX;
    let destinationZ = positionZ;

    while (destinationX + stepX >= 0 && destinationX + stepX < currentLevel[0].length && currentLevel[destinationZ + stepZ][destinationX + stepX] !== 1) {
        destinationX += stepX;
        destinationZ += stepZ;
    }

    if (destinationX !== positionX || destinationZ !== positionZ) {
        isMoving = true;

        const distanceX = destinationX - positionX;
        const distanceZ = destinationZ - positionZ;

        positionX = destinationX;
        positionZ = destinationZ;
        
        gsap.to(personnageMesh.position, {
            x: destinationX,
            z: destinationZ,
            duration: 0.2,
            onComplete: () => {
                isMoving = false;
                if (currentLevel[destinationZ][destinationX] === 3) {
                    whenFinish();
                }
            }
        });

        gsap.to(personnageMesh.rotation, {
            x: rotationX -= distanceZ * (Math.PI / 2),
            z: rotationZ += distanceX * (Math.PI / 2),
            duration: 0.3,
            ease: "power2.out"
        });
        return true;
    }
    return false;
}