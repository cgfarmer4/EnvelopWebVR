'use_strict';
const THREE = require('three');

class Helpers {
    constructor(scene) {
        // The X axis is red. The Y axis is green. The Z axis is blue.
        let axisHelper = new THREE.AxisHelper(5);
        scene.add(axisHelper);
    }
}

module.exports = Helpers;
