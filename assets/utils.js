import * as THREE from "../node_modules/three/build/three.module.js";

/** create a 1:1:1 block
 * specify the location of the block relative to the other block coords 
 * @param {string} relativeDirection {left, right, up, down, under, above} 
 * @param {object} relativeCoords the other block coords you want to set this block relative to
 * @returns 
 */

export function createIndividualBlock(
    width, 
    height, 
    depth, 
    color, 
    relativeDirection = 'none', 
    relativeCoords = {x: 0, y: 0, z: 0}
) {
    const block = new THREE.Mesh(
        new THREE.BoxBufferGeometry(width, height, depth), 
        new THREE.MeshLambertMaterial({color: color})
    );
    //set default value first
    block.position.x = relativeCoords.x;
    block.position.y = relativeCoords.y;
    block.position.z = relativeCoords.z;
    
    switch(relativeDirection) {
        case 'down' : {
            block.position.x = relativeCoords.x + width;
            break;
        }
        case 'up' : {
            block.position.x = relativeCoords.x - width;
            break;
        }
        case 'under' : {
            block.position.z = relativeCoords.z - depth;
            break;
        }
        case 'above' : {
            block.position.z = relativeCoords.z + depth;
            break;
        }
        case 'right' : {
            block.position.y = relativeCoords.y + height;
            break;
        }
        case 'left' : {
            block.position.y = relativeCoords.y - height;
            break;
        }
        case 'none' : {
            break;
        }
    }  
    return block;
}

