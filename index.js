import * as THREE from "../node_modules/three/build/three.module.js";
import scene from './assets/scene.js';
import renderer from './assets/renderer.js';
import controller, {updateOnResize} from './assets/controller.js';
import camera from './assets/camera.js';
import boundingBox from './assets/boundingBox.js';
import stats from './assets/stats.js';
import { gameStepTime } from './assets/constant.js'
import { move, generateBlock } from './assets/block.js';
import { moveBlock } from './assets/controller.js'

const playButton = document.getElementById('play-btn');
const points = document.getElementById('points');
const menu = document.getElementById('menu');

var ready = true, Stats,
_lastFrameTime = Date.now(), gameOver, frameTime = 0, cumulatedFrameTime = 0,
currentPoints;

document.body.appendChild(renderer.domElement)   

//playButton.addEventListener('click', () => {
    points.style.display = "block";
    menu.style.display = "none";
    init();
//})

function init() {   
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = ( function () {
            return window.webkitRequestAnimationFrame ||
                window.mozRequestAnimationFrame ||
                window.oRequestAnimationFrame ||
                window.msRequestAnimationFrame ||
                function (/* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
                    window.setTimeout(callback, 1000 / 60);
                };
        })();
    }
    startGame();   
}

function startGame() {
    if(ready) {
        Stats = stats();
        ready = false;
        
        generateBlock();
        animation();
        controller();
        boundingBox(); //draws bounding box
        
        document.body.appendChild( Stats.domElement );
    }   
}

function animation() {
    var time = Date.now();

    Stats.begin();
    frameTime = time - _lastFrameTime;
    _lastFrameTime = time;
    cumulatedFrameTime += frameTime;
    
    //if there is key movement event move the block
    moveBlock();
    
    while(cumulatedFrameTime > gameStepTime) {
        cumulatedFrameTime -= gameStepTime;
        //block movement        
        move(0, 0, -1);
    }
    
    //resize if necessary
    updateOnResize();
    Stats.update();
    renderer.render(scene, camera);
    
    if(!gameOver) window.requestAnimationFrame(animation);
}



//test
        // var i = 0, j = 0, k = 0, 
        // interval = setInterval(
        //     function() {
        //         if(i==20) {
        //             i=0;j++;
        //         } 
        //         if(j==20) {
        //             j=0;k++;
        //         } 
        //         if(k==20) {
        //             clearInterval(interval); 
        //             return;
        //         } 
        //         addStaticBlock(i,k,j); i++;
        //     },0.0000001)
        
    /**render block
    const block1 = new Block1();
    const block2 = new Block2();
    scene.add(block2);
    scene.add(block1); 
    */