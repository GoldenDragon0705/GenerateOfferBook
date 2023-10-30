const { app, BrowserWindow, Menu, ipcMain, dialog } = require('electron')
const url = require('url')
const path = require('path')

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))
  
  ipcMain.on('hey-open-my-dialog-now', () => {
    dialog.showOpenDialog({ properties: ['openFile', 'multiSelections'] })
  });
}

const menutemplate = [
  {
    label: 'Offerbook',
    submenu: [
      {
        label: 'Create'
      }
    ]
  }
]

const menu = Menu.buildFromTemplate(menutemplate)
Menu.setApplicationMenu(menu)
app.on('ready', createWindow)