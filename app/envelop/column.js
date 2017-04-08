'use_strict'

const THREE = require('three');
const INCHES = 1;
const FEET = 12 * INCHES;

class Column {
    constructor() {
        this.SPEAKER_ANGLE = 22. / 180. * Math.PI;
        this.RADIUS = 20 * INCHES;
        this.HEIGHT = 12 * FEET;

        let geometry = new THREE.CylinderGeometry(this.RADIUS, this.RADIUS, this.HEIGHT, 40, 1, false);
        let material = new THREE.MeshBasicMaterial({ 
            color: 0x000000,
            transparent: true,
            opacity: .3
        });
        this.mesh = new THREE.Mesh(geometry, material);
    }
}

module.exports = Column;