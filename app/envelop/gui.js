'use_strict';


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
    template() {
        let templateString = '\
        <img style="height: 75px; width: 75px;" src="assets/logo_envelop.png"/>\
        <div style= "text-align: left; padding: 5px 10px" >\
            <label for="viewLabelsToggle" style="font-weight: 500; vertical-align: middle;"> Labels: </label>\
            <input type="checkbox" id="viewLabelsToggle"/>\
        </div>\
        <div style= "text-align: left; padding: 5px 10px 0 10px" >\
            <label for="viewSpeakersToggle" style="font-weight: 500; vertical-align: middle;"> Speakers: </label>\
            <input type="checkbox" id="viewSpeakersToggle" checked/>\
        </div>\
        <ol>';

        let speakerNumber = 1;
        for (let speaker in this.envelop.speakers) {
            (speakerNumber < 10) ? speakerNumber = '0' + speakerNumber.toString() : speakerNumber = speakerNumber.toString();
            templateString += '<li class="speakerLevelMeter" id="Speaker' + speakerNumber + '">\
                                <div class="speakerLevel"></div>';
            templateString += '</li>';
            speakerNumber++;
        }
        templateString += '</ol>\
            <div style= "text-align: left; padding: 0 10px" >\
            <label  for="viewInputsToggle" style="font-weight: 500; vertical-align: middle;"> Inputs: </label>\
            <input type="checkbox" id="viewInputsToggle" checked/>\
        </div>\
        <div style="text-align: left; padding-bottom: 10px;">';

        let inputNumber = 1;
        for (let input in this.envelop.inputs) {
            templateString += '<div class="envelopInput" id="Input' + inputNumber + '">';

            templateString += '<h5 style="border: 1px solid #000; padding: 5px; \
            margin: 10px 10px 0; display:inline-block">' + inputNumber + '</h5>';

            templateString += '<p id="Input' + inputNumber + '" style="border: 1px solid #000; \
            font-size:14px; margin: -2px 0 0 0; display:inline-block; \
            padding: 5px; width: 60%;">  0, 0, 0</p><br>';

            templateString += '</div>';
            inputNumber++;
        }
        templateString += '</div>'
        // templateString += '<input style="width: 90%; margin: 20px 10px;" type="text" placeholder="WebSocket Server Address"/>';

        return templateString;
    }
    domEvents() {
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

        let viewSpeakers = this.envelopGui.querySelector('#viewSpeakersToggle');
        viewSpeakers.onchange = (event) => {
            let viewStatus = true;

            if (!event.target.checked) {
                viewStatus = false;
            }

            for (let speaker in this.envelop.speakers) {
                this.envelop.speakers[speaker].visible = viewStatus;
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

        let speakersAndInputs = this.envelopGui.querySelectorAll('.speakerLevelMeter, .envelopInput');
        speakersAndInputs.forEach((object) => {
            object.onclick = (event) => {
                let targetName = '';
                let target = event.target;

                if (event.target.classList.contains('speakerLevelMeter') || event.target.classList.contains('speakerLevel')) {
                    while (!target.classList.contains('speakerLevelMeter')) {
                        target = target.parentNode;
                    }
                    targetName = target.id;
                    target = this.envelop.maxValues.speakers[target.id];
                }
                else {
                    while (!target.classList.contains('envelopInput')) {
                        target = target.parentNode;
                    }
                    targetName = target.id;
                    target = this.envelop.maxValues.inputs[target.id];
                }
                this.envelop.timeline.emit('add:trackTarget', {
                    target: target,
                    name: targetName
                });
            }
        });
    }
}

module.exports = EnvelopGui;