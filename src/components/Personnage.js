import * as THREE from 'three';
import { mapLevel1 } from './Labyrinthe';

export const start = () => {
    for (let i = 0; i < mapLevel1.length; i++) {
        for (let j = 0; j < mapLevel1[i].length; j++) {
            if (mapLevel1[i][j] === 2) {
                return { x: i, y: j };
            }
        }
    }
    return null;
}

let personnageMesh = null;

export const createPersonnage = (scene) => {
    const geometry = new THREE.CapsuleGeometry(0.3, 0.5, 4, 8);
    const material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
    personnageMesh = new THREE.Mesh(geometry, material);

    const depart = start();
    personnageMesh.position.set(depart.y, 0.1, depart.x);

    scene.add(personnageMesh);
};

