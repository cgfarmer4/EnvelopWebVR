module.exports = `//SUN
let textureLoader = new App.THREE.TextureLoader();
let material = new App.THREE.MeshBasicMaterial({
    map: textureLoader.load('examples/rising-sun/sun-texture.jpg')
});
let geometry = new App.THREE.SphereGeometry(40, 50, 50);
let sun = new App.THREE.Mesh(geometry, material);

sun.position.y = 71;
sun.name = 'sun';

App.userScene.add(sun);
App.timeline.targets.push(sun);

//STARS
let particleCount = 1000;
let particles = new App.THREE.Geometry();
let pMaterial = new App.THREE.PointsMaterial({
    color: 0xFFFFFF,
    size: 10,
    map: textureLoader.load('examples/rising-sun/particle.png'),
    blending: App.THREE.AdditiveBlending,
    transparent: true
});

// now create the individual particles
for (let p = 0; p < particleCount; p++) {
    // create a particle with random
    // position values, -250 -> 250
    let pX = Math.random() * 500 - 250,
        pY = Math.random() * 500 - 250,
        pZ = Math.random() * 500 - 250,
        particle = new App.THREE.Vector3(pX, pY, pZ);

    // add it to the geometry
    particles.vertices.push(particle);
}

// create the particle system
let stars = new App.THREE.Points(
    particles,
    pMaterial
);
stars.name = 'stars';
stars.sortParticles = true;
App.userScene.add(stars);
App.timeline.targets.push(stars);`;
