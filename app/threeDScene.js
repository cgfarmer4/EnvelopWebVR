'use_strict';

const THREE = require('three');
THREE.AnimTimeline = require('three-anim-timeline');
const Envelop = require('./envelop');
const Controls = require('./controls');
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

        // Click events
        document.getElementById('startVR').addEventListener('click', () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'vr') return;
            this.controlSwitcher = new Controls('vr', this.scene, this.camera, this.renderer);
            window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this));
        });

        document.getElementById('startTrackball').addEventListener('click', () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'trackball') return;
            this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        });

        document.getElementById('startButton').addEventListener('click', (event) => {
            this.controlSwitcher = new Controls('orbit', this.scene, this.camera, this.renderer, this.container);
            this.record = new Record(this.renderer, this.camera, this.scene);
            this.capturing = true;
        });

        document.getElementById('envelopGuiView').addEventListener('click', (event) => {
            if (this.envelopGuiDisplay) {
                this.envelopGuiDisplay = false;
                this.envelop.GUI.visible = false;
                this.envelop.GUI.envelopGui.style.display = 'none';
            }
            else {
                this.envelopGuiDisplay = true;
                this.envelop.GUI.visible = true;
                this.envelop.GUI.envelopGui.style.display = 'block';
            }
        });
        document.getElementById('timelineGuiView').addEventListener('click', (event) => {
            if (this.timelineGuiDisplay) {
                this.timelineGuiDisplay = false;
                this.timeline.GUI.container.style.display = 'none';
            }
            else {
                this.timelineGuiDisplay = true;
                this.timeline.GUI.container.style.display = 'block';
            }
        });

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));

        // Trackball defaut
        // this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        
        //Envelop
        let maxToBrowser = new MaxToBrowser();
        this.envelop = new Envelop(this.scene, maxToBrowser);
        this.timeline = new THREE.AnimTimeline.Timeline();
        this.envelop.timeline = this.timeline;
        this.envelopGuiDisplay = false;
        this.timelineGuiDisplay = false;
        
        let number = new THREE.AnimTimeline.Tracks.Number('Test Chart', this.timeline);
        let inputCount = 0;
        for (let input in this.envelop.inputs) {
            let EnvelopInput = new THREE.AnimTimeline.Tracks.Keyframe("Envelop " + inputCount, this.envelop.inputs[input].position, this.timeline);
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

        this.timeline.GUI = new THREE.AnimTimeline.GUI(this.timeline);
        this.animate(); 
    }
    animate() {
        let delta = this.clock.getDelta();
        // this.controlSwitcher.controls.update(delta);
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
