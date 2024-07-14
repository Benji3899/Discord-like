import { Server } from "socket.io";

// Fonction principale pour initialiser le serveur
function main() {
    const io = new Server({
        cors: {
            origin: "*",
        },
    });

    // Écoute les connexions entrantes
    io.on("connection", (socket) => {
        console.log("Nouvelle connexion :", socket.id);

        // Écoute les messages entrants sur la connexion
        socket.on("message", (message) => {
            console.log("Message reçu :", message);

            // Émet le message à tous les sockets connectés
            io.send(message);
        });
    });

    // Démarre le serveur sur le port 3000
    io.listen(3000);
    console.log("Serveur démarré sur le port 3000");
}

// Appelle la fonction principale pour démarrer le serveur
main();
