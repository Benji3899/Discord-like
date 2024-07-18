import React, {useEffect, useRef} from "react";
import {useSocket} from "../providers/SocketProvider";
import './messagelist.css';

// Composant pour afficher un message individuel
function Message({children}: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

// Déclaration de type pour les événements de chat
interface ChatEvent {
    type: "chat-message";
    content: string;
    room: string; // Ajout du champ room pour vérifier la salle
    id: number;
    author: string;
}

interface MessageListProps {
    room: string;
    messages: { id: number, author: string, content: string }[];
    addMessage: (message: { id: number, author: string, content: string }) => void;
}

// Fonction de type guard pour vérifier si un événement est un message de chat
function isChatEvent(event: unknown): event is ChatEvent {
    return typeof event === "object" && event !== null && "type" in event && (event as ChatEvent).type === "chat-message";
}

// Composant pour afficher la liste des messages
export const MessageList = ({room, messages, addMessage}: MessageListProps) => {
    const lastMessageRef = useRef<HTMLDivElement | null>(null);
    const socket = useSocket();

    useEffect(() => {
        // Gestionnaire pour les nouveaux messages
        const handleMessage = (message: unknown) => {
            if (!isChatEvent(message)) {
                return;
            }
            if (message.room !== room) {
                return; // Ignore les messages qui ne sont pas destinés à la salle actuelle
            }
            addMessage({id: message.id, author: message.author, content: message.content});
        };

        const unsubscribe = socket.onMessage(handleMessage);
        return () => {
            unsubscribe();
        };
    }, [socket, room, addMessage]);

    useEffect(() => {
        // Fait défiler vers le dernier message
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({behavior: "smooth"});
        }
    }, [messages]);

    return (
        <div className="message-list">
            {messages.map((message, index) => (
                <div
                    key={message.id}
                    ref={index === messages.length - 1 ? lastMessageRef : null}
                    className="containerMessage"
                >
                    <Message key={message.id}>
                        {message.author} : {message.content}
                    </Message>
                </div>
            ))}
        </div>
    );
};
