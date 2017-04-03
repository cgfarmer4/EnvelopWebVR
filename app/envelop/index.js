'use_strict';

const EnvelopModel = require('./model');
const THREE = require('three');

class Envelop {
    constructor(scene) {
        this.numInputs = 8;
        
        this.speakers = {};
        this.towers = {};
        this.inputs = {};

        this.scene = scene;
        this.setupSpeakerModel(this.mapSceneToModel.bind(this));
        this.setupInputModel();
    }
    setupInputModel() {
        for (let x = 0; x < this.numInputs; x++) {
            let geometry = new THREE.SphereGeometry(1, 32, 32);
            let material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
            let sphere = new THREE.Mesh(geometry, material);
            sphere.material.transparent = true;
            this.inputs["Input" + x] = sphere;
            this.scene.add(sphere);
        }
    }
    setupSpeakerModel(cb) {
        let loader = new THREE.ObjectLoader();
        loader.parse(EnvelopModel, (blenderModel) => {
            this.scene.add(blenderModel);
            cb();
        });
    }
    /**
     * Map blender layer names to imported Three.js objects
     * @param {Object} Three.js Scene
     */
    mapSceneToModel() {
        this.scene.children[0].children.forEach((child) => {
            if (child.name.indexOf("Speaker") != -1) {
                this.speakers[child.name] = child;
            }
            if (child.name.indexOf("Tower") != -1) {
                this.towers[child.name] = child;
            }
        });

        for (let speaker in this.speakers) {
            this.speakers[speaker].material.transparent = true;
            this.speakers[speaker].material.opacity = .1;
        }

        for (let tower in this.towers) {
            this.towers[tower].material.transparent = true;
            this.towers[tower].material.opacity = .1;
        }
    }
}

module.exports = Envelop;