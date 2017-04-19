const AppMain =  require('./app');
const AppMenu = require('./menu');

global.App = new AppMain();
global.App.initCode();

global.Menu = new AppMenu(global.App);

