import { Server } from "socket.io";
import cors from 'cors';
import express from 'express';
import http from 'http';
// Fonction principale pour initialiser le serveur
function main() {
        const app = express();
        app.use(cors({
            origin: 'http://localhost:5173'
        }));

        const server = http.createServer(app);
        const io = new Server(server, {
            cors: {
                origin: "http://localhost:5173",
                methods: ["GET", "POST"]
            }
        });
        // const server = require('http').createServer(app);
        // const io = new Server(server, {
        //     cors: {
        //         origin: "http://localhost:5173",
        //         methods: ["GET", "POST"]
        //     }
        // });


        // Écoute les connexions entrantes
        io.on("connection", (socket) => {
            console.log("Nouvelle connexion :", socket.id);

            // Rejoindre une salle spécifique
            socket.on("joinRoom", (room) => {
                socket.join(room);
                console.log(`Socket ${socket.id} a rejoint la salle ${room}`);
            });

            // Écoute les messages entrants sur la connexion
            socket.on("message", ({ room, message }) => {
                console.log("Message reçu :", message, "dans la salle :", room);

                // Émet le message uniquement aux sockets dans la même salle
                io.to(room).emit("message", { type: "chat-message", content: message, room });
            });

            // Déconnexion
            socket.on("disconnect", () => {
                console.log("Déconnexion :", socket.id);
            });
        });

        // Démarre le serveur sur le port 3000
        server.listen(3000, () => {
            console.log("Serveur démarré sur le port 3000");
        });
    }

// Appelle la fonction principale pour démarrer le serveur
    main();