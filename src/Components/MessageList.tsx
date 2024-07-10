import React from 'react';

interface MessageListProps {
    messages: string[];
}

// Composant pour afficher la liste des messages
export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
    return (
        <div>
            {messages.map((msg, index) => (
                <div key={index}>{msg}</div>
            ))}
        </div>
    );
};
