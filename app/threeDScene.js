'use_strict';

import * as THREE from 'three';
import '../vendor/VRControls';
import '../vendor/VREffect';
// import '../vendor/WebVRPolyfill';

class threeDScene {
    constructor() {
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
        this.renderer = new THREE.WebGLRenderer({ 
            antialias: true 
        });

        this.renderer.setPixelRatio(window.devicePixelRatio);

        document.body.appendChild(this.renderer.domElement);

        this.controls = new THREE.VRControls(this.camera);
        this.controls.standing = true;

        this.effect = new THREE.VREffect(this.renderer);
        this.effect.setSize(window.innerWidth, window.innerHeight);

        this.vrDisplay = {};

        navigator.getVRDisplays().then((displays) => {
            if (displays.length > 0) {
                this.vrDisplay = displays[0];
            }
        });

        //Setup Events
        document.querySelector('#startVR').addEventListener('click', () => {
            this.vrDisplay.requestPresent([{source: this.renderer.domElement}]);
            this.isShowingVR = true;
        });

        window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this));
        window.addEventListener('resize', this.onResize.bind(this));

        this.cubes();
        this.animate();
    }
    cubes() {
        this.cubesMesh = [];

        for (let i = 0; i < 100; i++) {

            let material = new THREE.MeshNormalMaterial();
            let geometry = new THREE.BoxGeometry( 50, 50, 50 );
            let mesh = new THREE.Mesh( geometry, material );

            // Give each cube a random position
            mesh.position.x = (Math.random() * 1000) - 500;
            mesh.position.y = (Math.random() * 1000) - 500;
            mesh.position.z = (Math.random() * 1000) - 500;

            this.scene.add(mesh);

            // Store each mesh in array
            this.cubesMesh.push(mesh);
        }
    }
    animate() {
        let cubes = this.cubesMesh;

        //If we don't change the source here, the HMD will not move the camera.
        if(this.isShowingVR) {
            this.vrDisplay.requestAnimationFrame(this.animate.bind(this));    
        }
        else {
            requestAnimationFrame(this.animate.bind(this));    
        }

        // Every frame, rotate the cubes a little bit
        for (let i = 0; i < cubes.length; i++) {
            cubes[i].rotation.x += 0.01;
            cubes[i].rotation.y += 0.02;
        }

        // Render the scene
        this.controls.update();
        this.effect.render(this.scene, this.camera);
    }
    onResize() {
        this.effect.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }
}

module.exports = threeDScene;
