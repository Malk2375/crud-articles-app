import React, { useEffect, createContext } from 'react';
import './App.css';
import Container from '@mui/material/Container';
import Article from './getArticle/Article';
import UpdateArticle from './updateArticle/UpdateArticle';
import AddArticle from './addArticle/AddArticle';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import io from 'socket.io-client';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

// Initialise le socket en dehors du composant App pour éviter les re-rendus multiples
const socket = io('http://localhost:8000');
export const SocketContext = createContext();

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Article />,
    },
    {
      path: '/add',
      element: <AddArticle />,
    },
    {
      path: '/update/:id',
      element: <UpdateArticle />,
    },
  ]);

  useEffect(() => {
    socket.on('connect', () => {
      console.log('Connected to socket server');
    });

    return () => {
      socket.off('connect');
    };
  }, []);

  return (
    <div className="App">
      <SocketContext.Provider value={socket}>
        <Container>
          <RouterProvider router={router} />
        </Container>
      </SocketContext.Provider>
    </div>
  );
}

export default App;
