'use_strict';
const ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/theme/monokai');

class Editor {
    constructor(controls) {
        this.element = document.createElement('div');
        this.element.id = 'editor';
        this.controls = controls;

        //Styles
        this.element.style.width = window.innerWidth + 'px';
        this.element.style.height = window.innerHeight + 'px';
        this.element.style.position = 'absolute';
        this.element.style.top = 0;
        this.element.style.left = 0;
        this.element.style.background = 'rgba(0,0,0,.4)';
        this.element.style.background = 'rgba(0,0,0,.4)';
        this.element.style['z-index'] = 100;

        //Template
        this.element.innerHTML = this.template();
        document.body.appendChild(this.element);

        //Setup Ace Editor
        this.initCode();

        //Events
        let close = this.element.querySelector('#closeEditor');
        close.onclick = this.close.bind(this);
    }
    initCode() {
        let sceneCode = this.element.querySelector('#sceneCode');
        sceneCode.style.height = window.innerHeight - 100 + 'px';

        let tracksCode = this.element.querySelector('#tracksCode');
        tracksCode.style.height = window.innerHeight - 100 + 'px';

        this.sceneEditor = ace.edit('sceneCode');
        this.sceneEditor.getSession().setMode('ace/mode/javascript');
        this.sceneEditor.setTheme('ace/theme/monokai');

        this.tracksEditor = ace.edit('tracksCode');
        this.tracksEditor.getSession().setMode('ace/mode/json');
        this.tracksEditor.setTheme('ace/theme/monokai');
    }
    close() {
        this.element.style.display = 'none';
        this.controls.enabled = true;
    }
    template() {
        return `
            <div id="sceneEditor">
                <h2> Scene </h2>
                <div id="sceneCode">
/**
 * Declare all scene targets.
 * 
 * Variables available here: 
 * 
 * THREE, this.scene, this.camera, 
 * this.renderer, this.controls, this.timeline.
 * 
 * Here is where the code loops lives in the threeDScene.js
 * file.
 */
let geometry = new THREE.CubeGeometry(10, 10, 10);
let material = new new THREE.MeshNormalMaterial();
let cube = new THREE.Mesh(geometry, material);
cube.position.y = 71;
cube.name = 'booyah';

this.scene.add(cube);
this.timeline.targets.push(cube);
                </div>
            </div>
            <div id="tracksEditor">
                <h2> Tracks </h2>
                <div id="tracksCode">{}</div>
            </div>
            <ul id="editorOptions">
                <li class="largeButton" id="save"> Save </li>
            </ul>
            <ul id="closeEditor">
                <li> X </li>
            </ul>
        `;
    }
}

module.exports = Editor;
