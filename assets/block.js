import * as THREE from "../node_modules/three/build/three.module.js";
import { blockSize, splitX, splitY, splitZ } from "./constant.js"
import * as BufferGeometryUtils from "../node_modules/three/examples/jsm/utils/BufferGeometryUtils.js";
import { createMultiMaterialObject } from "../node_modules/three/examples/jsm/utils/SceneUtils.js"
import { addStaticBlock } from "./gameGrid.js";
import scene from "./scene.js"


//clone this because object is editable even in a different memory location
export function cloneVector(vector) {
    return {x: vector.x, y: vector.y, z: vector.z}
}

export let blockMesh;
export let shape = [];
export let position;
export let shapes = [
    //define a block shape and its always start at 0, 0, 0 
    [   
        {x: 0, y: 0, z: 0},
        {x: 1, y: 0, z: 0},
        {x: 2, y: 0, z: 0},
        {x: 2, y: 0, z: -1},
        {x: 2, y: 1, z: 0},
    ]
    
];

export function generateBlock() {
    //take a shape randomly and copy it
    let geometry, tempGeometry, geometryArray = [];
    
    let type = Math.floor(Math.random() * (shapes.length));
        
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
        new THREE.MeshBasicMaterial({color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true}),
        new THREE.MeshLambertMaterial({ color: 0xff0000 })
    ])
    
    // initial position and rotation
    position = {
        //x and y are cenetered
        x: Math.floor(splitX / 2) - 1,
        y: Math.floor(splitY / 2) - 1,
        z: 15,
    }
    
    blockMesh.position.x = (position.x - splitX / 2) * (blockSize / 2);
    blockMesh.position.y = (position.y - splitY / 2) * (blockSize / 2);
    blockMesh.position.z = (position.z - splitZ / 2) * blockSize + (blockSize / 2);
    
    blockMesh.rotation.x = 0
    blockMesh.rotation.y = 0
    blockMesh.rotation.z = 0
        
    console.log(blockMesh.position);
    scene.add(blockMesh);
}

export function rotate(x, y, z) {
    blockMesh.rotation.x += x * Math.PI / 180;
    blockMesh.rotation.y += y * Math.PI / 180;
    blockMesh.rotation.z += z * Math.PI / 180;
}

export function move(x, y, z) {
    blockMesh.position.x += x * blockSize;
    blockMesh.position.y += y * blockSize;
    blockMesh.position.z += z * blockSize;
    position.x += x;
    position.y += y;
    position.z += z;
    
    if(position.z <= 0) {
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
    for(let i = 0; i < shape.length; i++) {
        addStaticBlock(
            position.x + shape[i].x,
            position.y + shape[i].y,
            position.z + shape[i].z
        )
    }
}
