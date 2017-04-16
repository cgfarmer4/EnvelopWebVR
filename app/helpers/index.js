'use_strict';
const THREE = require('three');
const Stats = require('stats.js');

/**
 * Visual helpers for debugging scenes.
 */
class Helpers {
    constructor(scene) {
        // The X axis is red. The Y axis is green. The Z axis is blue.
        let axisHelper = new THREE.AxisHelper(5);
        scene.add(axisHelper);

        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
        document.body.appendChild(this.stats.dom);
    }
}

module.exports = Helpers;
