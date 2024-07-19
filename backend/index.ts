import { Server } from "socket.io";
import cors from 'cors';
import express from "express";
import http from 'http';
import { v4 as uuidv4 } from 'uuid';

// Structure pour stocker les messages par salon
const messagesByRoom: { [room: string]: { id: string, author: string, content: string }[] } = {};

// Liste des prénoms
const prenoms = ["Benjamin", "Tristan", "Evan", "Lucie", "Clément", "Alexandre", "Yassine", "Anthony", "Paul", "Jérémy"];

// Association des prénoms avec les identifiants des sockets
const prenomBySocketId: { [socketId: string]: string } = {};
const roomsBySocketId: { [socketId: string]: string[] } = {};

// Ajout de la méthode hashCode à String
declare global {
    interface String {
        hashCode(): number;
    }
}

String.prototype.hashCode = function () {
    let hash = 0, i, chr;
    for (i = 0; i < this.length; i++) {
        chr = this.charCodeAt(i);
        hash = ((hash << 5) - hash) + chr;
        hash |= 0;
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

    app.get('/prenoms', (req, res) => {
        res.json(prenoms);
    });

    app.get('/messages/:room', (req, res) => {
        const room = req.params.room;
        res.json(messagesByRoom[room] || []);
    });

    // Écoute les connexions entrantes
    io.on("connection", (socket) => {
        console.log("Nouvelle connexion :", socket.id);

        // Recevoir le prénom choisi par l'utilisateur
        socket.on("choosePrenom", (prenom) => {
            prenomBySocketId[socket.id] = prenom;
            roomsBySocketId[socket.id] = []; // Initialise avec une liste vide de salons
            console.log(`Prénom choisi pour ${socket.id} : ${prenom}`);
            socket.emit("receivePrenom", prenom);
        });

        // Rejoindre une salle spécifique
        socket.on("joinRoom", (room) => {
            socket.join(room);
            if (!roomsBySocketId[socket.id].includes(room)) {
                roomsBySocketId[socket.id].push(room); // Ajouter le salon à la liste des salons rejoints par le socket
            }
            console.log(`${prenomBySocketId[socket.id]} - (${socket.id}) a rejoint la salle ${room}`);
        });

        // Écoute les messages entrants sur la connexion
        socket.on("message", ({ room, message }) => {
            const prenom = prenomBySocketId[socket.id];
            console.log(`Message reçu de ${prenom} : ${message} dans la salle ${room}`);

            const newMessage = { id: uuidv4(), author: prenom, content: message }; // Utilisation de UUID

            if (!messagesByRoom[room]) {
                messagesByRoom[room] = [];
            }

            messagesByRoom[room].push(newMessage);

            // Émet le message uniquement aux sockets dans la même salle
            io.to(room).emit("message", { type: "chat-message", ...newMessage, room });

            // Émettre une notification à tous les autres sockets qui ne sont pas dans la même salle
            for (const [socketId, rooms] of Object.entries(roomsBySocketId)) {
                if (!rooms.includes(room) && socketId !== socket.id) {
                    io.to(socketId).emit("notification", { room });
                }
            }
        });

        // Déconnexion
        socket.on("disconnect", () => {
            const prenom = prenomBySocketId[socket.id];
            console.log(`Déconnexion de ${prenom} :`, socket.id);
            delete prenomBySocketId[socket.id]; // Supprime l'association
            delete roomsBySocketId[socket.id]; // Supprime les salons associés
        });
    });

    // Démarre le serveur sur le port 3000
    server.listen(3000, () => {
        console.log("Serveur démarré sur le port 3000");
    });
}

// Appelle la fonction principale pour démarrer le serveur
main();