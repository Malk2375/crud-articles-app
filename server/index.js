import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import route from "./routes/articleRoute.js";
import cors from "cors";
import { createServer } from "http";
import { Server } from "socket.io";

const app = express();
const server = createServer(app); // Utiliser http.createServer au lieu de app.listen
const io = new Server(server, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ["GET", "POST", "PUT", "DELETE"]
  }
});

app.use(bodyParser.json());

// Configure CORS to allow requests from http://localhost:3000
const corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200 // For legacy browser support
};

app.use(cors(corsOptions));
dotenv.config();

const PORT = process.env.PORT || 8000; // Assurez-vous que le port est correctement configuré
const MONGOURL = process.env.MONGO_URL;

mongoose
  .connect(MONGOURL)
  .then(() => {
    console.log("Bien connecté a la base de données MongoDB");
    server.listen(PORT, () =>
      console.log(`Serveur s'exécute sur le port ${PORT}`));
  })
  .catch((error) => console.error("Erreur de connexion à la base de données :", error));

app.use("/api", route);

// Ajouter la configuration de socket.io
io.on('connection', (socket) => {
  console.log('Un utilisateur est connecté:', socket.id);

  socket.on('disconnect', () => {
    console.log('Un utilisateur est déconnecté:', socket.id);
  });
});

export { io };
