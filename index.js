import * as THREE from "../node_modules/three/build/three.module.js";
import scene from './assets/scene.js';
import renderer from './assets/renderer.js';
import controller, {updateOnResize} from './assets/controller.js';
import camera from './assets/camera.js';
import Block1 from './assets/Block1.js';
import Block2 from './assets/Block2.js';
import gameGrid from './assets/gameGrid.js';

var ready = true;
let lastTimeStamp;

init(); // boiler code
controller();
gameGrid();

function init() {
    document.body.appendChild(renderer.domElement)   
    startGame();
}

function startGame() {
    if(ready) {
        ready = false;
        renderer.setAnimationLoop(animation);
    }
}

function animation(timeStamp) {
    if(!lastTimeStamp) {
        lastTimeStamp = timeStamp;
        return;
    }
    
    //render block
    const block1 = new Block1();
    const block2 = new Block2();
    scene.add(block2);
    scene.add(block1); 
    
    const timeDelta = timeStamp - lastTimeStamp;
    
    //resize if necessary
    updateOnResize();

    renderer.render(scene, camera);
    lastTimeStamp = timeStamp;
}


