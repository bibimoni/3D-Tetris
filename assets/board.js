import * as THREE from "../node_modules/three/build/three.module.js";
import { position, shape } from "./block.js";
import { addPoints } from "./utils.js";
import { staticBlocks, addStaticBlock } from "./gameGrid.js"
import scene from "./scene.js";

export const COLLISION = {NONE: 0, WALL: 1, GROUND: 2}

export const FIELD = {EMPTY: 0, ACTIVE: 1, PETRIFIED: 2}

//store state of the board
export let fields = [];

//create a new board 3D array
export function createBoard(_x, _y, _z) {
    for(let i = 0; i < _x; i++) {
        fields[i] = [];
        for(let j = 0; j < _y; j++) {
            fields[i][j] = [];
            for(let k = 0; k < _z; k++) {
                fields[i][j][k] = FIELD.EMPTY;
            }
        }
    }
}

/**
 * because ground, wall detection is the same as block - block detection
 * so we just want to choose wether to check for ground or not
 * @param {boolean} groundCheck  
 * @returns 
 */
export function checkCollision( groundCheck ) {
    let x, y, z, i;
    
    //create a copy of the current board
    let fieldsCheck = fields;
    let posX = position.x, posY = position.y,
        posZ = position.z, blockShape = shape;
        
    for(i = 0; i < blockShape.length; i++) {
        //4 walls detection from every part of the shape
        
        if((blockShape[i].x + posX) < 0 ||
            (blockShape[i].y + posY) < 0 ||
            (blockShape[i].x + posX) >= fieldsCheck.length ||
            (blockShape[i].y + posY >= fieldsCheck.length)) 
        {
            return COLLISION.WALL;       
        }
        //if the space below is already been taken, return a collision
        if(fieldsCheck[blockShape[i].x + posX]
            [blockShape[i].y + posY]
            [blockShape[i].z + posZ - 1] === FIELD.PETRIFIED) 
        {
            return groundCheck ? COLLISION.GROUND : COLLISION.WALL;   
        }
        if((blockShape[i].z + posZ) <= 0) {
            return COLLISION.GROUND;
        }
    }
}

//check if every slice is full
export function checkSliceComplete() {
    let x, y, z, x2, y2, z2, checkFields = fields;
    let rebuild = false;
    let sum, 
        expected = checkFields[0].length * checkFields.length, // total block in 1 slice
        bonus = 0; 
    
    //from each slice bottom to top so we dont miss everything because we are shiting down
    for(z = 0; z < checkFields[0][0].length; z++) {
        sum = 0;
        //go to each slice to see any piece, increase the sum
        for(y = 0; y < checkFields[0].length; y++) {
            for(x = 0; x < checkFields.length; x++) {
                console.log(checkFields[x][y][z]);
                if(checkFields[x][y][z] === FIELD.PETRIFIED) {
                    sum++;
                    console.log('+1')
                }
            }
        }
        
        //if the slice if full
        if( sum === expected ) {
            bonus += 5 + bonus; // 5, 10, 15, 20, 25, 30, ...
            
            for(y2 = 0; y2 < checkFields[0].length; y2++) {
                for(x2 = 0; x2 < checkFields.length; x2++) {
                    for(z2 = 0; z2 < checkFields[0][0].length; z2++) {
                        checkFields[x2][y2][z2] = checkFields[x2][y2][z2 + 1] // shift down
                    }
                    //set the shifted slice to empty
                    checkFields[x2][y2][checkFields[0][0].length - 1] = FIELD.EMPTY
                    
                }               
            }
            //rebuild the slice / use the variable to check
            rebuild = true;
            //to see if we move down any further
            z--;
        }        
    }
    
    if(bonus) {
        addPoints(bonus);
    }
    //do it on another loop because of multiple changes may have happened
    //check for eveery board field with the corresponding static block and make 
    //the change if needed
    if(rebuild) {
        for(let z = 0; z < checkFields[0][0].length - 1; z++) {
            for(let y = 0; y < checkFields[0].length; y++) {
                for(let x = 0; x < checkFields.length; x++) {
                    //if the block in the board array is filled but there aren't any static block
                    //for visual, we add one
                    if(checkFields[x][y][z] === FIELD.PETRIFIED && !staticBlocks[x][y][z]) {
                        addStaticBlock(x, y, z);
                    }
                    //if the block in the board array is empied but there is a static block
                    //for visual, we remove one
                    if(checkFields[x][y][z] === FIELD.EMPTY && staticBlocks[x][y][z]) {
                        scene.remove(staticBlocks[x][y][z]);
                        staticBlocks[x][y][z] = undefined
                    }
                }
            }
        }
    }
}