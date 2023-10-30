const {ipcRenderer, contextBridge} = require('electron');

contextBridge.exposeInMainWorld('MY_APP_NAMESPACE', {
  openDialog() {
    ipcRenderer.send('hey-open-my-dialog-now');
  }
});