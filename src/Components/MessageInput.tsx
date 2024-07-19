import React, { useState } from "react";
import { useSocket } from "../providers/SocketProvider";
import './messageinput.css';

interface MessageInputProps {
    room: string;
    prenom: string;
}

export const MessageInput = ({ room, prenom }: MessageInputProps) => {
    const [message, setMessage] = useState("");
    const socket = useSocket();

    return (
        <form
            className="message-input-container"
            onSubmit={(event) => {
                event.preventDefault();
                if (message.trim() === "") {
                    return; // Ne rien faire si le message est vide
                }
                // Envoie le message via le socket
                socket.send({ room, message });
                // et réinitialise l'entrée
                setMessage("");
            }}
        >
            <input
                type="text"
                value={message}
                // Met à jour l'état du message à chaque changement dans l'input
                onChange={(event) => setMessage(event.target.value)}
            />
            <input type="submit" value="Envoyer" />
        </form>
    );
};