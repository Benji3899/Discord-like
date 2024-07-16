import React, {useEffect, useState} from "react";
import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";
import {useSocket} from "../providers/SocketProvider";


// Composant principal de la salle de chat, affichant la liste des messages et l'entrée des messages
export const ChatScreen = () => {
        const [room, setRoom] = useState("general");
        const socket = useSocket();

    useEffect(() => {
        socket.joinRoom(room);
    }, [room, socket]);

    const joinRoom = (newRoom: string) => {
        setRoom(newRoom);
    };

    return (
        <div>
            <h1 className="text-center mb-2">Chat - Room: {room}</h1>
            <div>
                <button onClick={() => joinRoom("general")}>General</button>
                <button onClick={() => joinRoom("tech")}>Tech</button>
                <button onClick={() => joinRoom("random")}>Random</button>
            </div>
            <MessageList room={room} />
            <MessageInput room={room} />
        </div>
    );
};