const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => {
    const result = ipcRenderer.invoke('dialog', method, config);
    return result;
  },
  saveDialog: (config, data) => {
    ipcRenderer.invoke('save_dialog', config, data);
  },
  loadFileNames: (callback) => {
    ipcRenderer.on("file_names", (event, data) => {
      callback(data);
    });
  },
  pdf: (config) => {
    return ipcRenderer.invoke('pdf', config);
  }
});
