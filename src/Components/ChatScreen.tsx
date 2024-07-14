import { MessageInput } from "./MessageInput";
import { MessageList } from "./MessageList";

// Composant principal de la salle de chat, affichant la liste des messages et l'entrée des messages
export const ChatScreen = () => {
    return (
        <div>
            <h1 className="text-center mb-2">Chat</h1>
            <MessageList />
            <MessageInput />
        </div>
    );
};