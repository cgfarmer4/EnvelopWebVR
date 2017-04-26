const Scene = "App.scene.background = new App.THREE.Color(0x000000);\n\
\n\
//SUN\n\
let textureLoader = new App.THREE.TextureLoader();\n\
let material = new App.THREE.MeshBasicMaterial({\n\
    map: textureLoader.load('app/examples/rising-sun/sun-texture.jpg')\n\
});\n\
let geometry = new App.THREE.SphereGeometry(40, 50, 50);\n\
let sun = new App.THREE.Mesh(geometry, material);\n\
\n\
sun.position.y = 71;\n\
sun.name = 'sun';\n\
\n\
App.userScene.add(sun);\n\
App.timeline.targets.push(sun);\n\
\n\
\n\
//STARS\n\
let particleCount = 1000;\n\
let particles = new App.THREE.Geometry();\n\
let pMaterial = new App.THREE.ParticleBasicMaterial({\n\
    color: 0xFFFFFF,\n\
    size: 10,\n\
    map: textureLoader.load('app/examples/rising-sun/particle.png'),\n\
    blending: App.THREE.AdditiveBlending,\n\
    transparent: true\n\
});\n\
// now create the individual particles\n\
for (let p = 0; p < particleCount; p++) {\n\
    // create a particle with random\n\
    // position values, -250 -> 250\n\
    let pX = Math.random() * 500 - 250,\n\
        pY = Math.random() * 500 - 250,\n\
        pZ = Math.random() * 500 - 250,\n\
        particle = new App.THREE.Vector3(pX, pY, pZ);\n\
\n\
    // add it to the geometry\n\
    particles.vertices.push(particle);\n\
}\n\
// create the particle system\n\
let stars = new App.THREE.ParticleSystem(\n\
    particles,\n\
    pMaterial\n\
);\n\
stars.name = 'stars';\n\
stars.sortParticles = true;\n\
App.userScene.add(stars);\n\
App.timeline.targets.push(stars);\n";

module.exports = Scene;