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

// Positional level bundles
udpPort.on("bundle", function (oscBundle, timeTag, info) {
    myEmitter.emit('bundle', { 
        0: oscBundle.packets[0],
        1: oscBundle.packets[1]
    });

    console.log(oscBundle.packets[0],oscBundle.packets[1])
});

// Speaker level message
udpPort.on("message", function (message, timeTag, info) {
    myEmitter.emit('message', message);
    console.log(message);
});

// UDP connection to MAX
udpPort.open();

// Browser Web Socket connection
server.once('connection', function(socket){
    myEmitter.on('bundle', function(data) {
        socket.send(JSON.stringify(data));
    })

    myEmitter.on('message', function (data) {
        socket.send(JSON.stringify(data));
    })
})

