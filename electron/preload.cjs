const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  platform: process.platform,
  minimize: () => ipcRenderer.send('window-minimize'),
  maximize: () => ipcRenderer.send('window-maximize'),
  close: () => ipcRenderer.send('window-close'),
  saveConfig: (data) => ipcRenderer.invoke('save-config', data),
  loadConfig: () => ipcRenderer.invoke('load-config'),
  notify: (title, body) => ipcRenderer.send('show-notification', { title, body }),
  openExternal: (url) => ipcRenderer.send('open-external', url),
  simulateBiophysicsODE: (params) => ipcRenderer.invoke('run-python-physics', params),
  optimizeRecipe: (params) => ipcRenderer.invoke('optimize-recipe', params),
});
