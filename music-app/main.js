const electron = require('electron');
const electron = require('electron');
const {app, BrowserWindow} = electron; 

let window;

app.on('ready', () => {
    window = new BrowserWindow({
        width: 500,
        height: 400,
        webPreferences: {
            nodeIntegration: true,
        }
    });

    window.loadFile('index.html');
});
