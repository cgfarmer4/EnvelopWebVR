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

// UDP connection to MAX
udpPort.open();

// Positional level bundles
udpPort.on("bundle", function (data, timeTag, info) {
    let message = {
        type: 'position'
    };
    Object.assign(message, data);

    myEmitter.emit('bundle', message);
});

// Channel level message
udpPort.on("message", function (data, timeTag, info) {
    let message = {
        type: 'channel'
    };
    Object.assign(message, data);
    
    myEmitter.emit('message', message);
});

// Browser Web Socket connection
server.on('connection', function(socket){

    myEmitter.on('bundle', function(data) {
        socket.send(JSON.stringify(data));
    })

    myEmitter.on('message', function (data) {
        socket.send(JSON.stringify(data));
    })
})

