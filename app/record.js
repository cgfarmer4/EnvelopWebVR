'use_strict';

const CubemapToEquirectangular = require('../vendor/CubemapToEquirectangular');
const download = require('downloadjs');

class Record {
    constructor(renderer, camera, scene) {
        this.renderer = renderer;
        this.camera = camera;
        this.scene = scene;
        this.cubeMap = new CubemapToEquirectangular(this.renderer, true);
        this.start();
    }
    /**
     * Start recording using the MediaRecorder and MediaStream APIs.
     */
    start() {
        let canvasStream = this.cubeMap.canvas.captureStream();

        const options = {
            audioBitsPerSecond: 128000,
            videoBitsPerSecond: 2500000,
            mimeType: 'video/webm'
        };

        this.outputStreamBlobs = [];
        let createMediaStream = window.webkitMediaStream || window.MediaStream;
        let outputStream = new createMediaStream();

        [canvasStream.getVideoTracks()].forEach(function (stream) {
            stream.forEach(function (track) {
                outputStream.addTrack(track);
            });
        });

        this.outputRecorder = new MediaRecorder(outputStream);
        // this.outputRecorder.onstop = this.stop.bind(this);
        this.outputRecorder.onerror = function (err) {
            console.log(err);
        }
        this.outputRecorder.ondataavailable = this.data.bind(this);
        this.outputRecorder.start(10); // collect 10ms of data
    }
    /**
     * Add blob into Array 
     * @param  {Event} event
     */
    data(event) {
        if (event.data && event.data.size > 0) {
            this.outputStreamBlobs.push(event.data);
        }
    }
    /**
     * Stop MediaRecorder API and dump in memory chunks to file that will be downloaded.
     */
    stop() {
        this.outputRecorder.stop();

        let superBuffer = new Blob(this.outputStreamBlobs, { type: 'video/webm;codecs=h264' });
        download(superBuffer, 'video.webm', 'video/webm');
    }
}

module.exports = Record;