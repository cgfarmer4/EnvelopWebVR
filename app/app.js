'use_strict';

const THREE = require('three');
const Timeline = require('three-audio-timeline');
const Controls = require('./controls');
const Envelop = require('./envelop');
const Helpers = require('./helpers');
const Record = require('./record');
const MaxToBrowser = require('./maxToBrowser');
const EventEmitter = require('events').EventEmitter;

const IntroCode = require('../examples/astronauts/scene');
const IntroTimeline = require('../examples/astronauts/tracks');

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
        this.renderer.shadowMapEnabled = true;
        this.renderer.setClearColor(new THREE.Color(0x000000));
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

        //Envelop
        let maxToBrowser = new MaxToBrowser();
        this.envelop = new Envelop(this.scene, maxToBrowser);

        //Timeline
        this.loader = Timeline.Loader;
        this.timeline = new Timeline.Timeline();
        this.timeline.camera = this.camera;
        this.timeline.envelop = this.envelop;
        this.timeline.UI = new Timeline.UIView(this.timeline);

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
    resetTracks(tracks) {
        if (this.timeline.loader) {
            this.timeline.loader.on('scene:complete', () => {
                this.timeline.resetTracks(tracks, this.userScene);
            });
        }
        else {
            this.timeline.resetTracks(tracks, this.userScene);
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
        this.resetTracks(IntroTimeline);        

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

            this.resetTracks(event.tracks);
        });
    }
}

module.exports = AppMain;