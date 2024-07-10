import React, { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import {RoomSelector} from "./RoomSelector";

// Composant principal qui encapsule la logique et l'affichage des salons.
export const ChatRoom = () => {
    const [messages, setMessages] = useState<string[]>([]);
    const [currentRoom, setCurrentRoom] = useState<string>('default');
    const rooms = ['default', 'jeux vidéo', 'musique', 'sport']; // Liste des salons disponibles

    // Utiliser un effet pour gérer l'abonnement aux messages
    useEffect(() => {
        const handleMessage = (_: unknown, newMessage: string) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
        };

        window.electron.onMessage(handleMessage);

        // Nettoyer l'abonnement lorsqu'on quitte le composant
        return () => {
            window.electron.offMessage(handleMessage);
        };
    }, []);

    useEffect(() => {
        window.electron.sendMessage({ type: 'joinRoom', room: currentRoom });
        setMessages([]); // Réinitialiser les messages lors du changement de salon
    }, [currentRoom]);

    const sendMessage = (message: string) => {
        if (message.trim()) {
            window.electron.sendMessage({ type: 'message', room: currentRoom, message });
        }
    };

    return (
        <div>
            <RoomSelector rooms={rooms} onSelectRoom={setCurrentRoom} />
            <h1>Salon - {currentRoom}</h1>

            <MessageList messages={messages} />
            <MessageInput onSend={sendMessage} />
        </div>
    );
};
