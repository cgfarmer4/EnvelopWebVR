'use_strict';
const THREE = require('three');
const GUI = require('./gui');
const Midway = require('./midway');
const Label = require('./label');
const Column = require('./column');

const INCHES = 1;
const FEET = 12 * INCHES;

class Envelop {
    constructor(scene) {
        this.NUM_INPUTS = 8;
        this.columns = [];
        this.labels = [];
        this.subs = [];
        this.speakers = {};
        this.inputs = {};
        this.scene = scene;
        this.venue = new Midway();
        this.inputModel();
        this.columnDraw();
        this.speakerDraw();
        this.subDraw();
        this.floorDraw();
        this.GUI = new GUI(this);
    }
    inputModel() {
        for (let x = 0; x < this.NUM_INPUTS; x++) {
            let geometry = new THREE.SphereGeometry(10, 16, 16);
            let material = new THREE.MeshBasicMaterial({ 
                color: 0xffffff,
                wireframe: true
            });

            let sphere = new THREE.Mesh(geometry, material);
            let inputLabel = new Label(x);
            let group = new THREE.Object3D();

            group.add(inputLabel);
            group.add(sphere);

            this.inputs["Input" + x] = group;
            this.labels.push(inputLabel)
            this.scene.add(group);
        }
    }
    columnDraw() {
        this.venue.COLUMN_POSITIONS.forEach((columnPosition, index) => {
            let column = new Column();
            column.theta = Math.atan2(columnPosition.y, columnPosition.x) - Math.PI / 2;
            column.mesh.position.set(columnPosition.x, column.HEIGHT / 2, columnPosition.y);
            column.mesh.rotateY(column.theta);
            this.columns.push(column);
            this.scene.add(column.mesh);
        })
    }
    speakerDraw() {
        this.columns.forEach((column, index) => {
            let speaker1Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let speaker1Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let speaker1 = new THREE.Mesh(speaker1Geo, speaker1Mat);
            speaker1.position.set(column.mesh.position.x, 1 * FEET, column.mesh.position.z);
            speaker1.rotateY(-column.theta);
            speaker1.rotateX(column.SPEAKER_ANGLE);
            
            let speaker1Group = new THREE.Object3D();
            let speakerLabel = new Label(index + 17);
            this.labels.push(speakerLabel);
            speakerLabel.position.set(column.mesh.position.x, 1 * FEET, column.mesh.position.z);
            speaker1Group.add(speakerLabel);
            speaker1Group.add(speaker1);
            this.scene.add(speaker1Group);
            this.speakers[index + 17] = speaker1;

            let speaker2Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let speaker2Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let speaker2 = new THREE.Mesh(speaker2Geo, speaker2Mat);
            speaker2.position.set(column.mesh.position.x, 6 * FEET , column.mesh.position.z);
            speaker2.rotateY(-column.theta);

            let speaker2Group = new THREE.Object3D();
            let speakerLabel2 = new Label(index + 9);
            this.labels.push(speakerLabel2);
            speakerLabel2.position.set(column.mesh.position.x, 6 * FEET, column.mesh.position.z);
            speaker2Group.add(speakerLabel2);
            speaker2Group.add(speaker2);
            this.scene.add(speaker2Group);
            this.speakers[index + 9] = speaker2;
            

            let speaker3Geo = new THREE.BoxGeometry(21 * INCHES, 16 * INCHES, 15 * INCHES);
            let speaker3Mat = new THREE.MeshBasicMaterial({ color: 0xfffff });
            let speaker3 = new THREE.Mesh(speaker3Geo, speaker3Mat);
            speaker3.position.set(column.mesh.position.x, 11 * FEET, column.mesh.position.z);
            speaker3.rotateY(-column.theta);
            speaker3.rotateX(-column.SPEAKER_ANGLE);

            let speaker3Group = new THREE.Object3D();
            let speakerLabel3 = new Label(index + 1);
            this.labels.push(speakerLabel3);
            speakerLabel3.position.set(column.mesh.position.x, 11 * FEET, column.mesh.position.z);
            speaker3Group.add(speakerLabel3);
            speaker3Group.add(speaker3);
            this.scene.add(speaker3Group);
            this.speakers[index + 1] = speaker3;
        });
    }
    subDraw() {
        this.venue.SUB_POSITIONS.forEach((subPosition) => {
            let subGeo = new THREE.BoxGeometry(29 * INCHES, 20 * INCHES, 29 * INCHES);
            let subMat = new THREE.MeshBasicMaterial({ color: 0x000000, transparent: true, opacity: .3 });
            let sub = new THREE.Mesh(subGeo, subMat);
            sub.rotateY(- Math.PI / 4);
            sub.position.set(subPosition.x, 10 * INCHES, subPosition.y);
            this.scene.add(sub);
            this.subs.push(sub);
        });
    }
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
        this.scene.add(plane);
    }
}

module.exports = Envelop;