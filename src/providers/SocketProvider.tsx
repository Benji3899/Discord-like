import { ReactNode, createContext, useContext, useMemo, useEffect } from "react";
import { io, Socket } from "socket.io-client";

export type AppSocket = {
    onMessage(callback: (message: unknown) => void): () => void;
    send(message: { room: string, message: string }): void;
    joinRoom(room: string): void;
    on(event: string, callback: (...args: any[]) => void): void;
    off(event: string, callback?: (...args: any[]) => void): void;
    emit(event: string, ...args: any[]): void;
    getId(): string | undefined;
};

// Déclare les types de code exposé par Electron sur l'objet window
declare global {
    interface Window {
        MessageAPI: {
            addMessageListener(callback: (message: unknown) => void): () => void;
            send(message: { room: string, message: string }): void;
            joinRoom(room: string): void;
            newWindow(): void;
        }
    }
}

// Contexte pour fournir le socket à toute l'application
const context = createContext<AppSocket | null>(null);

// Fournisseur de socket qui gère la connexion et la communication via WebSocket
export function SocketProvider({ children }: { children: ReactNode }) {
    const websocket: Socket = useMemo(() => io('http://localhost:3000'), []);

    const appSocket: AppSocket = useMemo<AppSocket>(
        () => ({
            onMessage(callback) {
                websocket.on('message', callback);
                return () => {
                    websocket.off('message', callback);
                };
            },
            send(message) {
                websocket.emit('message', message);
            },
            joinRoom(room) {
                websocket.emit('joinRoom', room);
            },
            on(event, callback) {
                websocket.on(event, callback);
            },
            off(event, callback) {
                websocket.off(event, callback);
            },
            emit(event, ...args) {
                websocket.emit(event, ...args);
            },
            getId() {
                return websocket.id;
            }
        }), [websocket]
    );

    useEffect(() => {
        return () => {
            websocket.disconnect();
        };
    }, [websocket]);

    return <context.Provider value={appSocket}>{children}</context.Provider>;
}

// Hook personnalisé pour utiliser le socket dans les composants
export function useSocket() {
    const socket = useContext(context);
    if (!socket) {
        throw new Error("useSocket must be used within a SocketProvider");
    }
    return socket;
}
