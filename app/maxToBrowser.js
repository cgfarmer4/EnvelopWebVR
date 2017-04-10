const eio = require('engine.io-client');

class maxToBrowser {
    constructor() {
        let self = this;
        this.speakers = {};
        this.inputs = {};

        const socket = new eio.Socket('ws://192.168.0.197:1337/');

        socket.on('open', () => {
            console.info('UDP / SOCKET --> success!');

            socket.on('message', (data) => {
                let messageData = JSON.parse(data);
                
                if (messageData.type === 'speaker') {
                    let input = messageData.address.substr(18, messageData.address.length)
                    let channelName = "Speaker" + input;
                    if(input.length) self.speakers[channelName] = messageData.args[0];
                }
                else if (messageData.type === 'position') {
                    messageData.packets.forEach((packet) => {
                        //parse address
                        if(packet.address.substr(1, 6) === 'source') {
                            let packetSplit = packet.address.split('/');
                            let inputNumber = packetSplit[2];
                            self.inputs["Input" + inputNumber] = packet.args;
                        }
                    })
                }
            });
        });
    }
}


module.exports = maxToBrowser;