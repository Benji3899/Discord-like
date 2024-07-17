import { Server } from "socket.io";
import cors from 'cors';
import express from 'express';
import http from 'http';

// Structure pour stocker les messages par salon
const messagesByRoom: { [room: string]: { id: number, author: string, content: string }[] } = {};

// Liste des prénoms
const prenoms = ["Benjamin", "Tristan", "Evan", "Lucie", "Clément", "Alexandre", "Yassine", "Anthony", "Paul", "Jérémy"];
let prenomsUtilises: string[] = [];

// Fonction pour générer un prénom basé sur l'ID du socket
const generatePrenom = (socketId: string) => {
    const index = Math.abs(socketId.hashCode()) % prenoms.length;
    return prenoms[index];
};

// Ajout de la méthode hashCode à String
declare global {
    interface String {
        hashCode(): number;
    }
}

String.prototype.hashCode = function() {
    let hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0; // Convert to 32bit integer
    }
    return hash;
};

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

    app.get('/messages/:room', (req, res) => {
        const room = req.params.room;
        res.json(messagesByRoom[room] || []);
    });

        // Écoute les connexions entrantes
        io.on("connection", (socket) => {
            console.log("Nouvelle connexion :", socket.id);

            // Assigner un prénom à chaque socket
            const prenom = generatePrenom(socket.id);
            socket.data.prenom = prenom;

            // Rejoindre une salle spécifique
            socket.on("joinRoom", (room) => {
                socket.join(room);
                console.log(`${socket.data.prenom} - (${socket.id}) a rejoint la salle ${room}`);
            });

            // Écoute les messages entrants sur la connexion
            socket.on("message", ({ room, message }) => {
                console.log(`Message reçu de ${socket.data.prenom} : ${message} dans la salle ${room}`);

                const newMessage = { id: Date.now(), author: socket.data.prenom, content: message };

                if (!messagesByRoom[room]) {
                    messagesByRoom[room] = [];
                }

                messagesByRoom[room].push(newMessage);

                // Émet le message uniquement aux sockets dans la même salle
                io.to(room).emit("message", { type: "chat-message", ...newMessage, room });
            });

            // Déconnexion
            socket.on("disconnect", () => {
                console.log(`Déconnexion de ${socket.data.prenom} :`, socket.id);
            });
        });

        // Démarre le serveur sur le port 3000
        server.listen(3000, () => {
            console.log("Serveur démarré sur le port 3000");
        });
    }

// Appelle la fonction principale pour démarrer le serveur
    main();