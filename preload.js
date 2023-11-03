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
<<<<<<< HEAD
  saveDocFileName: (productInfo, fileName) => {
    ipcRenderer.send('saveDocFileName', productInfo, fileName)
=======
  pdf: (config) => {
    return ipcRenderer.invoke('pdf', config);
>>>>>>> 989227b60fd5f9c5f38b03c479f9c9303b83385e
  }
});
