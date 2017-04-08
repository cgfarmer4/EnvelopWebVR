'use_strict';

const THREE = require('three');

const INCHES = 1;
const FEET = 12 * INCHES;
const WIDTH = 20 * FEET + 10.25 * INCHES;
const DEPTH = 41 * FEET + 6 * INCHES;

const INNER_OFFSET_X = WIDTH / 2. - 1 * FEET - 8.75 * INCHES;
const OUTER_OFFSET_X = WIDTH / 2. - 5 * FEET - 1.75 * INCHES;
const INNER_OFFSET_Z = -DEPTH / 2. + 15 * FEET + 10.75 * INCHES;
const OUTER_OFFSET_Z = -DEPTH / 2. + 7 * FEET + 8 * INCHES;

const SUB_OFFSET_X = 36 * INCHES;
const SUB_OFFSET_Z = 20 * INCHES;

class Midway {
    constructor() {
        this.COLUMN_POSITIONS = [
            new THREE.Vector3(-OUTER_OFFSET_X, -OUTER_OFFSET_Z, 101),
            new THREE.Vector3(-INNER_OFFSET_X, -INNER_OFFSET_Z, 102),
            new THREE.Vector3(-INNER_OFFSET_X, INNER_OFFSET_Z, 103),
            new THREE.Vector3(-OUTER_OFFSET_X, OUTER_OFFSET_Z, 104),
            new THREE.Vector3(OUTER_OFFSET_X, OUTER_OFFSET_Z, 105),
            new THREE.Vector3(INNER_OFFSET_X, INNER_OFFSET_Z, 106),
            new THREE.Vector3(INNER_OFFSET_X, -INNER_OFFSET_Z, 107),
            new THREE.Vector3(OUTER_OFFSET_X, -OUTER_OFFSET_Z, 108)
        ];

        this.SUB_POSITIONS = [
            new THREE.Vector3().copy(this.COLUMN_POSITIONS[0]).add(new THREE.Vector3(-SUB_OFFSET_X, -SUB_OFFSET_Z, 0)),
            new THREE.Vector3().copy(this.COLUMN_POSITIONS[3]).add(new THREE.Vector3(-SUB_OFFSET_X, SUB_OFFSET_Z, 0)),
            new THREE.Vector3().copy(this.COLUMN_POSITIONS[4]).add(new THREE.Vector3(SUB_OFFSET_X, SUB_OFFSET_Z, 0)),
            new THREE.Vector3().copy(this.COLUMN_POSITIONS[7]).add(new THREE.Vector3(SUB_OFFSET_X, -SUB_OFFSET_Z, 0))
        ];
    }
}

module.exports = Midway;