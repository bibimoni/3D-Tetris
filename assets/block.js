import * as THREE from "../node_modules/three/build/three.module.js";
import { blockSize, splitX, splitY, splitZ } from "./constant.js"
import * as BufferGeometryUtils from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { createMultiMaterialObject } from "../node_modules/three/examples/jsm/utils/SceneUtils.js"
import { addStaticBlock } from "./gameGrid.js";
import scene from "./scene.js"
import { resetRotationIndex } from "./controller.js";
import { fields, FIELD } from "./board.js";
import { checkCollision, COLLISION } from "./board.js";
import { setGameOver } from "../index.js"

const points = document.getElementById("points");

//clone this because object is editable even in a different memory location
export function cloneVector(vector) {
    return {x: vector.x, y: vector.y, z: vector.z}
}

function roundVector(vector) {
    let temp = vector;
    temp.x = Math.round(vector.x);
    temp.y = Math.round(vector.y);
    temp.z = Math.round(vector.z);
    return temp;
} 

export let blockMesh;
export let shape = [];
export let position;
export let currentBlockType;
export let shapes = [
    //define a block shape and its always start at 0, 0, 0 
    // [   
    //     {x: 0, y: 0, z: 0},
    //     {x: 1, y: 0, z: 0},
    //     {x: 2, y: 0, z: 0},
    //     {x: 2, y: 0, z: -1},
    //     {x: 2, y: 1, z: 0},
    // ],
    // [
    //     {x: 0, y: 0, z: 0},
    //     {x: 1, y: 0, z: 0},
    //     {x: 2, y: 0, z: 0},
    //     {x: 3, y: 0, z: 0},
    //     {x: 0, y: 1, z: 0},
    //     {x: 1, y: 1, z: 0},
    //     {x: 2, y: 1, z: 0},
    //     {x: 3, y: 1, z: 0},
    //     {x: 0, y: 2, z: 0},
    //     {x: 1, y: 2, z: 0},
    //     {x: 2, y: 2, z: 0},
    //     {x: 3, y: 2, z: 0},
    //     {x: 0, y: 3, z: 0},
    //     {x: 1, y: 3, z: 0},
    //     {x: 2, y: 3, z: 0},
    //     {x: 3, y: 3, z: 0},
    // ],
    [
        {x: 0, y: 0, z: 0},
        {x: 0, y: 0, z: -1},
        {x: 0, y: 0, z: -2},
        {x: 0, y: 0, z: -3},
        {x: 0, y: 0, z: -4},
        {x: 1, y: 0, z: 0},
        {x: 1, y: 0, z: -1},
        {x: 1, y: 0, z: -2},
        {x: 1, y: 0, z: -3},
        {x: 1, y: 0, z: -4},
        {x: 0, y: 1, z: 0},
        {x: 0, y: 1, z: -1},
        {x: 0, y: 1, z: -2},
        {x: 0, y: 1, z: -3},
        {x: 0, y: 1, z: -4},
        {x: 1, y: 1, z: 0},
        {x: 1, y: 1, z: -1},
        {x: 1, y: 1, z: -2},
        {x: 1, y: 1, z: -3},
        {x: 1, y: 1, z: -4},
    ]
    
    
];

export function generateBlock() {
    resetRotationIndex();

    //take a shape randomly and copy it
    let geometry, tempGeometry, geometryArray = [];
    
    let type = Math.floor(Math.random() * (shapes.length));
        
    currentBlockType = type
    
    //take that random shape into 1 specific variable so that we can easily dealt with it
    shape = [];
    
    for(let i = 0; i < shapes[type].length; i++) {
        //we use clone vector because the shapes may be changed
        shape[i] = cloneVector(shapes[type][i])
    }
    
    //connect all the cube into 1 shape
    geometry = new THREE.BoxBufferGeometry(blockSize, blockSize, blockSize);
    
    for(let i = 0; i < shape.length; i++) {
        tempGeometry = new THREE.BoxBufferGeometry(blockSize, blockSize, blockSize);
        tempGeometry.translate(blockSize * shape[i].x, blockSize * shape[i].y, blockSize * shape[i].z)
        geometryArray.push(tempGeometry);
        
    }
    geometry = BufferGeometryUtils.mergeBufferGeometries(geometryArray);

    blockMesh = createMultiMaterialObject(geometry, [
        new THREE.MeshBasicMaterial({color: 0x000000, wireframe: true, transparent: true}),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    ])
    
    // initial position and rotation
    position = {
        //x and y are cenetered
        x: Math.floor(splitX / 2) - 1,
        y: Math.floor(splitY / 2) - 1,
        z: splitZ * 1.1,
    }
    
    //collision reaction
    if(checkCollision(true) === COLLISION.GROUND) {
        setGameOver(true);
        points.innerHTML = "GAME OVER";
    }
    
    blockMesh.position.x = (position.x - splitX / 2) * (blockSize / 2);
    blockMesh.position.y = (position.y - splitY / 2) * (blockSize / 2);
    blockMesh.position.z = (position.z - splitZ / 2) * blockSize + (blockSize / 2);
    
    blockMesh.rotation.x = 0
    blockMesh.rotation.y = 0
    blockMesh.rotation.z = 0
        
    scene.add(blockMesh);
}

export function rotate(x, y, z) {
    blockMesh.rotation.x += x * Math.PI / 180;
    blockMesh.rotation.y += y * Math.PI / 180;
    blockMesh.rotation.z += z * Math.PI / 180;
    
    //create a rotation matrix and multiply it 
    //with shape's every vector using the clone vector
    let rotationMatrix = new THREE.Matrix4();
    rotationMatrix.makeRotationFromEuler(blockMesh.rotation);
    
    for(let i = 0; i < shape.length; i++) {
        let currentShape = shapes[currentBlockType][i];
        
        let vectorX = currentShape.x;
        let vectorY = currentShape.y;
        let vectorZ = currentShape.z;    
        
        let shapeVector = new THREE.Vector3(vectorX, vectorY, vectorZ);
        let newShape = shapeVector.applyMatrix4(
            rotationMatrix //multiply the current shape with the rotation matrix    
        )
        //round for the index in the board array
        shape[i] = roundVector(newShape);
    }
    
    //if there is collision
    if(checkCollision(false) === COLLISION.WALL) {
        rotate(-x, -y, -z); //undoing the rotation
    }
}

export function move(x, y, z) {
    blockMesh.position.x += x * blockSize;
    blockMesh.position.y += y * blockSize;
    blockMesh.position.z += z * blockSize;
    position.x += x;
    position.y += y;
    position.z += z;
    
    let collision = checkCollision(( z != 0)) // if z != 0 then check for ground collision
    //invert the move if hit wall
    if(collision === COLLISION.WALL) {
        move(-x, -y, 0);
    }
    
    if(collision === COLLISION.GROUND) {
        hitBottom();
    }
}

//if the block hits the bottom, convert it into a static cube
function hitBottom() {
    petrify();
    scene.remove(blockMesh);
    generateBlock();
}

function petrify() {
    let blockShape = shape;
    for(let i = 0; i < shape.length; i++) {
        addStaticBlock(
            position.x + blockShape [i].x,
            position.y + blockShape [i].y,
            position.z + blockShape [i].z
        )
        
        fields[position.x + blockShape [i].x]
            [position.y + blockShape [i].y]
            [position.z + blockShape [i].z] = FIELD.PETRIFIED;
            
        console.log(position.x + blockShape [i].x, 
            position.y + blockShape [i].y, 
            position.z + blockShape [i].z
        )
    }
}
