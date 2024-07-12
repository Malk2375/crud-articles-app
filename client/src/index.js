import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { Toaster } from "react-hot-toast";
import { io } from 'socket.io-client';

const socket = io('http://localhost:8000'); // Connecter le client à socket.io

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App socket={socket} />
    <Toaster position="top-right" />
  </React.StrictMode>
);
