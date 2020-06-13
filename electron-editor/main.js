const electron = require('electron');
//manipulador de arquivo node js
const fs = require('fs');
const { app, BrowserWindow, ipcMain, dialog, Menu } = electron;

let win;
let filePath = undefined;

app.on('ready', () => {
    win = new BrowserWindow({
        width: 600,
        height: 700,
        webPreferences: {
            nodeIntegration: true
        }
    });
    win.loadFile('index.html');
    const menu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(menu);
});

ipcMain.on('save', (event, text) => {
    //save the text to a file
    if (filePath === undefined) {
        dialog.showSaveDialog(win, { defaultPath: 'filename.txt' }, (fullpath) => {
            if (fullpath) {
                filePath = fullpath;

                writeToFile(text);
            }
        });
    }else {
        writeToFile(text);
    }

});

function writeToFile(data) {
    fs.writeFile(filePath, data, (err) => {
        if(err) {
            console.log('there was an error', err);
        }

        console.log(`${data} salvo com sucesso!`);

        win.webContents.send('saved', 'success');
    });
};

//menu
const menuTemplate = [
    //para macOS
    ...(process.platform === 'darwin' ? [{
        label: app.getName(),
        submenu: [
            {role: 'about'},
        ]
    }] : []),

    {
        label: 'Arquivo',
        submenu: [
            {
                label: 'Salvar',
                accelerator: 'CmdOrCtrl+s',
                click() {
                    win.webContents.send('save-clicked');
                }
            },

            {
                label: 'Salvar como',
                accelerator: 'CmdOrCtrl+Shift+s',
                click () {
                    filePath = undefined;
                    win.webContents.send('save-clicked');
                }
            }
        ],
    },
    
    {role: 'editMenu'}, 

    {role: 'viewMenu'},
];
