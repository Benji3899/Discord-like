import React, { useState } from 'react';

interface MessageInputProps {
    onSend: (message: string) => void;
}

// Composant pour saisir et envoyer un message
export const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
    const [message, setMessage] = useState('');

    // Gérer l'appui sur la touche "Entrée"
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            send();
        }
    };

    // Envoyer le message
    const send = () => {
        if (message.trim()) {
            onSend(message);
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <button onClick={send}>Send</button>
        </div>
    );
};
