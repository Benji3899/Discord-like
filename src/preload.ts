import { IpcRendererEvent, contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("MessageAPI", {
    // Ajoute un listener pour les messages reçus via IPC
    addMessageListener: (callback: (message: unknown) => void) => {
        const wrapperCallback = (_: IpcRendererEvent, message: unknown) =>
            callback(message);
        ipcRenderer.on("socket-message", wrapperCallback);
        return () => ipcRenderer.off("socket-message", wrapperCallback);
    },
    // Envoie un message via IPC
    send(message: unknown) {
        ipcRenderer.send("socket-message", message);
    }
});
