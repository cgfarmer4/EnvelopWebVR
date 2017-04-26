const AppMain =  require('./app');
const AppMenu = require('./menu');

global.App = new AppMain();
global.App.initCode();
global.App.animate();
global.Menu = new AppMenu(global.App);

