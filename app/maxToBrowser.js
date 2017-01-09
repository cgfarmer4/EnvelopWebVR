import * as eio from 'engine.io-client';

class maxToBrowser {
    constructor(threeDScene) {
        const socket = new eio.Socket('ws://localhost:1337/');

        socket.on('open', function(){
            socket.on('message', function(data){
                let oscMessage = JSON.parse(data);
                
                threeDScene.cubesMesh[0].position.x = oscMessage[0].args[0] * 1000;
                threeDScene.cubesMesh[0].position.y = oscMessage[0].args[1] * 1000;
                threeDScene.cubesMesh[0].position.z = -250;

                threeDScene.cubesMesh[1].position.x = oscMessage[1].args[0] * 1000;
                threeDScene.cubesMesh[1].position.y = oscMessage[1].args[1] * 1000;
                threeDScene.cubesMesh[1].position.z = -250;

                console.info("Source 1", oscMessage[0].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
                console.info("Source 2", oscMessage[1].args[0], oscMessage[0].args[1], oscMessage[0].args[2])
            });
        });
    }
}

module.exports = maxToBrowser;