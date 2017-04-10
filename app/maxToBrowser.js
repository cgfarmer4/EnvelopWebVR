const eio = require('engine.io-client');

class maxToBrowser {
    constructor() {
        let self = this;
        const socket = new eio.Socket('ws://localhost:1337/');

        socket.on('open', function(){
            socket.on('message', function(data){
                let oscMessage = JSON.parse(data);
                console.log(oscMessage);
                // let channel = "Speaker" + oscMessage.address.substr(18, oscMessage.address.length);
                // self.speakers[channel].material.opacity = oscMessage.args[0];
                
                // Input positioning
                console.info("Source 1", oscMessage[0].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
                console.info("Source 2", oscMessage[1].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
            });
        });
    }
}


module.exports = maxToBrowser;