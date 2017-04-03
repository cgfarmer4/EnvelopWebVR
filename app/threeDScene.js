'use_strict';

const THREE = require('three');
const Envelop = require('./envelop');
const Controls = require('./controls');
const Record = require('./record');
const ThreeAudio = require('three-audio-timeline');

class threeDScene {
    constructor() {
        this.clock = new THREE.Clock();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, .1, 10000);
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });

        // Stage for rendering.
        this.renderer.setClearColor(new THREE.Color('skyblue'));
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

        document.getElementById('saveButton').addEventListener('click', (event) => {
            this.capturing = false;
            this.record.stop();
        });

        // Window events
        window.addEventListener('resize', this.onResize.bind(this));

        // Trackball defaut
        // this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        
        //Envelop
        this.envelop = new Envelop(this.scene);
        this.timeline = this.setupTimeline();
        let number = new ThreeAudio.Tracks.Number('Test Chart', this.timeline);
        let number1 = new ThreeAudio.Tracks.Number('Test Chart2', this.timeline);
        let position = new ThreeAudio.Tracks.Position('POSI!', this.timeline);
        let position2 = new ThreeAudio.Tracks.Position('POSI!2', this.timeline);
        let position3 = new ThreeAudio.Tracks.Position('POSI!3', this.timeline);

        for(let speaker in this.envelop.speakers) {
            let EnvelopSpeaker = new ThreeAudio.Tracks.Keyframe("Envelop " + speaker, this.envelop.speakers[speaker].material, this.timeline);

            EnvelopSpeaker
                .keyframe(0, { opacity: .2 }, 1, "Quadratic.EaseIn")
                .keyframe(1, { opacity:1 }, .2, "Quadratic.EaseIn")
                .keyframe(1, { opacity: .6 }, .2, "Quadratic.EaseIn")
                .keyframe(1, { opacity: .8 }, .2, "Quadratic.EaseIn")
                .keyframe(1, { opacity:.4 }, .2, "Quadratic.EaseIn");
        }
        
        // let inputCount = 0;
        // let number = new ThreeAudio.Tracks.Number('Test Chart', this.timeline);
        // for (let input in this.envelop.inputs) {
        //     let EnvelopInput = new ThreeAudio.Tracks.Keyframe("Envelop " + inputCount, this.envelop.inputs[input].position, this.timeline);
        //     let max = 40;
        //     let min = 5;

        //     EnvelopInput
        //         .keyframe(0, { 
        //             x: Math.floor(Math.random() * (max - min)) + min, 
        //             y: Math.floor(Math.random() * (max - min)) + min 
        //         }, 1, "Quadratic.EaseIn")
        //         .keyframe(1, {
        //             x: Math.floor(Math.random() * (max - min)) + min, 
        //             y: Math.floor(Math.random() * (max - min)) + min 
        //         }, 2, "Quadratic.EaseIn")
        //         .keyframe(1, {
        //             x: Math.floor(Math.random() * (max - min)) + min, 
        //             y: Math.floor(Math.random() * (max - min)) + min 
        //         }, 2, "Quadratic.EaseIn")
        //         .keyframe(1, {
        //             x: Math.floor(Math.random() * (max - min)) + min, 
        //             y: Math.floor(Math.random() * (max - min)) + min 
        //         }, 2, "Quadratic.EaseIn")
        //         .keyframe(1, {
        //             x: Math.floor(Math.random() * (max - min)) + min, 
        //             y: Math.floor(Math.random() * (max - min)) + min, 
        //             z: 0 
        //         }, 2, "Quadratic.EaseIn");

        //     inputCount += 1;
        // }

        let GUI = new ThreeAudio.GUI(this.timeline);
        this.animate();
    }
    setupTimeline() {
        let timeline = new ThreeAudio.Timeline();
        // let cameraPosition = new ThreeAudio.Tracks.Keyframe("Camera Position", this.camera.position, timeline);

        // cameraPosition
        //     .keyframe(0, { x: 20, y: 20, z: 20 }, 3, "Quadratic.EaseIn")
        //     .keyframe(3, { x: 60, y: 60, z: 60 }, 1, "Quadratic.EaseIn");

        return timeline;
    }
    animate() {
        let delta = this.clock.getDelta();
        // this.controlSwitcher.controls.update(delta);
        this.timeline.update(delta);
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
