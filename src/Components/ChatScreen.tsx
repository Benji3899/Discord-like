import React, { useEffect, useState } from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import { useSocket } from "../providers/SocketProvider";

// Composant principal de la salle de chat, affichant la liste des messages et l'entrée des messages
export const ChatScreen = () => {
    const [room, setRoom] = useState("general");
    const socket = useSocket();

    // Rejoindre une salle à chaque fois que `room` change
    useEffect(() => {
        socket.joinRoom(room);
    }, [room, socket]);

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
            <MessageList room={room} />
            <MessageInput room={room} />
        </div>
    );
};
