
import React, { useEffect, useState } from 'react';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';

// Composant principal qui encapsule la logique et l'affichage de la salle de chat.
// Composant principal de la salle de chat
export const ChatRoom = () => {
    const [messages, setMessages] = useState<string[]>([]);

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


    const sendMessage = (message: string) => {
        if (message.trim()) {
            window.electron.sendMessage(message);
            // Ajoutez le message à la liste des messages
            setMessages((prevMessages) => [...prevMessages, message]);
        }
    };

    return (
        <div>
            <h1>Chat Room</h1>
            <MessageList messages={messages} />
            <MessageInput onSend={sendMessage} />
            {/*<MessageInput onSend={(message) => {*/}
            {/*    window.electron.sendMessage(message);*/}
            {/*}} />*/}
        </div>
    );
};
