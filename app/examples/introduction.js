const Introduction = "/**\n\
* Declare all scene targets.\n\
*\n\
* Variables available here: \n\
*\n\
* App.THREE, App.userScene, App.camera,\n\
* App.renderer, App.controls, App.timeline.\n\
*\n\
* Here is where the code loops lives in the threeDScene.js\n\
* file.\n\
*/\n\
let geometry = new App.THREE.CubeGeometry(10, 10, 10);\n\
let material = new App.THREE.MeshNormalMaterial();\n\
let cube = new App.THREE.Mesh(geometry, material);\n\
cube.position.y = 71;\n\
cube.name = 'cube1';\n\
App.scene.add(cube);\n\
App.timeline.targets.push(cube);";

module.exports = Introduction;
