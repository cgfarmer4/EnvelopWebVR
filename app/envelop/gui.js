'use_strict';

/**
 * Display controls for Envelop including channel toggles, labels, and inputs for recording.
 * 
 * @param {Envelop}
 */
class EnvelopGui {
    constructor(envelop) {
        this.envelop = envelop;
        this.envelopGui = document.createElement('div');
        this.envelopGui.id = 'envelopGui';
        this.envelopGui.innerHTML = this.template();
        this.envelopGui.style.display = 'none';
        document.body.appendChild(this.envelopGui);

        this.envelop.labels.forEach((label) => {
            label.visible = false;
        });

        this.domEvents.call(this);
    }
    /**
     * Event listeners for the inputs
     */
    domEvents() {
        let connection = this.envelopGui.querySelector('#connection button');
        connection.onclick = (event) => {
            if (this.envelop.maxValues.connection) {
                this.envelop.maxValues.connection = false;
                connection.textContent = 'Connect';
                this.envelop.maxValues.socket.close();
            }
            else {
                let udpServer = this.envelopGui.querySelector('#connection input');
                connection.textContent = 'Disconnect';
                this.envelop.maxValues.connect(udpServer.value);
            }
        }

        let close = this.envelopGui.querySelector('header #closeEnvelop');
        close.onclick = (event) => {
            this.envelopGui.style.display = 'none';
        }

        let viewLabels = this.envelopGui.querySelector('#viewLabelsToggle');
        viewLabels.onchange = (event) => {
            let labelStatus = true;

            if (!event.target.checked) {
                labelStatus = false;
            }

            this.envelop.labels.forEach((label) => {
                label.visible = labelStatus;
            });
        }

        let viewChannels = this.envelopGui.querySelector('#viewChannelsToggle');
        viewChannels.onchange = (event) => {
            let viewStatus = true;

            if (!event.target.checked) {
                viewStatus = false;
            }
            
            for (let channel in this.envelop.channels) {
                this.envelop.channels[channel].visible = viewStatus;
            }

            this.envelop.subs.forEach((sub) => {
                sub.visible = viewStatus;
            });

            this.envelop.columns.forEach((column) => {
                column.mesh.visible = viewStatus;
            });

            this.envelop.floor.visible = viewStatus;
        };

        let viewInputs = this.envelopGui.querySelector('#viewInputsToggle');
        viewInputs.onchange = (event) => {
            let viewStatus = true;

            if (!event.target.checked) {
                viewStatus = false;
            }
            for (let input in this.envelop.inputs) {
                this.envelop.inputs[input].visible = viewStatus;
            }
        };

        //For targeting the timeline track object. 
        let channelsAndInputs = this.envelopGui.querySelectorAll('.channelLevelMeter, .envelopInput');
        channelsAndInputs.forEach((object) => {
            object.onclick = (event) => {
                let targetName = '';
                let targetType = '';
                let target = event.target;

                if (event.target.classList.contains('channelLevelMeter') || event.target.classList.contains('channelLevel')) {
                    while (!target.classList.contains('channelLevelMeter')) {
                        target = target.parentNode;
                    }
                    targetType = 'channels';
                }
                else {
                    while (!target.classList.contains('envelopInput')) {
                        target = target.parentNode;
                    }
                    targetType = 'inputs';
                }

                targetName = target.id;

                this.envelop.emit('add:trackTarget', {
                    type: targetType,
                    name: targetName
                });
            }
        });
    }
    /**
     * HTML 
     */
    template() {
        let templateString = `
        <header>
            <h3> Envelop </h3>
            <div id="closeEnvelop">x</div>
        </header>
        <div id="connection">
            <input type="text" value="192.168.0.132:1337"/>
            <button class="mediumButton"> Connect </button></div>
        </div>
        <div style= "text-align: left; padding: 5px 10px 0 10px" >
            <label for="viewChannelsToggle" style="font-weight: 500; vertical-align: middle;"> Channels: </label>
            <input type="checkbox" id="viewChannelsToggle"/>
        </div>
        <ol>`;

        let channelNumber = 1;
        for (let channel in this.envelop.channels) {
            (channelNumber < 10) ? channelNumber = '0' + channelNumber.toString() : channelNumber = channelNumber.toString();
            templateString += `<li class="channelLevelMeter" id="Channel${channelNumber}">\
                                <div class="channelLevel"></div>`;
            templateString += `</li>`;
            channelNumber++;
        }
        templateString += `</ol><div style= "text-align: left; padding: 0 10px 5px 10px">
                <label for="viewLabelsToggle" style="font-weight: 500; vertical-align: middle;"> Labels: </label>
                <input type="checkbox" id="viewLabelsToggle" />
        </div>
        <div style= "text-align: left; padding: 0 10px" >
            <label  for="viewInputsToggle" style="font-weight: 500; vertical-align: middle;"> Inputs: </label>
            <input type="checkbox" id="viewInputsToggle"/>
        </div>
        <div style="text-align: left; padding-bottom: 10px;">`;

        let inputNumber = 1;
        for (let input in this.envelop.inputs) {
            templateString += '<div class="envelopInput" id="Input' + inputNumber + '">';

            templateString += '<h5 style="border: 1px solid #000; padding: 5px; \
            margin: 10px 10px 0; display:inline-block">' + inputNumber + '</h5>';

            templateString += '<p class="inputPosition" style="border: 1px solid #000; \
            font-size:14px; margin: -2px 0 0 0; display:inline-block; \
            padding: 5px; width: 70%;">  0, 0, 0</p><br>';

            templateString += '</div>';
            inputNumber++;
        }
        templateString += '</div>'
        return templateString;
    }
}

module.exports = EnvelopGui;