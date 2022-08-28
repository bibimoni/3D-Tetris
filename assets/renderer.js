import * as THREE from "../node_modules/three/build/three.module.js";
import camera from './camera.js';
import scene from './scene.js';
import { directionalLight, ambientLight } from './light.js'

//setup lights
scene.add(ambientLight);
scene.add(directionalLight);

const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.render(scene, camera);

export default renderer;