const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => {
    const result = ipcRenderer.invoke('dialog', method, config);
    return result;
  },
  loadFileNames: (callback) => {
    ipcRenderer.on("file_names", (event, data) => {
      callback(data);
    });
  },
  saveDocFileName: (productInfo, fileName) => {
    ipcRenderer.send('saveDocFileName', productInfo, fileName)
  }
});
