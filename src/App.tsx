import React from 'react';
import { ChatRoom } from './Components/ChatRoom';

// Déclaration globale pour l'objet electron exposé par le preload script
declare global {
    interface Window {
        electron: {
            sendMessage: (message: { type: string; room: string; message?: string }) => void;
            onMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => void;
            offMessage: (callback: (event: Electron.IpcRendererEvent, message: string) => void) => void;
        };
    }
}

// Composant principal de l'application
export const App = () => {
    return (
        <ChatRoom />
    );
};
