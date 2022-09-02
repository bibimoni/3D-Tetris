import * as THREE from "../node_modules/three/build/three.module.js";

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
export const directionalLight = dirLight();

function dirLight() {
    const light = new THREE.DirectionalLight(0xffffff, 0.7);
    light.position.set(50, 50, 100);
    return light
}

