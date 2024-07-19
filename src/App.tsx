import React, { useState } from 'react';
import { ChatScreen } from './Components/ChatScreen';
import { LoginScreen } from './Components/LoginScreen';

export const App = () => {
    const [prenom, setPrenom] = useState<string | null>(null);

    if (!prenom) {
        return <LoginScreen onLogin={setPrenom} />;
    }

    return (
        <div>
            <ChatScreen prenom={prenom} />
        </div>
    );
};
