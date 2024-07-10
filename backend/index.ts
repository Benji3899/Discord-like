import { createServer } from 'http';
import { Server } from 'socket.io';

// Crée le serveur HTTP et le serveur WebSocket
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log('un utilisateur est connecté');

    // Gestion de l'événement de rejoindre une salle
    socket.on('joinRoom', (room) => {
        socket.join(room);
        console.log(`Un utilisateur a rejoint le salon : ${room}`);
    });

    // Gestion de l'envoi de messages
    socket.on('message', ({ room, message }) => {
        console.log(`Message reçu de la salle ${room}: ${message}`);
        io.to(room).emit('message', message); // Émet le message à tous les clients de la salle
    });

    // Gestion de la déconnexion
    socket.on('disconnect', () => {
        console.log('Utilisateur déconnecté');
    });
});

// Démarrage du serveur sur le port spécifié
const PORT = process.env.PORT || 3000;
httpServer.listen(PORT, () => {
    console.log(`Serveur écoute sur le port ${PORT}`);
});