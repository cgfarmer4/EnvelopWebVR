const eio = require('engine.io-client');

class maxToBrowser {
    constructor() {
        this.channels = {};
        this.inputs = {};
        this.connect();
    }
    connect() {
        //TODO: Calculate and fix.
        let venue = {
            xRange: 228.24,
            yRange: 141.73,
            zRange: 329.972, 
            cx: 0,
            cy: 70.1,
            cz: 0
        }

        let self = this;
        this.socket = new eio.Socket('ws://192.168.0.197:1337/');

        this.socket.on('open', () => {
            console.info('UDP / SOCKET --> success!');
            this.connection = true;

            this.socket.on('message', (data) => {
                let messageData = JSON.parse(data);

                if (messageData.type === 'channel') {
                    let input = messageData.address.substr(18, messageData.address.length)
                    let channelName = "Channel" + input;
                    if (input.length) self.channels[channelName] = messageData.args[0];
                }
                else if (messageData.type === 'position') {
                    messageData.packets.forEach((packet) => {
                        //parse address
                        if (packet.address.substr(1, 6) === 'source') {
                            let packetSplit = packet.address.split('/');
                            let inputNumber = packetSplit[2];

                            self.inputs["Input" + inputNumber] = [];
                            self.inputs["Input" + inputNumber].push(venue.cx + packet.args[0] * venue.xRange / 2);
                            self.inputs["Input" + inputNumber].push(venue.cy + packet.args[2] * venue.yRange / 2);
                            self.inputs["Input" + inputNumber].push(venue.cz + packet.args[1] * -venue.zRange / 2);
                        }
                    })
                }
            });
        });
    }
}


module.exports = maxToBrowser;