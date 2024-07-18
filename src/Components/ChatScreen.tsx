import React, { useEffect, useState } from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useSocket } from "../providers/SocketProvider";
import './chatscreen.css';

// Définir le type pour les messages
interface Message {
    id: string; // string pour l'utilisation de uuid
    author: string;
    content: string;
}

type MessagesByRoom = {
    [room: string]: Message[];
};

type NotificationsByRoom = {
    [room: string]: boolean;
};

// Composant principal de la salle de chat, affichant la liste des messages et l'entrée des messages
export const ChatScreen = () => {
    const [room, setRoom] = useState("general");
    const [messagesByRoom, setMessagesByRoom] = useState<MessagesByRoom>({
        general: [],
        technologie: [],
        jeux: [],
    });
    const [notifications, setNotifications] = useState<NotificationsByRoom>({
        general: false,
        technologie: false,
        jeux: false,
    });
    const [prenom, setPrenom] = useState("");
    const socket = useSocket();

    // Rejoindre une salle à chaque fois que 'room' change
    useEffect(() => {
        socket.joinRoom(room);

        // Récupérer les messages du serveur
        fetch(`http://localhost:3000/messages/${room}`)
            .then(response => response.json())
            .then(data => {
                setMessagesByRoom(prevMessagesByRoom => ({
                    ...prevMessagesByRoom,
                    [room]: data
                }));
            });

        // Recevoir le prénom attribué lors de la connexion
        socket.on("connect", () => {
            socket.emit("requestPrenom"); // Demande le prénom au backend
        });

        socket.on("receivePrenom", (prenom: string) => {
            setPrenom(prenom); // Assigne le prénom reçu du backend
        });

        // Écoute les messages entrants
        socket.on("message", (message: { room: string, id: string, author: string, content: string }) => {
            console.log(`Message reçu dans le salon ${message.room}:`, message);

            setMessagesByRoom(prevMessagesByRoom => {
                const roomMessages = prevMessagesByRoom[message.room] || [];
                if (roomMessages.find(msg => msg.id === message.id)) {
                    return prevMessagesByRoom; // Ne pas ajouter si le message existe déjà
                }
                return {
                    ...prevMessagesByRoom,
                    [message.room]: [...roomMessages, message]
                };
            });

            if (message.room !== room) {
                console.log(`Notification pour le salon ${message.room}`);
                setNotifications(prevNotifications => ({
                    ...prevNotifications,
                    [message.room]: true
                }));
            }
        });

        return () => {
            socket.off("message");
            socket.off("connect");
            socket.off("receivePrenom");
        };
    }, [room, socket]);

    // Fonction pour rejoindre une nouvelle salle et réinitialiser les notifications
    const handleJoinRoom = (newRoom: string) => {
        setRoom(newRoom);
        setNotifications(prevNotifications => ({
            ...prevNotifications,
            [newRoom]: false
        }));
    };

    const openNewWindow = () => {
        window.MessageAPI.newWindow();
    };

    return (
        <div className="chat-container">
            <div className="sidebar">
                <button onClick={openNewWindow}>Ouvrir une nouvelle fenêtre</button>
                <button onClick={() => handleJoinRoom("general")}>
                    Général {notifications.general && <span className="notification-dot"></span>}
                </button>
                <button onClick={() => handleJoinRoom("technologie")}>
                    Technologie {notifications.technologie && <span className="notification-dot"></span>}
                </button>
                <button onClick={() => handleJoinRoom("jeux")}>
                    Jeux Vidéo {notifications.jeux && <span className="notification-dot"></span>}
                </button>
                <div className="username">Utilisateur : {prenom}</div>
            </div>
            <div className="main-content">
                <div className="header">
                    <h1>Salon : {room}</h1>
                </div>
                <MessageList
                    room={room}
                    messages={messagesByRoom[room] || []}
                    addMessage={(message) => setMessagesByRoom(prevMessagesByRoom => {
                        const roomMessages = prevMessagesByRoom[room] || [];
                        if (roomMessages.find(msg => msg.id === message.id)) {
                            return prevMessagesByRoom; // Ne pas ajouter si le message existe déjà
                        }
                        return {
                            ...prevMessagesByRoom,
                            [room]: [...roomMessages, message]
                        };
                    })}
                    prenom={prenom}
                />
                <MessageInput room={room} />
            </div>
        </div>
    );
};