const eio = require('engine.io-client');

class maxToBrowser {
    constructor(threeDScene) {
        let self = this;
        const socket = new eio.Socket('ws://localhost:1337/');

        socket.on('open', function(){
            socket.on('message', function(data){
                let oscMessage = JSON.parse(data);
                let channel = "Speaker" + oscMessage.address.substr(18, oscMessage.address.length);
                self.speakers[channel].material.opacity = oscMessage.args[0];
                
                // Input positioning
                // console.info("Source 1", oscMessage[0].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
                // console.info("Source 2", oscMessage[1].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
            });
        });

        this.mapSceneToModel(threeDScene.scene);
    }
    /**
     * Map blender layer names to imported Three.js objects
     * @param {Object} Three.js Scene
     */
    mapSceneToModel(scene) {
        this.speakers = {};
        this.towers = {};

        scene.children[0].children.forEach((child) => {
            if(child.name.indexOf("Speaker") != -1) {
                this.speakers[child.name] = child;
            }
            if(child.name.indexOf("Tower") != -1) {
                this.towers[child.name] = child;
            }
        });

        for(let speaker in this.speakers) {
            this.speakers[speaker].material.transparent = true;
            this.speakers[speaker].material.opacity = .1;
        }

        for (let tower in this.towers) {
            this.towers[tower].material.transparent = true;
            this.towers[tower].material.opacity = .1;
        }
    }
}


module.exports = maxToBrowser;