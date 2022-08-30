import Stats from '../node_modules/stats.js/src/Stats.js'

export default function stats() {
    stats = new Stats();
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.top = '10px';
    stats.domElement.style.left = '10px';

    return stats;
}