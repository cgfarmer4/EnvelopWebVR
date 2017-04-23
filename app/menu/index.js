'use_strict';

const Controls = require('../controls');
const CameraUIView = require('./camera');
const Editor = require('../editor');
const Record = require('../record');

/**
 * Application centric menu. For viewing main UI pieces and 
 */
class Menu {
    constructor(app) {
        this.app = app;
        this.helpers = app.helpers;
        this.scene = app.scene;
        this.camera = app.camera;
        this.renderer = app.renderer;
        this.envelop = app.envelop;
        this.timeline = app.timeline;
        this.controlSwitcher = app.controlSwitcher;
        this.cameraUIView = new CameraUIView(this.timeline, this.camera);
        this.timelineUIDisplay = false;
        this.detailsRightUIView = this.app.detailsRightUIView;

        //Render
        this.element = document.createElement('div');
        this.element.innerHTML = this.template();
        document.body.appendChild(this.element);

        this.domEvents();
    }
    /**
     * Click Events
     */
    domEvents() {
        //Editor 
        let showEditor = this.element.querySelector('#showEditor');
        showEditor.onclick = (event) => {
            if(!this.editor) {
                this.editor = new Editor(this.app, this.controlSwitcher.controls);
            }
            else {
                this.editor.initCode();
                this.editor.element.style.display = 'block';
            }
            this.controlSwitcher.controls.enabled = false;
        }

        //Controls TODO: Consolidate these.
        let startVR = this.element.querySelector('#startVR');
        startVR.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'vr') return;
            this.controlSwitcher = new Controls('vr', this.scene, this.camera, this.renderer);
            window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this));
        };

        let startTrackball = this.element.querySelector('#startTrackball');
        startTrackball.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'trackball') return;
            this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        };

        let startOrbit = this.element.querySelector('#startOrbit');
        startOrbit.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'orbit') return;
            this.controlSwitcher = new Controls('orbit', this.scene, this.camera);
        };

        let enableControls = this.element.querySelector('#enableControls');
        enableControls.onclick = () => {
            if(this.controlSwitcher.controls.enabled) {
                this.controlSwitcher.controls.enabled = false;
            }
            else {
                this.controlSwitcher.controls.enabled = true;
            }
        };

        //Capture
        let startCapture = this.element.querySelector('#startCapture');
        startCapture.onclick = (event) => {
            if (!this.timeline.capturing) {
                this.controlSwitcher = new Controls('orbit', this.scene, this.camera, this.renderer, this.container);
                this.record = new Record(this.renderer, this.camera, this.scene);
                this.timeline.capturing = true;
            }
            else {
                this.record.stop();
                this.record = {};
                this.timeline.capturing = false;
            }
        };


        //View -> UIs
        let envelopUIView = this.element.querySelector('#envelopUIView');
        envelopUIView.onclick = function(event) {
            while(this.detailsRightUIView.firstChild) {
                this.detailsRightUIView.removeChild(this.detailsRightUIView.firstChild);
                this.cameraUIView.visible = false;
            }

            if (this.envelop.UI.visible) {
                this.envelop.UI.visible = false;
                this.envelop.UI.element.style.display = 'none';
            }
            else {
                this.detailsRightUIView.appendChild(this.envelop.UI.element);
                this.envelop.UI.visible = true;
                this.envelop.UI.element.style.display = 'block';
            }
        }.bind(this);


        let cameraUIViewMenu = this.element.querySelector('#cameraUIViewMenu');
        cameraUIViewMenu.onclick = function (event) {
            while (this.detailsRightUIView.firstChild) {
                this.detailsRightUIView.removeChild(this.detailsRightUIView.firstChild);
                this.envelop.UI.visible = false;
            }

            if (this.cameraUIView.visible) {
                this.cameraUIView.visible = false;
                this.cameraUIView.element.style.display = 'none';
            }
            else {
                this.detailsRightUIView.appendChild(this.cameraUIView.element);
                this.cameraUIView.visible = true;
                this.cameraUIView.element.style.display = 'block';
            }
        }.bind(this);


        let timelineUIView = this.element.querySelector('#timelineUIView');
        timelineUIView.onclick = (event) => {
            if (this.timelineUIDisplay) {
                this.timelineUIDisplay = false;
                this.timeline.UI.container.style.display = 'none';
                if (this.timeline.UI.details.element) this.timeline.UI.details.element.style.display = 'none';
            }
            else {
                this.timelineUIDisplay = true;
                this.timeline.UI.container.style.display = 'block';
            }
        };

        //View -> Helpers
        let helpersAxes = this.element.querySelector('#helpers_axes');
        helpersAxes.onclick = (event) => {
            if (this.helpers.axisHelper.visible) {
                this.helpers.axisHelper.visible = false;
            }
            else {
                this.helpers.axisHelper.visible = true;
            }
        }

        let helpersFPS = this.element.querySelector('#helpers_fps');
        helpersFPS.onclick = (event) => {
            if (this.helpers.stats.dom.style.display === 'none') {
                this.helpers.stats.dom.style.display = 'block';
            }
            else {
                this.helpers.stats.dom.style.display = 'none';
            }
        }

    }
    /**
     * HTML
     */
    template() {
        return `<nav id="appMenu">
                    <ul>
                        <li id="showEditor"> <a>Editor</a>
                        </li>
                        <li> <a>Controls</a>
                            <ul>
                                <li id="enableControls"><a>On / Off</a></li>
                                <li id="startTrackball"><a>Trackball</a></li>
                                <li id="startVR"><a>VR</a></li>
                                <li id="startOrbit"><a>Orbit</a></li>
                            </ul>
                        </li>
                        <li> <a>View</a>
                            <ul>
                                <li id="cameraUIViewMenu"><a>Camera</a></li>
                                <li id="timelineUIView"><a>Timeline</a></li>
                                <li id="envelopUIView"><a>Envelop</a></li>
                                <li> <a> Helpers </a>
                                    <ul>
                                        <li id="helpers_axes"> <a>Scene Axis</a> </li>
                                        <li id="helpers_fps"> <a>Scene FPS</a> </li>
                                    </ul>
                                </li>
                                <!--<li>About<li>-->
                            </ul>
                        </li>
                        <li> <a>Capture</a>
                            <ul>
                                <li id="startCapture"><a> 2D </a></li>
                                <li id="startCapture"><a> 360 </a></li>
                                <!-- <li> 3D - Follow camera </li> -->
                            </ul>
                        </li>
                    </ul>
                </nav>`;
    }
}

module.exports = Menu;