import * as THREE from "../node_modules/three/build/three.module.js";
import scene from './scene.js';
import { blockSize } from './constant.js';
import { splitX, splitY, splitZ, width, height } from './constant.js'

export default function boundingBox() {
    
    const box = drawBox();
    box.forEach(line => {
        scene.add(line);
    })
    const grid = drawGridLines();
    grid.forEach(gridLine => {
        scene.add(gridLine);
    })
}
/**
 * don't give a fuck about these please, just... ignore it
 * @returns an array of lines to form a box
 */
const drawBox = () => {
    const lines = [];
    //draw 4 columns    
    lines.push(drawALine([splitX / 2, splitX / 2, -splitX / 2,
        splitX / 2, splitX / 2, splitX / 2], 0x000000)) 
    lines.push(drawALine([-splitX / 2, splitX / 2, -splitX / 2,
        -splitX / 2, splitX / 2, splitX / 2], 0x000000));
    lines.push(drawALine([splitX / 2, -splitX / 2, -splitX / 2,
        splitX / 2, -splitX / 2, splitX / 2], 0x000000))
    lines.push(drawALine([-splitX / 2, -splitX / 2, -splitX / 2,
        -splitX / 2, -splitX / 2, splitX / 2], 0x000000));
    //draw bottom rectangle
    lines.push(drawALine([splitX / 2, splitX / 2, -splitX / 2,
        -splitX / 2, splitX / 2, -splitX / 2], 0x000000)) 
    lines.push(drawALine([-splitX / 2, splitX / 2, -splitX / 2,
        -splitX / 2, -splitX / 2, -splitX / 2], 0x000000));
    lines.push(drawALine([-splitX / 2, -splitX / 2, -splitX / 2,
        splitX / 2, -splitX / 2, -splitX / 2], 0x000000))
    lines.push(drawALine([splitX / 2, -splitX / 2, -splitX / 2,
        splitX / 2, splitX / 2, -splitX / 2], 0x000000));
    //draw top rectangle
    lines.push(drawALine([splitX / 2, splitX / 2, splitX / 2 * 0.9,
        -splitX / 2, splitX / 2, splitX / 2 * 0.9], 0x000000)) 
    lines.push(drawALine([-splitX / 2, splitX / 2, splitX / 2 * 0.9,
        -splitX / 2, -splitX / 2, splitX / 2 * 0.9], 0x000000));
    lines.push(drawALine([-splitX / 2, -splitX / 2, splitX / 2 * 0.9,
        splitX / 2, -splitX / 2, splitX / 2 * 0.9], 0x000000))
    lines.push(drawALine([splitX / 2, -splitX / 2, splitX / 2 * 0.9,
        splitX / 2, splitX / 2, splitX / 2 * 0.9], 0x000000));
    return lines;
}

const drawGridLines = () => {
    const lines = [];
    for(let i = 0; i < splitX; i++) {
        lines.push(drawALine(
            [
                i - (splitX / 2), 
                -splitX / 2 , 
                -splitX / 2, 
                i - (splitX / 2), 
                splitX / 2, 
                -splitX / 2
            ],
            0x000000
        ));
        lines.push(drawALine(
            [
                -splitX / 2 , 
                i - (splitX / 2),                
                -splitX / 2, 
                splitX / 2, 
                i - (splitX / 2),                 
                -splitX / 2
            ],
            0x000000
        ));
    }
    return lines;
}

/**
 * draw a line with the adjacent points represent 1 line
 * @param {array} coords (N coords (x, y, z)) [x1, y1, z1, x2, y2, z2, ..., xN, yN, zN] 
 * @param { color } HEX color code
 * @returns 
 */


const drawALine = (coords, color) => {
    if(coords.length % 3 !== 0) {
        console.error("invalid coordinates");
        return;
    }
    //corner points of the grid (x, y, z)
    const array = [];
    for(const coord of coords) {
        array.push(coord);
    }
    const points = new Float32Array(array);
    for(let i = 0; i < points.length; i++) {
        points[i] *= blockSize;
    }
    //create a blue linebasicmaterial
    const material = new THREE.LineBasicMaterial({ color: color });
    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute( 'position', new THREE.BufferAttribute( points, 3 ));
    const mesh = new THREE.Line( geometry, material );
    return mesh;
}