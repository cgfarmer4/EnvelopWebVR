const THREE = require('three');
const VRControls = require('../vendor/VRControls');
const VREffect = require('../vendor/VREffect');
const TrackballControls = require('../vendor/TrackballControls');
const OrbitControls = require('../vendor/OrbitControls');

class Controls {
    constructor(type, app) {
        this.type = type;
        this.scene = app.scene;
        this.camera = app.camera;
        this.renderer = app.renderer;
        this.container = app.container;
        this.vrDisplay = app.vrDisplay;
        
        return this[type].call(this);
    }
    orbit() {
        this.controls = new THREE.OrbitControls(this.camera, this.container);
        this.camera.position.x = 465;
        this.camera.position.y = 465;
        this.camera.position.z = 465;
    }
    trackball() {
        // position and point the camera to the center of the scene
        this.camera.position.x = 50;
        this.camera.position.y = 50;
        this.camera.position.z = 50;
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.controls = new THREE.TrackballControls(this.camera);
        this.controls.rotateSpeed = 5.0;
        this.controls.zoomSpeed = 10.0;
        this.controls.panSpeed = 1.0;
        // this.controls.staticMoving = false;
        // this.controls.noZoom=true;
        // this.controls.noPan=true;
        // this.controls.dynamicDampingFactor=0.3;

        return this;
    }
    vr() {
        this.controls = new THREE.VRControls(this.camera);
        this.renderer.sortObjects = false;
        this.renderer.autoClear = true;
        this.controls.standing = true;
        this.effect = new THREE.VREffect(this.renderer);
        this.vrDisplay.requestPresent([{ source: this.renderer.domElement }]);
        return this;
    }
}

module.exports = Controls;
