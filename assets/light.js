import * as THREE from "../node_modules/three/build/three.module.js";

export const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
export const directionalLight = dirLight();

function dirLight() {
    const light = new THREE.DirectionalLight(0xffffff, 0.5);
    light.position.set(100, -300, 400);
    return light
}

