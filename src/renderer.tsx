import {createRoot} from "react-dom/client";
import {App} from "./App";
import {SocketProvider} from "./providers/SocketProvider";

const rootElement = document.getElementById("#root");

if (rootElement) {
    // Initialise et rend l'application dans l'élément racine,
    // en enveloppant avec SocketProvider pour fournir un contexte de socket à toute l'application
    createRoot(rootElement).render(
        <SocketProvider>
            <App/>
        </SocketProvider>
    );
}