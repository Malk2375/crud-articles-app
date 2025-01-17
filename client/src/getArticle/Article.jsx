import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Box, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SocketContext } from '../App';

const Article = () => {
  const [articles, setArticles] = useState([]); // État local pour stocker les articles
  const socket = useContext(SocketContext); // Utilisation du contexte SocketContext pour gérer les événements socket

  // Effectuer une requête GET au chargement du composant pour récupérer la liste des articles depuis l'API
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/articles');
        setArticles(response.data);
      } catch (error) {
        console.log('Erreur lors de la récupération des données', error);
      }
    };
    fetchData();
  }, []);

  // Configurer les écouteurs d'événements socket pour les opérations CRUD en temps réel
  useEffect(() => {
    if (!socket) {
      console.error('Socket is not defined');
      return;
    }

    // Écouter l'événement 'articleAdded' pour mettre à jour la liste d'articles lorsqu'un nouvel article est ajouté
    socket.on('articleAdded', (article) => {
      setArticles((prevArticles) => [...prevArticles, article]);
    });

    // Écouter l'événement 'articleUpdated' pour mettre à jour un article existant lorsqu'il est modifié
    socket.on('articleUpdated', (updatedArticle) => {
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === updatedArticle._id ? updatedArticle : article
        )
      );
    });

    // Écouter l'événement 'articleDeleted' pour supprimer un article de la liste lorsqu'il est supprimé
    socket.on('articleDeleted', (articleId) => {
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
    });

    // Nettoyer les écouteurs d'événements socket lorsque le composant est démonté
    return () => {
      socket.off('articleAdded');
      socket.off('articleUpdated');
      socket.off('articleDeleted');
    };
  }, [socket]);

  // Fonction pour supprimer un article en envoyant une requête DELETE à l'API
  const deleteArticle = async (articleId) => {
    await axios
      .delete(`http://localhost:8000/api/delete/article/${articleId}`) // Requête DELETE pour supprimer l'article
      .then((response) => {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== articleId)
        ); // Mettre à jour la liste d'articles après la suppression
        toast.success(response.data.message);
        socket.emit('articleDeleted', articleId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="articleTable">
      <Box sx={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <Typography variant="h3" gutterBottom>
          La Liste des articles
        </Typography>
      </Box>

      <Link to="/add">
        <Button sx={{ marginBottom: '30px', marginTop: '30px' }} variant="contained" endIcon={<AddBoxIcon />}>
          Ajouter un article
        </Button>
      </Link>

      {/* Condition pour afficher un message si aucune article n'est disponible */}
      {articles.length === 0 ? (
        <div>
          <p>Aucun article disponible.</p>
        </div>
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} size="small" aria-label="a dense table">
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell align="center">Nom de l'article</TableCell>
                <TableCell align="center">Type</TableCell>
                <TableCell align="center">Prix</TableCell>
                <TableCell align="center">Note</TableCell>
                <TableCell align="center">Nombre d'année garantie</TableCell>
                <TableCell align="center">Disponibilité</TableCell>
                <TableCell align="center">Paramétrer l'article</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article, index) => (
                <TableRow
                  key={article._id}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="center">{article.name}</TableCell>
                  <TableCell align="center">{article.type}</TableCell>
                  <TableCell align="center">{article.price} €</TableCell>
                  <TableCell align="center">{article.rating}</TableCell>
                  <TableCell align="center">{article.warranty_years} an(s)</TableCell>
                  <TableCell align="center">{article.available ? 'Oui' : 'Non'}</TableCell>
                  <TableCell align="center">
                    <Box display="flex" justifyContent="center">
                      <Link to={`/update/${article._id}`}>
                        <Button sx={{ margin: '10px' }} variant="contained" color="success" endIcon={<EditIcon />}>
                          Modifier
                        </Button>
                      </Link>
                      <Button
                        onClick={() => deleteArticle(article._id)}
                        variant="contained"
                        color="error"
                        sx={{ margin: '10px' }}
                        endIcon={<DeleteIcon />}
                      >
                        Supprimer
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
};

export default Article;
