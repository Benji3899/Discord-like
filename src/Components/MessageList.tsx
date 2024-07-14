import React, { useEffect, useRef, useState } from "react";
import { useSocket } from "../providers/SocketProvider";

// Composant pour afficher un message individuel
function Message({ children }: { children: React.ReactNode }) {
    return <div>{children}</div>;
}

// Fonction de type guard pour vérifier si un événement est un message de chat
function isChatEvent(
    event: unknown
): event is { type: "chat-message"; content: string } {
    return (
        typeof event === "object" &&
        event !== null &&
        "type" in event &&
        event["type"] === "chat-message"
    );
}

// Composant pour afficher la liste des messages
export const MessageList = () => {
    const [messages, setMessage] = useState([
        {
            id: 1,
            author: "Benji",
            content: "Bonjour Evan, comment vas-tu ?",
        },
        {
            id: 2,
            author: "Evan",
            content: "Salut, je vais bien et toi ?",
        },
    ]);
    const lastMessageRef = useRef(null);

    const socket = useSocket();
    useEffect(
        () =>
            socket.onMessage((message) => {
                if (!isChatEvent(message)) {
                    return;
                }
                // Ajoute le nouveau message à la liste des messages
                setMessage((messages) => [
                    ...messages,
                    { id: messages.length + 1, author: "Benjamin", content: message.content },
                ]);
            }),
        [socket]
    );

    useEffect(() => {
        // Fait défiler vers le dernier message
        if (lastMessageRef.current) {
            lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="message-container">
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