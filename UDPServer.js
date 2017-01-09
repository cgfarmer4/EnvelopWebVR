const osc = require('osc');
const EventEmitter = require('events');
class MyEmitter extends EventEmitter {}
const myEmitter = new MyEmitter();
const engine = require('engine.io');
const server = engine.listen(1337);

// Create an osc.js UDP Port listening on port 57121.
var udpPort = new osc.UDPPort({
    localAddress: "0.0.0.0",
    localPort: 57121
});

// Listen for incoming OSC bundles.
udpPort.on("bundle", function (oscBundle, timeTag, info) {
    myEmitter.emit('jungle', { 
        0: oscBundle.packets[0],
        1: oscBundle.packets[1]
    });
    // console.log("An OSC bundle just arrived for time tag", timeTag, ":", oscBundle.packets[0],oscBundle.packets[1]);
});

// Open the socket.
udpPort.open();

server.on('connection', function(socket){
    myEmitter.on('jungle', function(data) {
        socket.send(JSON.stringify(data));
    })
})

