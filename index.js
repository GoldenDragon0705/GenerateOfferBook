const { app, BrowserWindow, Menu, ipcMain, dialog, session } = require('electron')
const url = require('url')
const path = require('path')
const PdfModule = require('./modules/pdf.module');

let win

function createWindow() {
  win = new BrowserWindow({
    width: 1000,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      // nodeIntegration: true,
      // contextIsolation: false,
      // enableRemoteModule: true,
      // nodeIntegrationInWorker: true,
    }   
  })

  win.loadURL(url.format({
    pathname: path.join(__dirname, 'src/index.html'),
    protocol: 'file:',
    slashes: true
  }))

  ipcMain.handle('dialog', (event, method, params) => {       
    const filenames = dialog[method](win ,params) || [];
    event.sender.send("file_names", filenames);
  });

  ipcMain.handle('pdf', (event, params) => {
    const { offername, data } = params;
    PdfModule.generate(offername, data);
  });
}

const menutemplate = [
  {
    label: 'Offerbook',
    submenu: [
      {
        label: 'Create'
      },
      {
        label: "Save"
      }, 
      {
        label: "Save As"
      },
      {
        label: "Expert",
        submenu: [{
          label: "PDF file"
        }]
      }
    ]
  },
  {
    label: "Debug",
    submenu: [{
      role: "toggleDevTools"
    }]
  }
]

const menu = Menu.buildFromTemplate(menutemplate)
Menu.setApplicationMenu(menu)
app.on('ready', createWindow)