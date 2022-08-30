import * as THREE from "../node_modules/three/build/three.module.js";
import { zColors, blockSize, splitX, splitY, splitZ } from "./constant.js"
import scene from './scene.js'
import { createMultiMaterialObject } from "../node_modules/three/examples/jsm/utils/SceneUtils.js"
//import {SceneUtils} from '../node_modules/three/examples/jsm/utils/SceneUtils.js';

//if the block touches the floor or another block, it will transform
//into static, separated cubes that won't move anymore
let staticBlocks = [];

export function addStaticBlock(x, y, z) {
    //create array of static blocks if needed only
    if(staticBlocks[x] === undefined) staticBlocks[x] = [];
    if(staticBlocks[x][y] === undefined) staticBlocks[x][y] = [];
    
    //create the box with an outliner
    let mesh = createMultiMaterialObject(
        new THREE.BoxGeometry(
            blockSize, blockSize, blockSize
        ), [
            new THREE.MeshBasicMaterial({
                color: 0x000000, shading: THREE.FlatShading, wireframe: true, transparent: true
            }),
            //change color from bottom to top using z coords as index of the colors array
            new THREE.MeshLambertMaterial({ color: zColors[z]})
        ]
    )
    
    mesh.position.x = (x - splitX / 2) //transform 0 -> splitX into -splitX -> splitX
        * blockSize //scale to threejs units
        + blockSize / 2; // the coordinates of the cube is in the center not the corner
    mesh.position.y = (y - splitY / 2) * blockSize + blockSize / 2;
    mesh.position.z = (z - splitZ / 2) * blockSize + blockSize / 2;
    
    mesh.overdraw = true;
    
    scene.add(mesh)
    staticBlocks[x][y][z] = mesh;
}
