const THREE = require('three');
const VRControls = require('../vendor/VRControls');
const VREffect = require('../vendor/VREffect');
const TrackballControls = require('../vendor/TrackballControls');
const OrbitControls = require('../vendor/OrbitControls');

class Controls {
    constructor(type, threeDScene, camera, renderer, container) {
        this.type = type;
        this.scene = threeDScene;
        this.camera = camera;
        this.renderer = renderer;
        this.container = container;
        return this[type].call(this);
    }
    orbit() {
        this.controls = new THREE.OrbitControls(this.camera, this.container);
        this.camera.position.z = 0.01
    }
    trackball() {
        // position and point the camera to the center of the scene
        this.camera.position.x = 50;
        this.camera.position.y = 50;
        this.camera.position.z = 50;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 10.0;
        this.controls.zoomSpeed = 10.0;
        this.controls.panSpeed = 1.0;
        this.controls.staticMoving = true;
        // trackballControls.noZoom=false;
        // trackballControls.noPan=false;
        // trackballControls.dynamicDampingFactor=0.3;

        return this;
    }
    vr() {
        this.controls = new THREE.VRControls(this.camera);
        this.controls.standing = true;
        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.vrDisplay = {};

        navigator.getVRDisplays().then((displays) => {
            if (displays.length > 0) {
                this.vrDisplay = displays[0];
            }

            this.vrDisplay.requestPresent([{ source: this.renderer.domElement }]);
        });

        return this;
    }
}

module.exports = Controls;
