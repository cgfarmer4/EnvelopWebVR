'use_strict';
const THREE = require('three');
const GUI = require('./gui');
const Midway = require('./midway');
const Label = require('./label');
const Column = require('./column');
const EventEmitter = require('events').EventEmitter;

const INCHES = 1;
const FEET = 12 * INCHES;

/**
 * Object representing physical components of Envelop installation.
 */
class Envelop extends EventEmitter {
    constructor(scene, maxValues) {
        super();
        this.NUM_INPUTS = 8;

        this.columns = [];
        this.labels = [];
        this.subs = [];
        this.channels = {};
        this.inputs = {};
        this.allModelParts = new THREE.Object3D();
        this.allModelParts.name = 'envelop';
        this.scene = scene;
        this.maxValues = maxValues;
        this.venue = new Midway();

        this.inputModel();
        this.columnDraw();
        this.channelDraw();
        this.subDraw();
        this.floorDraw();

        this.scene.add(this.allModelParts);
        this.GUI = new GUI(this);
    }
    /**
     * Draw spheres to represent the audio inputs.
     */
    inputModel() {
        for (let x = 0; x < this.NUM_INPUTS; x++) {
            let geometry = new THREE.SphereGeometry(10, 16, 16);
            let material = new THREE.MeshBasicMaterial({
                color: 0xffffff,
                wireframe: true
            });

            let sphere = new THREE.Mesh(geometry, material);
            let inputLabel = new Label(Number(x) + 1);
            let group = new THREE.Object3D();

            group.add(inputLabel);
            group.add(sphere);

            this.inputs["Input" + (Number(x) + 1)] = group;
            this.labels.push(inputLabel);
            this.allModelParts.add(group);
        }
    }
    /**
     * Draw columns
     */
    columnDraw() {
        this.venue.COLUMN_POSITIONS.forEach((columnPosition, index) => {
            let column = new Column();
            column.theta = Math.atan2(columnPosition.y, columnPosition.x) - Math.PI / 2;
            column.mesh.position.set(columnPosition.x, column.HEIGHT / 2, columnPosition.y);
            column.mesh.rotateY(column.theta);
            column.mesh.visible = false;
            this.columns.push(column);
            this.allModelParts.add(column.mesh);
        })
    }
    /**
     * Draw channels and their respective angles
     */
    channelDraw() {
        this.columns.forEach((column, index) => {
            let channel1Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let channel1Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let channel1 = new THREE.Mesh(channel1Geo, channel1Mat);
            channel1.position.set(column.mesh.position.x, 1 * FEET, column.mesh.position.z);
            channel1.rotateY(-column.theta);
            channel1.rotateX(column.SPEAKER_ANGLE);

            let channel1Group = new THREE.Object3D();
            let channelLabel = new Label(index + 17);
            this.labels.push(channelLabel);
            channelLabel.position.set(column.mesh.position.x, 1 * FEET, column.mesh.position.z);
            channel1Group.add(channelLabel);
            channel1Group.add(channel1);
            this.allModelParts.add(channel1Group);
            let channelNum = index + 17;
            this.channels["Channel" + channelNum] = channel1;

            let channel2Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let channel2Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let channel2 = new THREE.Mesh(channel2Geo, channel2Mat);
            channel2.position.set(column.mesh.position.x, 6 * FEET, column.mesh.position.z);
            channel2.rotateY(-column.theta);

            let channel2Group = new THREE.Object3D();
            let channelLabel2 = new Label(index + 9);
            this.labels.push(channelLabel2);
            channelLabel2.position.set(column.mesh.position.x, 6 * FEET, column.mesh.position.z);
            channel2Group.add(channelLabel2);
            channel2Group.add(channel2);
            this.allModelParts.add(channel2Group);

            channelNum = index + 9;
            (channelNum < 10) ? channelNum = '0' + channelNum.toString() : channelNum = channelNum.toString();
            this.channels["Channel" + channelNum] = channel2;

            let channel3Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let channel3Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let channel3 = new THREE.Mesh(channel3Geo, channel3Mat);
            channel3.position.set(column.mesh.position.x, 11 * FEET, column.mesh.position.z);
            channel3.rotateY(-column.theta);
            channel3.rotateX(-column.SPEAKER_ANGLE);

            let channel3Group = new THREE.Object3D();
            let channelLabel3 = new Label(index + 1);
            this.labels.push(channelLabel3);
            channelLabel3.position.set(column.mesh.position.x, 11 * FEET, column.mesh.position.z);
            channel3Group.add(channelLabel3);
            channel3Group.add(channel3);
            this.allModelParts.add(channel3Group);

            channelNum = index + 1;
            (channelNum < 10) ? channelNum = '0' + channelNum.toString() : channelNum = channelNum.toString();
            this.channels["Channel" + channelNum] = channel3;
        });
    }
    /**
     * Draw sub boxes.
     */
    subDraw() {
        this.venue.SUB_POSITIONS.forEach((subPosition) => {
            let subGeo = new THREE.BoxGeometry(29 * INCHES, 20 * INCHES, 29 * INCHES);
            let subMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .3 });
            let sub = new THREE.Mesh(subGeo, subMat);
            sub.rotateY(- Math.PI / 4);
            sub.position.set(subPosition.x, 10 * INCHES, subPosition.y);
            this.allModelParts.add(sub);
            this.subs.push(sub);
        });
    }
    /**
     * Draw floor and add logo texture.
     */
    floorDraw() {
        const LOGO_SIZE = 250 * INCHES;
        let loader = new THREE.TextureLoader();
        let geometry = new THREE.PlaneBufferGeometry(LOGO_SIZE, LOGO_SIZE, 8, 8);
        let material = new THREE.MeshLambertMaterial({
            map: loader.load('assets/logo_midway.png'),
            transparent: true,
            side: THREE.DoubleSide
        });
        let plane = new THREE.Mesh(geometry, material);
        plane.rotateX(- Math.PI / 2);
        this.floor = plane;
        this.allModelParts.add(plane);
    }
    /**
     * Update loop passed into the animation frame. 
     * @param {*} delta 
     */
    update(delta) {
        if (this.maxValue && this.maxValue.inputs) {
            // Map this.maxValues to the values in Envelop.
            for (let input in this.maxValues.inputs) {
                this.inputs[input].position.x = this.maxValues.inputs[input][0];
                this.inputs[input].position.y = this.maxValues.inputs[input][1];
                this.inputs[input].position.z = this.maxValues.inputs[input][2];

                if (this.GUI.visible) {
                    //TODO: MOVE TO NOT READ DOM EVERY UPDATE!
                    document.getElementById(input).querySelector('.inputPosition').textContent = this.maxValues.inputs[input][0].toFixed(2) + ',' +
                        this.maxValues.inputs[input][1].toFixed(2) + ',' +
                        this.maxValues.inputs[input][2].toFixed(2);

                }
            }
            if (this.GUI.visible) {
                for (let channel in this.maxValues.channels) {
                    //TODO: MOVE TO NOT READ DOM EVERY UPDATE!
                    let meter = document.getElementById(channel).querySelector('.channelLevel');
                    meter.style.height = 80 - Math.floor(this.maxValues.channels[channel] * 300) + 'px';
                }
            }
        }
    }
}

module.exports = Envelop;