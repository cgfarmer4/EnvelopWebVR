module.exports = `App.timeline.loader = new App.loader({
    'astronaut': {
        type: 'draco',
        url: 'examples/astronauts/astronaut.drc'
    }
})

App.timeline.loader.on('loading:complete', function () {
    let astronaut = App.timeline.loader.assets['astronaut'];
    astronaut.computeVertexNormals();
    let material = new App.THREE.MeshNormalMaterial({
        color: Math.random() * 0xffffff
    });

    for (let x = 0; x < 10; x++) {
        let mesh = new App.THREE.Mesh(astronaut, material.clone());
        mesh.position.set(x * 100, 0, 0);
        mesh.scale.multiplyScalar(100);
        mesh.name = 'astronaut' + x;
        App.userScene.add(mesh);
        App.timeline.targets.push(mesh);
    }

    App.timeline.loader.emit('scene:complete');

}.bind(this))`;