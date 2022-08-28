import * as THREE from "../node_modules/three/build/three.module.js";
import { createIndividualBlock } from './utils.js';
import { blockSize } from './constant.js'

export default function Block2() {
    const block2 = createBlock2();
    return block2;   
}

function createBlock2() {
    
    const block = new THREE.Group();
    const startingCoords = {x: 4, y: blockSize * -1, z: blockSize * -1};
    
    const individualBlock1 = createIndividualBlock(blockSize, 
        blockSize, 
        blockSize, 
        0xeb8f34,
        'none',
        startingCoords,
    );    
    const individualBlock2 = createIndividualBlock(blockSize, 
        blockSize, 
        blockSize, 
        0xeb8f34, 
        'left', 
        individualBlock1.position
    );
    const individualBlock3 = createIndividualBlock(blockSize,
        blockSize,
        blockSize,
        0xeb8f34,
        'up',
        individualBlock2.position
    );
    const individualBlock4 = createIndividualBlock(blockSize,
        blockSize,
        blockSize,
        0xeb8f34,
        'above', 
        individualBlock2.position
    )
    
    block.add(individualBlock1);
    block.add(individualBlock2);
    block.add(individualBlock3);
    block.add(individualBlock4);
    
    return block;
}