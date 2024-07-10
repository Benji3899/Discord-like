import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { io, Socket } from "socket.io-client";

// mainWindow accessible à d'autre parties du code (notamment aux gestionnaires d'événements et autres fonctions du fichier)
let mainWindow: BrowserWindow;

// Déclaration de la variable socket Websocket
let socket: Socket;

// Gère la création/suppression des raccourcis sous Windows lors de l'installation/désinstallation.
if (require('electron-squirrel-startup')) {
  app.quit();
}

// Fonction pour créer la fenêtre principale de l'application
const createWindow = () => {
  // Crée la fenêtre du navigateur
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // Charge le fichier index.html de l'application
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Ouvre les outils de développement
  mainWindow.webContents.openDevTools();

  // Initialise la connexion WebSocket
  socket = io("ws://localhost:3000");

  // Gestion des événements IPC pour l'envoi de messages
  const handleMessage = (message: string) => {
    console.log('Received message:', message);
    mainWindow.webContents.send("socket-message", message);
  };

  socket.on("message", handleMessage);

  mainWindow.on("close", () => {
    socket.off("message", handleMessage);
  });

  // Gestion des message Ipc et type de message
  ipcMain.on("socket-message", (_, data) => {
    console.log('Main process sending data to server:', data);
    if (data.type === 'joinRoom') {
      socket.emit("joinRoom", data.room);
    } else if (data.type === 'message') {
      socket.emit("message", { room: data.room, message: data.message });
    }
  });
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});