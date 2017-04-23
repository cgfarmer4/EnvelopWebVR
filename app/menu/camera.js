'use_strict';

class CameraUIView {
    constructor(timeline, camera) {
        this.timeline = timeline;
        this.camera = camera;
        this.visible = false;
        this.element = document.createElement('div');
        this.element.id = 'cameraView'
        this.element.innerHTML = this.template();
        this.position = this.element.querySelector('#cameraPosition');
        this.domEvents();
        this.timeline.on('update', this.setPosition.bind(this));
    }
    domEvents() {
        let close = this.element.querySelector('header #closeCamera');
        close.onclick = (event) => {
            this.element.style.display = 'none';
        }
    }
    setPosition() {
        this.position.innerHTML = `${Math.floor(this.camera.position.x * 100) / 100}, 
                                    ${Math.floor(this.camera.position.y * 100) / 100}, 
                                    ${Math.floor(this.camera.position.z * 100) / 100}`;
    }
    template() {
        return `<div id="cameraUI">
                    <header>
                        <h3>Camera</h3>
                        <div id="closeCamera">x</div>
                    </header>
                    <h4>Position (x,y,z)</h4>
                    <div id="cameraPosition"></div>
                </div>`;
    }
}

module.exports = CameraUIView;
