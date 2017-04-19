'use_strict';
const ace = require('brace');
require('brace/mode/javascript');
require('brace/mode/json');
require('brace/theme/monokai');

class Editor {
    constructor(app, controls) {
        this.element = document.createElement('div');
        this.element.id = 'editor';
        this.controls = controls;
        this.app = app;

        //Styles
        this.element.style.width = window.innerWidth + 'px';
        this.element.style.height = window.innerHeight + 'px';
        this.element.style.position = 'absolute';
        this.element.style.top = 0;
        this.element.style.left = 0;
        this.element.style.background = 'rgba(0,0,0,.4)';
        this.element.style.background = 'rgba(0,0,0,.4)';
        this.element.style['z-index'] = 100;

        //Template
        this.element.innerHTML = this.template();
        document.body.appendChild(this.element);

        //Setup Ace Editor
        this.initCode();

        //Events
        let close = this.element.querySelector('#closeEditor');
        close.onclick = this.close.bind(this);
        
        let runCode = this.element.querySelector('#editorOptions #run');
        runCode.onclick = this.resetCodeLoop.bind(this);
        
        let saveCode = this.element.querySelector('#editorOptions #save');
        saveCode.onclick = this.save.bind(this);  
    }
    initCode() {
        this.sceneCodeElement = this.element.querySelector('#sceneCode');
        this.sceneCodeElement.style.height = window.innerHeight - 100 + 'px';

        this.tracksCodeElement = this.element.querySelector('#tracksCode');
        this.tracksCodeElement.style.height = window.innerHeight - 100 + 'px';

        this.sceneEditor = ace.edit('sceneCode');
        this.sceneEditor.getSession().setMode('ace/mode/javascript');
        this.sceneEditor.$blockScrolling = Infinity;
        this.sceneEditor.setTheme('ace/theme/monokai');
        this.sceneEditor.setValue(this.app.code);
        

        this.tracksEditor = ace.edit('tracksCode');
        this.tracksEditor.getSession().setMode('ace/mode/json');
        this.tracksEditor.$blockScrolling = Infinity;
        this.tracksEditor.setTheme('ace/theme/monokai');
        if(this.tracksCode) this.tracksEditor.setValue(this.tracksCode);
    }
    resetCodeLoop() {
        this.app.code = this.sceneEditor.getValue();
        this.tracksCode = this.tracksEditor.getValue();
        this.app.emit('app:codeUpdate');
    }
    clearLocal() {
        
    }
    load() {

    }
    save() {

    }
    close() {
        this.element.style.display = 'none';
        this.app.code = this.sceneEditor.getValue();
        this.tracksCode = this.tracksEditor.getValue();
        this.tracksEditor.destroy();
        this.sceneEditor.destroy();
        
        while(this.sceneCodeElement.firstChild) {
            this.sceneCodeElement.firstChild.remove();
        }
        
        while(this.tracksCodeElement.firstChild) {
            this.tracksCodeElement.firstChild.remove();
        }

        this.controls.enabled = true;
    }
    template() {
        return `
            <div id="sceneEditor">
                <h2> Scene </h2>
                <div id="sceneCode"></div>
            </div>
            <div id="tracksEditor">
                <h2> Tracks </h2>
                <div id="tracksCode">{}</div>
            </div>
            <ul id="editorOptions">
                <li class="largeButton" id="run"> Run </li>
                <li class="largeButton" id="save"> Save </li>
            </ul>
            <ul id="closeEditor">
                <li> X </li>
            </ul>
        `;
    }
}

module.exports = Editor;
