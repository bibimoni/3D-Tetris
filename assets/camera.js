import * as THREE from "../node_modules/three/build/three.module.js";

const aspectRatio = window.innerWidth / window.innerHeight;

var VIEW_ANGLE = 20,
        NEAR = 5,
        FAR = 1000;

const camera = new THREE.PerspectiveCamera(
        VIEW_ANGLE, //vertical view - the vertical angle from the view point
        aspectRatio, //aspectRatio of the width and the height of the frame
        NEAR, //near plane from the view point
        FAR //far plane from the view point
);

camera.position.set(0, 400, 100);
camera.up.set(0, 0, 1);
camera.lookAt(0, 0, 0);

export default camera;