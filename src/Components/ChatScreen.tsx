import React, { useEffect, useState } from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useSocket } from "../providers/SocketProvider";

// Définir le type pour les messages
interface Message {
    id: number;
    author: string;
    content: string;
}

type MessagesByRoom = {
    [room: string]: Message[];
};

// Composant principal de la salle de chat, affichant la liste des messages et l'entrée des messages
export const ChatScreen = () => {
    const [room, setRoom] = useState("general");
    const [messagesByRoom, setMessagesByRoom] = useState<MessagesByRoom>({
        general: [],
        technologie: [],
        jeux: [],
    });
    const socket = useSocket();

    // Rejoindre une salle à chaque fois que `room` change
    useEffect(() => {
        socket.joinRoom(room);
    }, [room, socket]);

    // Ajouter un message à la salle courante
    const addMessage = (message: Message) => {
        setMessagesByRoom(prevMessagesByRoom => ({
            ...prevMessagesByRoom,
            [room]: [...prevMessagesByRoom[room], message]
        }));
    };

    const joinRoom = (newRoom: string) => {
        setRoom(newRoom);
    };

    return (
        <div>
            <h1 className="text-center mb-2">Salon : {room}</h1>
            <div>
                <button onClick={() => joinRoom("general")}>Général</button>
                <button onClick={() => joinRoom("technologie")}>Technologie</button>
                <button onClick={() => joinRoom("jeux")}>Jeux Vidéo</button>
            </div>
            <MessageList room={room} messages={messagesByRoom[room]} addMessage={addMessage} />
            <MessageInput room={room} />
        </div>
    );
};
