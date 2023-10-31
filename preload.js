const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electron', {
  openDialog: (method, config) => {
    const result = ipcRenderer.invoke('dialog', method, config);
    return result;
  },
  addLoadImages: (callback) => {
    ipcRenderer.on("image_names", (event, data) => {
      callback(data);
    });
  }
});
