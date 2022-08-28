import * as THREE from "../node_modules/three/build/three.module.js";
import { createIndividualBlock } from './utils.js';
import { blockSize } from './constant.js'
//const blockColor = [0xffffff];

export default function Block1() {
    const block1 = createBlock1();
    return block1;   
}

function createBlock1() {
    
    const block = new THREE.Group();
    
    const individualBlock1 = createIndividualBlock(blockSize, 
        blockSize, 
        blockSize, 
        0xffffff
    );    
    const individualBlock2 = createIndividualBlock(blockSize, 
        blockSize, 
        blockSize, 
        0xffffff, 
        'left', 
        individualBlock1.position
    );
    const individualBlock3 = createIndividualBlock(blockSize,
        blockSize,
        blockSize,
        0xffffff,
        'up',
        individualBlock1.position
    )
    
    block.add(individualBlock1);
    block.add(individualBlock2);
    block.add(individualBlock3);
    
    return block;
}

