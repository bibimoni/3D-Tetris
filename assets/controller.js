import * as THREE from "../node_modules/three/build/three.module.js";
import { move } from "./block.js";
import camera from './camera.js';
import renderer from './renderer.js'

//a variables to check where is the camera relative to that axis
export let cameraView = {
    positiveX : false,
    negativeX : false,
    positiveY : false,
    negativeY : false,
    positiveZ : true,
    negativeZ : false,
}

let keys = {
    ArrowUp : {
        pressed : false
    },
    ArrowDown : {
        pressed : false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        presse: false
    }    
}

const distance_from_origin = 400;

export default function eventHandler() {
    window.addEventListener('keydown', handleKeyCameraEvent);
    window.addEventListener('keydown', handleKeyMovementEvent)
}

//view from different angle 
function handleKeyCameraEvent(event) {
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

function handleKeyMovementEvent(event) {
    if(cameraView.positiveZ) {
        switch(event.key) {
            case 'ArrowUp' : keys.ArrowUp = true; break;   
            case 'ArrowDown' : keys.ArrowDown = true; break;   
            case 'ArrowLeft' : keys.ArrowLeft = true; break;   
            case 'ArrowRight' : keys.ArrowRight = true; break;   
        }   
    }
}

//move the block using the keys object
export function moveBlock() {
    if(keys.ArrowUp) {
        move(-1, 0, 0);
        keys.ArrowUp = false;
    }
    if(keys.ArrowDown) {
        move(1, 0, 0);
        keys.ArrowDown = false;
    }
    if(keys.ArrowLeft) {
        move(0, -1, 0);
        keys.ArrowLeft = false;
    }
    if(keys.ArrowRight) {
        move(0, 1, 0);
        keys.ArrowRight = false;
    }
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
/**
 * returns the current camera view (has a value of true) in cameraView
 */
function getCurrentCameraPosition() {
    for(const position in cameraView) {
        if(cameraView[position]) {
            return position;
        }
    }
    return () => console.err('invalid camera position');    
}
