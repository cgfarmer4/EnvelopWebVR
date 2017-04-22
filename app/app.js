'use_strict';

const THREE = require('three');
const TimelineAudio = require('three-audio-timeline');
const Controls = require('./controls');
const Envelop = require('./envelop');
const Helpers = require('./helpers');
const Record = require('./record');
const MaxToBrowser = require('./maxToBrowser');
const EventEmitter = require('events').EventEmitter;
const IntroCode = require('./examples/introduction');

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

        // //Timeline
        this.timeline = new TimelineAudio.Timeline();
        this.timeline.camera = this.camera;
        this.timeline.envelop = this.envelop;
        this.timeline.GUI = new TimelineAudio.GUI(this.timeline);

        //Init with Camera Track
        let cameraPos = new TimelineAudio.Tracks.Keyframe('App.camera.position', this.camera.position, this.timeline);
        cameraPos.keyframe({
            x: 100,
            y: 100,
            z: 100
        }, 0);

        this.animate();
    }
    /**
     * Animation loop.
     */
    animate() {
        requestAnimationFrame(this.animate.bind(this));

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
        
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        // if (this.controlSwitcher.controls.type === 'vr') {
        //     this.effect.setSize(window.innerWidth, window.innerHeight);
        // }
    }
    /**
     * Initialitize template on app create.
     */
    initCode() {
        this.code = IntroCode;

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

            this.timeline.resetTracks(event.tracks, this.userScene);
        });
    }
}

module.exports = AppMain;
