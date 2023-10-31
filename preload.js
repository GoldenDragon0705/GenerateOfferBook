const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('ATTACHMENT_IMAGES', {
  async openDialog(callback) {
    ipcRenderer.send('hey-open-my-dialog-now');
    ipcRenderer.on("fileData", (event, data) => {
      callback(data);
    });
  }
});