import { createServer } from 'http';
import { Server } from 'socket.io';
import mysql from 'mysql2/promise';

// Crée le serveur HTTP et le serveur WebSocket
const httpServer = createServer();
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Configuration de la connexion à la base de données
const dbConfig = {
    host: 'localhost',
    user: 'root',
    password: '', // Remplacez par votre mot de passe MySQL (peut être vide par défaut)
    database: 'chat_app'
};

// Définir le type pour les messages
interface Message {
    message: string;
    timestamp: string;
}


// Fonction pour sauvegarder un message
const saveMessage = async (room: string, message: string) => {
    const connection = await mysql.createConnection(dbConfig);
    await connection.execute('INSERT INTO messages (room, message) VALUES (?, ?)', [room, message]);
    await connection.end();
};

// Fonction pour récupérer les messages d'un salon
const getMessages = async (room: string): Promise<Message[]> => {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute('SELECT message, timestamp FROM messages WHERE room = ? ORDER BY timestamp ASC', [room]);
    await connection.end();
    return rows as Message[];
};

// Gestion des connexions WebSocket
io.on('connection', (socket) => {
    console.log('un utilisateur est connecté');

    // Gestion de l'événement de rejoindre une salle
    socket.on('joinRoom', async (room) => {
        socket.join(room);
        console.log(`Un utilisateur a rejoint le salon : ${room}`);

        // Récupérer et envoyer les anciens messages du salon
        const messages = await getMessages(room);
        messages.forEach((msg: any) => {
            socket.emit('message', msg.message);
        });
    });

    // Gestion de l'envoi de messages
    socket.on('message', async ({ room, message }) => {
        console.log(`Message reçu de la salle ${room}: ${message}`);
        await saveMessage(room, message);
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