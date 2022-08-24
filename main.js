//#region Dependencies
const { app, BrowserWindow, dialog, ipcMain, Menu } = require('electron');
const fs = require('fs');
const { homedir } = require('os');
const { name } = require('./package.json');
const path = require('path');
//#endregion

//#region Constants & variables
const configs = {
    shouldDisplay: true
};
const configsDir = path.resolve(homedir(), '.chongett', name);
const configsFile = path.resolve(configsDir, 'settings.json');
const devTools = true;
let win;
//#endregion

//#region Methods
const createMenu = () => Menu.buildFromTemplate([{
    role: 'fileMenu',
    submenu: [
        {
            role: 'close',
        }, {
            role: 'quit',
        },
    ],
},]);
const createWindow = () => {
    win = new BrowserWindow({
        width: 640,
        height: 480,
        icon: path.resolve(__dirname, 'build', 'icon.old.png'),
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: path.resolve(__dirname, 'build', 'preload.js'),
        },
    });

    Menu.setApplicationMenu(createMenu());

    if (devTools) {
        win.webContents.openDevTools({ mode: 'detach' });
    }

    win.setTitle(name.replace(/[.-]/g, ' '));
    win.loadFile(path.resolve(__dirname, 'dist', 'index.html'));
};
const loadConfigs = () => {
    if (!fs.existsSync(configsDir)) {
        fs.mkdirSync(configsDir, { recursive: true });
    }
    if (fs.existsSync(configsFile)) {
        Object.assign(configs, require(configsFile));
    }
};
const saveConfigs = () => fs.writeFileSync(configsFile, JSON.stringify(configs), { flag: 'w' });
//#endregion

//#region Events
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0 && configs.shouldDisplay) {
        createWindow();
    }
});

app.on('ready', () => {
    loadConfigs();
    if (configs.shouldDisplay) {
        createWindow();
    }
});

app.on('window-all-closed', () => {
    saveConfigs();
    if (process.platform !== 'darwin' || devTools) {
        app.exit();
    }
});
//#endregion