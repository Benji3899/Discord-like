// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';

// Exposer une API sécurisée à la fenêtre de rendu via contextBridge
contextBridge.exposeInMainWorld('electron', {
    sendMessage: (message: string) => ipcRenderer.send('socket-message', message),
    onMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => ipcRenderer.on('socket-message', callback),
    offMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => ipcRenderer.off('socket-message', callback),
});
