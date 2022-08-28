import * as THREE from "../node_modules/three/build/three.module.js";
import camera from './camera.js';
import scene from './scene.js';
import renderer from './renderer.js'

//a variables to check where is the camera relative to that axis
let cameraView = {
    positiveX : false,
    negativeX : false,
    positiveY : true,
    negativeY : false,
    positiveZ : false,
    negativeZ : false,
}

const distance_from_origin = 400;

export default function eventHandler() {
    window.addEventListener('keydown', handleKeyEvent);
}

//view from different angle 
function handleKeyEvent(event) {
    switch(event.key) {
        case '1' : {
            camera.position.set(0, distance_from_origin, distance_from_origin * 0.3);
            changeCameraPosition('positiveY');
            break;
        } 
        case '2' : {
            camera.position.set(0, -distance_from_origin, distance_from_origin * 0.3);
            changeCameraPosition('negativeY');
            break;
        } 
        case '3' : {
            camera.position.set(distance_from_origin, 0, distance_from_origin * 0.3);
            changeCameraPosition('positiveX');
            break;
        } 
        case '4' : {
            camera.position.set(-distance_from_origin, 0, distance_from_origin * 0.3);
            changeCameraPosition('negativeX');
            break;
        }
        case '5' : {
            camera.position.set(0, 0, distance_from_origin);
            changeCameraPosition('positiveZ');
            break;
        }
        case '6' : {
            camera.position.set(0, 0, -distance_from_origin);
            changeCameraPosition('negativeZ');
            break;
        }
    }
    console.dir(JSON.stringify(cameraView));
    camera.lookAt(0, 0, 0);
}

//resize the canvas
export function updateOnResize() {
    window.addEventListener('resize', resizing);
    function resizing() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);    
    }
}

/**
 * set the camera position to true and the old position to false
 * @param {string} direction of the camera relative to (0, 0, 0) and the axises 
 */
function changeCameraPosition(cameraPosition) {
    for(const position in cameraView) {
        if(cameraView[position]) {
            cameraView[position] = false;
        }
    }
    cameraView[cameraPosition] = true;
}
