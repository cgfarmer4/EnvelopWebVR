'use_strict';

const THREE = require('three');
const TimelineAudio = require('three-audio-timeline');
const Controls = require('./controls');
const Envelop = require('./envelop');
const Helpers = require('./helpers');
const Record = require('./record');
const MaxToBrowser = require('./maxToBrowser');
const EventEmitter = require('events').EventEmitter;
const IntroCode = require('../examples/rising-sun/scene');
const IntroTimeline = require('../examples/rising-sun/tracks');

class AppMain extends EventEmitter {
    constructor() {
        super();
        this.THREE = THREE;
        this.clock = new THREE.Clock();
        this.renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true
        });
        this.scene = new THREE.Scene();
        this.userScene = new THREE.Scene();
        this.renderer.autoClear = false;
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.camera.position.set(100, 100, 100);

        // Stage for rendering.
        this.renderer.setClearColor(new THREE.Color(0x666666));
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.container = document.body.appendChild(this.renderer.domElement);
        this.detailsRightUIView = document.createElement('div');
        this.detailsRightUIView.id = 'detailsRightUIView';
        document.body.appendChild(this.detailsRightUIView);

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));

        // Trackball defaut
        this.controlSwitcher = new Controls('orbit', this);
        this.helpers = new Helpers(this.scene);

        //Audio
        this.omnitoneAudio = new TimelineAudio.OmnitoneAudio('/examples/rising-sun/rising-sun_Ableton/RisingSunAmbixB.wav');

        //Envelop
        let maxToBrowser = new MaxToBrowser();
        this.envelop = new Envelop(this.scene, maxToBrowser);

        //Timeline
        this.timeline = new TimelineAudio.Timeline(this.omnitoneAudio);
        this.timeline.camera = this.camera;
        this.timeline.envelop = this.envelop;
        this.timeline.UI = new TimelineAudio.UIView(this.timeline);

        //Init with Camera Track
        let cameraPos = new TimelineAudio.Tracks.Keyframe('App.camera.position', this.camera.position, this.timeline);
        cameraPos.keyframe({
            x: 100,
            y: 100,
            z: 100
        }, 0);

        if (navigator.getVRDisplays && navigator.getVRDisplays()) {
            navigator.getVRDisplays().then((displays) => {
                this.vrDisplay = displays[0];
            });
        }
    }
    /**
     * Animation loop.
     */
    animate() {
        let delta = this.clock.getDelta();
        this.helpers.stats.begin();
        this.controlSwitcher.controls.update(delta);

        // Rotate the sound field by passing Three.js camera object. (4x4 matrix)
        this.omnitoneAudio.renderer.setRotationMatrixFromCamera(this.camera.matrix);

        if (this.controlSwitcher.type === 'vr') {
            this.controlSwitcher.effect.requestAnimationFrame(this.animate.bind(this));
            this.controlSwitcher.effect.render(this.userScene, this.camera);
        }
        else {
            requestAnimationFrame(this.animate.bind(this));
            this.timeline.update(delta);
            this.envelop.update(delta);
            this.renderer.clear();
            this.renderer.render(this.scene, this.camera);
            this.renderer.clearDepth();
            this.renderer.render(this.userScene, this.camera);
        }

        if (this.capturing) {
            this.record.cubeMap.update(this.camera, this.userScene);
        }

        this.helpers.stats.end();
    }
    onResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        if (this.controlSwitcher.type === 'vr') {
            this.effect.setSize(window.innerWidth, window.innerHeight);
        }
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
        this.timeline.resetTracks(IntroTimeline, this.userScene);
        
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