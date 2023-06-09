const { contextBridge, ipcRenderer } = require('electron')
const os = require('os');
const Toastify = require('toastify-js');
const path =  require('path');

contextBridge.exposeInMainWorld('os', {
  homedir: () => os.homedir(),
  // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('path', {
    join: (...args) => path.join(...args),
    // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('Toastify', {
    toast: (options) => Toastify(options).showToast(),
    // we can also expose variables, not just functions
});

contextBridge.exposeInMainWorld('ipcRenderer', {
    send: (channel, data) => ipcRenderer.send(channel,data),
    on: (channel, func) => ipcRenderer.on(channel, (event, ...args) => func)
    // we can also expose variables, not just functions
});