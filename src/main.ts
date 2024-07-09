import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { io } from "socket.io-client";
import { fork } from 'child_process';

// mainWindow accessible à d'autre parties du code
// (notamment aux gestionnaires d'événements et autres fonctions du fichier)
let mainWindow: BrowserWindow;

const serverProcess = fork(path.join(__dirname, '../backend/index.ts'));

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
// if (require('electron-squirrel-startup')) {
//   app.quit();
// }

// Create Websocket
const socket = io("ws://localhost:3000");

const createWindow = () => {
  // Create the browser window.
  // const mainWindow = new BrowserWindow({
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();

  // Handle IPC messages
  ipcMain.on("socket-message", (_, message) => {
    socket.emit("message", message);
  });

  // Gestion des événements IPC pour l'envoi de messages
  const handleMessage = (message: unknown) => {
    console.log("Received message:", message);

    mainWindow.webContents.send("socket-message", message);
  };

  socket.on("message", handleMessage);

  mainWindow.on("close", () => {
    socket.off("message", handleMessage);
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

// Ensure the backend server process is properly handled
app.on('quit', () => {
  serverProcess.kill();
});