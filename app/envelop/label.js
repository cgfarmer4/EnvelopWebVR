'use_strict';
const THREE = require('three');

class Label {
    constructor(text) {
        const fontFace = 'Arial';
        const fontSize = 18;
        const borderThickness = 4;
        const borderColor = {
            r: 0,
            g: 0,
            b: 0,
            a: 1.0
        }
        const backgroundColor = {
            r: 255,
            g: 255,
            b: 255,
            a: 1.0
        }

        let canvas = document.createElement('canvas');
        let context = canvas.getContext('2d');
        context.font = "Bold " + fontSize + "px " + fontFace;

        // get size data (height depends only on font size)
        let metrics = context.measureText(text);
        let textWidth = metrics.width;

        // background color
        context.fillStyle = "rgba(" + backgroundColor.r + "," + backgroundColor.g + "," + backgroundColor.b + "," + backgroundColor.a + ")";
        
        // border color
        context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + "," + borderColor.b + "," + borderColor.a + ")";
        context.lineWidth = borderThickness;
        
        // roundRect(context, borderThickness / 2, borderThickness / 2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
        // 1.4 is extra height factor for text below baseline: g,j,p,q.

        // text color
        context.fillStyle = "rgba(255, 255, 255, 1.0)";
        context.fillText(text, borderThickness, fontSize + borderThickness);

        // canvas contents will be used for a texture
        let texture = new THREE.Texture(canvas)
        texture.needsUpdate = true;
        let spriteMaterial = new THREE.SpriteMaterial({
            map: texture,
            transparent: true,
            opacity: .5
        });
        
        let sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(100, 50, 1.0);
        return sprite;
    }
}

module.exports = Label;