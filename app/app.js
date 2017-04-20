'use_strict';

const THREE = require('three');
const TimelineAudio = require('three-audio-timeline');
const Controls = require('./controls');
const Envelop = require('./envelop');
const Helpers = require('./helpers');
const Record = require('./record');
const MaxToBrowser = require('./maxToBrowser');
const EventEmitter = require('events').EventEmitter;

class AppMain extends EventEmitter {
    constructor() {
        super();
        this.THREE = THREE;
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        
        this.scene = new THREE.Scene();
        this.renderer.autoClear = false;
        this.userScene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);

        // Stage for rendering.
        this.renderer.setClearColor(new THREE.Color(0x666666));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container = document.body.appendChild(this.renderer.domElement);

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));

        // Trackball defaut
        this.controlSwitcher = new Controls('orbit', this.scene, this.camera);
        this.helpers = new Helpers(this.scene);

        //Envelop
        let maxToBrowser = new MaxToBrowser();
        this.envelop = new Envelop(this.scene, maxToBrowser);

        //Timeline
        this.timeline = new TimelineAudio.Timeline();
        this.timeline.camera = this.camera;
        this.timeline.envelop = this.envelop;
        this.timeline.GUI = new TimelineAudio.GUI(this.timeline);

        //Init with Camera Track
        let cameraPos = new TimelineAudio.Tracks.Keyframe('Camera Position', this.camera.position, this.timeline);
        cameraPos.keyframe({
            x: 100,
            y: 100,
            z: 100
        }, 0);

        this.animate();
    }
    animate() {
        let delta = this.clock.getDelta();
        this.helpers.stats.begin();
        this.controlSwitcher.controls.update(delta);
        this.timeline.update(delta);
        this.envelop.update(delta);
        this.renderer.clear();
        this.renderer.render(this.scene, this.camera);
        this.renderer.clearDepth();
        this.renderer.render(this.userScene, this.camera);

        // If we don't change the source here, the HMD will not move the camera.
        // if (this.controlSwitcher.controls.type === 'vr') {
        //     this.vrDisplay.requestAnimationFrame(this.animate.bind(this));
        //     this.effect.render(this.scene, this.camera);
        // }

        if (this.capturing) {
            this.record.cubeMap.update(this.camera, this.scene);
        }
        this.helpers.stats.end();
        requestAnimationFrame(this.animate.bind(this));
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        // if (this.controlSwitcher.controls.type === 'vr') {
        //     this.effect.setSize(window.innerWidth, window.innerHeight);
        // }
    }
    initCode() {
        this.code = "/**\n\
* Declare all scene targets.\n\
*\n\
* Variables available here: \n\
*\n\
* THREE, App.userScene, App.camera,\n\
* App.renderer, App.controls, App.timeline.\n\
*\n\
* Here is where the code loops lives in the threeDScene.js\n\
* file.\n\
*/\n\
let geometry = new App.THREE.CubeGeometry(10, 10, 10);\n\
let material = new App.THREE.MeshNormalMaterial();\n\
let cube = new App.THREE.Mesh(geometry, material);\n\
cube.position.y = 71;\n\
cube.name = 'booyah';\n\
App.userScene.add(cube);\n\
App.timeline.targets.push(cube);";

        let script = document.createElement('script');
        script.id = 'include-scene';
        script.textContent = '( function () { ' + this.code + ' } )()';
        document.head.appendChild(script);

        this.on('app:codeUpdate', (event) => {
            //Remove Script
            let oldScript = document.getElementById('include-scene');
            document.head.removeChild(oldScript);

            //Reset Scene
            while (this.userScene.children.length > 0) {
                this.userScene.remove(this.userScene.children[0]);
            }

            //Reset Targets
            this.timeline.targets = [];

            let script = document.createElement('script');
            script.id = 'include-scene';
            script.textContent = '( function () { ' + this.code + ' } )()';
            document.head.appendChild(script);
        });
    }
}

module.exports = AppMain;
