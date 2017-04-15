'use_strict';

const Controls = require('../controls');

/**
 * Application centric menu. For viewing main UI pieces and 
 */
class Menu {
    constructor(threeD) {
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

        
        let startCapture = document.getElementById('startCapture');
        startCapture.onclick = (event) => {
            this.controlSwitcher = new Controls('orbit', this.scene, this.camera, this.renderer, this.container);
            this.record = new Record(this.renderer, this.camera, this.scene);
            this.capturing = true;
        };

        
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
                            </ul>
                        </li>
                        <li> <a>View</a>
                            <ul>
                                <li id="timelineGuiView"><a>Timeline</a></li>
                                <li id="envelopGuiView"><a>Envelop</a></li>
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