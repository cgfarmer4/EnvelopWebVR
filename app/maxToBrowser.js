import * as Xebra from 'xebra.js';

class maxToBrowser {
    constructor() {
        let options = {
            hostname: "127.0.0.1",
            port: 8086,
            supported_objects: ["button"]
        };
        
        this.xebraState = new Xebra.State(options);

        // Do something when a button gets added to the Max patcher
        this.xebraState.on("object_added", (object) => {
            if (object.type === "button") this.addHTMLButton(object);
        });

        // Do something when a button is removed
        this.xebraState.on("object_removed", (object) => {
            if (object.type === "button") this.removeHTMLButton(object);
        });

        this.xebraState.on("loaded", () => { 
            this.debugObjectTree();
        });

        this.xebraState.connect();
    }
    addHTMLButton(object) {
        let newButton = document.createElement("button");
        newButton.id = "button-" + object.id;

        newButton.onmousedown = function() {
            object.setParamValue("value", 1);
        };

        newButton.onmouseup = function() {
            object.setParamValue("value", 0);
        };

        newButton.appendChild(document.createTextNode("Button " + object.id));
        document.getElementById("container").appendChild(newButton);
    }
    removeHTMLButton(object) {
        let button = document.getElementById("button-" + object.id);
        button.parentNode.removeChild(button);
    }
    debugObjectTree() {
        let patchers = this.xebraState.getPatchers();

        patchers.forEach( function(patcher) {
            console.log("Patcher", patcher.name);
            let objects = patcher.getObjects();

            objects.forEach( function(object) {
                console.log("\tObject", object.id, object.type);
                let paramTypes = object.getParamTypes();
                
                paramTypes.forEach( function(paramType) {
                    console.log("\t\t", paramType, ":", object.getParamValue(paramType));
                });
            });

            console.log("\n");
        });
    }
    debugFrameNode() {
        let patchers = xebraState.getPatchers();
        patchers.forEach( function(patcher) {
            console.log("Patcher", patcher.name);
            let frames = patcher.getFrames();

            frames.forEach( function(frame) {
                console.log("\tFrame", frame.id, "viewmode:", frame.viewMode);
                let objects = frame.getObjects();

                objects.forEach( function(object) {
                    console.log("\t\tObject", object.id, object.type);
                    let paramTypes = object.getParamTypes();
                    
                    paramTypes.forEach( function(paramType) {
                        console.log("\t\t\t", paramType, ":", object.getParamValue(paramType));
                    });
                });
            });
        });
    }
}

module.exports = maxToBrowser;