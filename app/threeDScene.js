'use_strict';

const THREE = require('three');
const TimelineAudio = require('three-audio-timeline');
const Controls = require('./controls');
const Envelop = require('./envelop');
const Helpers = require('./helpers');
const Record = require('./record');
const MaxToBrowser = require('./maxToBrowser');

class threeDScene {
    constructor() {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // Stage for rendering.
        this.renderer.setClearColor(new THREE.Color(0x666666));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container = document.body.appendChild(this.renderer.domElement);

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));

        // Trackball defaut
        this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        
        //Envelop
        let maxToBrowser = new MaxToBrowser();
        this.envelop = new Envelop(this.scene, maxToBrowser);
        this.timeline = new TimelineAudio.Timeline();
        this.timeline.envelop = this.envelop;
        this.helpers = new Helpers(this.scene);
        
        let inputCount = 0;
        for (let input in this.envelop.inputs) {
            let EnvelopInput = new TimelineAudio.Tracks.Keyframe("Envelop " + inputCount, this.envelop.inputs[input].position, this.timeline);
            let max = 40;
            let min = 5;

            EnvelopInput
                .keyframe({ 
                    x: 0,
                    y: 10
                }, 1, "Quadratic.EaseIn")
                .keyframe({
                    x: 20,
                    y: 20
                }, 2, "Quadratic.EaseIn")
                .keyframe({
                    x: 30,
                    y: 30
                }, 2, "Quadratic.EaseIn")
                .keyframe({
                    x: 40,
                    y: 40
                }, 2, "Quadratic.EaseIn")
                .keyframe({
                    x: 50
                }, 2, "Quadratic.EaseIn");

            inputCount += 1;
        }

        this.timeline.GUI = new TimelineAudio.GUI(this.timeline);
        this.animate(); 
    }
    animate() {
        let delta = this.clock.getDelta();
        this.helpers.stats.begin();
        this.controlSwitcher.controls.update(delta);
        this.timeline.update(delta);
        this.envelop.update(delta);
        this.renderer.render(this.scene, this.camera);

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
}

module.exports = threeDScene;
