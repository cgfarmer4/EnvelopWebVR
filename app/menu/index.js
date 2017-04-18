'use_strict';

const Controls = require('../controls');
const Record = require('../record');

/**
 * Application centric menu. For viewing main UI pieces and 
 */
class Menu {
    constructor(threeD) {
        this.helpers = threeD.helpers;
        this.scene = threeD.scene;
        this.camera = threeD.camera;
        this.renderer = threeD.renderer;
        this.envelop = threeD.envelop;
        this.timeline = threeD.timeline;
        this.controlSwitcher = threeD.controlSwitcher;

        this.envelopGuiDisplay = false;
        this.timelineGuiDisplay = false;

        //Render
        let menu = document.createElement('div');
        menu.innerHTML = this.template();
        document.body.appendChild(menu);

        this.domEvents();
    }
    /**
     * Click Events
     */
    domEvents() {
        //Controls TODO: Consolidate these.
        let startVR = document.getElementById('startVR');
        startVR.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'vr') return;
            this.controlSwitcher = new Controls('vr', this.scene, this.camera, this.renderer);
            window.addEventListener('vrdisplaypresentchange', this.onResize.bind(this));
        };

        let startTrackball = document.getElementById('startTrackball');
        startTrackball.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'trackball') return;
            this.controlSwitcher = new Controls('trackball', this.scene, this.camera);
        };

        let startOrbit = document.getElementById('startOrbit');
        startOrbit.onclick = () => {
            if (this.controlSwitcher && this.controlSwitcher.controls.type === 'orbit') return;
            this.controlSwitcher = new Controls('orbit', this.scene, this.camera);
        };

        //Capture
        let startCapture = document.getElementById('startCapture');
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
        let envelopGuiView = document.getElementById('envelopGuiView');
        envelopGuiView.onclick = (event) => {
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
        };

        let timelineGuiView = document.getElementById('timelineGuiView');
        timelineGuiView.onclick = (event) => {
            if (this.timelineGuiDisplay) {
                this.timelineGuiDisplay = false;
                this.timeline.GUI.container.style.display = 'none';
            }
            else {
                this.timelineGuiDisplay = true;
                this.timeline.GUI.container.style.display = 'block';
            }
        };

        //View -> Helpers
        let helpersAxes = document.getElementById('helpers_axes');
        helpersAxes.onclick = (event) => {
            if (this.helpers.axisHelper.visible) {
                this.helpers.axisHelper.visible = false;
            }
            else {
                this.helpers.axisHelper.visible = true;
            }
        }

        let helpersFPS = document.getElementById('helpers_fps');
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
                        <li> <a>Controls</a>
                            <ul>
                                <li id="startTrackball"><a>Trackball</a></li>
                                <li id="startVR"><a>VR</a></li>
                                <li id="startOrbit"><a>Orbit</a></li>
                            </ul>
                        </li>
                        <li> <a>View</a>
                            <ul>
                                <li id="timelineGuiView"><a>Timeline</a></li>
                                <li id="envelopGuiView"><a>Envelop</a></li>
                                <li> <a> Helpers </a>
                                    <ul>
                                        <li id="helpers_axes"> <a>View Scene Axis</a> </li>
                                        <li id="helpers_fps"> <a>View Scene FPS</a> </li>
                                    </ul>
                                </li>
                            </ul>
                        </li>
                        <li> <a>Capture</a>
                            <ul>
                                <li id="startCapture"><a> 360 - Equirectangular </a></li>
                                <!-- <li> 3D - Follow camera </li> -->
                            </ul>
                        </li>
                    </ul>
                </nav>`;
    }
}

module.exports = Menu;