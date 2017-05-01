module.exports = `/**
* Declare all scene targets.
*
* Variables available here: 
*
* App.THREE, App.userScene, App.camera,
* App.renderer, App.controls, App.timeline.
*
* Here is where the code loops lives in the threeDScene.js
* file.
*/
let geometry = new App.THREE.CubeGeometry(10, 10, 10);
let material = new App.THREE.MeshNormalMaterial();
let cube = new App.THREE.Mesh(geometry, material);
cube.position.y = 71;
cube.name = 'cube1';
App.userScene.add(cube);
App.timeline.targets.push(cube);`;

