import * as THREE from 'three';
import { mapLevel1 } from './Labyrinthe';
import gsap from 'gsap';

let personnageMesh = null;
let isMoving = false;

let positionX = 0;
let positionZ = 0;

export const start = () => {
    for (let i = 0; i < mapLevel1.length; i++) {
        for (let j = 0; j < mapLevel1[i].length; j++) {
            if (mapLevel1[i][j] === 2) {
                return { i, j };
            }
        }
    }
}

export const createPersonnage = (scene) => {
    const geometry = new THREE.SphereGeometry(0.4, 16, 16);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    personnageMesh = new THREE.Mesh(geometry, material);

    const depart = start();
    personnageMesh.position.set(depart.j, 0.6, depart.i);
    positionX = depart.j;
    positionZ = depart.i;

    scene.add(personnageMesh);
};

export const movePersonnage = (direction) => {
    if (isMoving || !personnageMesh) {
        return null;
    }

    let stepX = 0;
    let stepZ = 0;

    if (direction === 'haut') {
        stepZ -= 1;
    }
    else if (direction === 'bas') {
        stepZ += 1;
    }
    else if (direction === 'gauche') {
        stepX -= 1;
    }
    else if (direction === 'droite') {
        stepX += 1;
    }

    let destinationX = positionX;
    let destinationZ = positionZ;

    while (destinationX + stepX >= 0 && destinationX + stepX < mapLevel1[0].length && mapLevel1[destinationZ + stepZ][destinationX + stepX] !== 1) {
        destinationX += stepX;
        destinationZ += stepZ;
    }

    if (destinationX !== positionX || destinationZ !== positionZ) {
        isMoving = true;
        positionX = destinationX;
        positionZ = destinationZ;
        
        gsap.to(personnageMesh.position, {
            x: destinationX,
            z: destinationZ,
            duration: 0.3,
            onComplete: () => {
                isMoving = false;
            }
        });
    }
}