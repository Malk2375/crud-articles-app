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
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { SocketContext } from '../App';

const Article = () => {
  const [articles, setArticles] = useState([]);
  const socket = useContext(SocketContext);

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

  useEffect(() => {
    if (!socket) {
      console.error('Socket is not defined');
      return;
    }

    socket.on('articleAdded', (article) => {
      setArticles((prevArticles) => [...prevArticles, article]);
    });

    socket.on('articleUpdated', (updatedArticle) => {
      setArticles((prevArticles) =>
        prevArticles.map((article) =>
          article._id === updatedArticle._id ? updatedArticle : article
        )
      );
    });

    socket.on('articleDeleted', (articleId) => {
      setArticles((prevArticles) =>
        prevArticles.filter((article) => article._id !== articleId)
      );
    });

    return () => {
      socket.off('articleAdded');
      socket.off('articleUpdated');
      socket.off('articleDeleted');
    };
  }, [socket]);

  const deleteArticle = async (articleId) => {
    await axios
      .delete(`http://localhost:8000/api/delete/article/${articleId}`)
      .then((response) => {
        setArticles((prevArticles) =>
          prevArticles.filter((article) => article._id !== articleId)
        );
        toast.success(response.data.message);
        socket.emit('articleDeleted', articleId);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="articleTable">
      <Link to="/add">
        <Button variant="contained" endIcon={<AddBoxIcon />}>
          Ajouter un article
        </Button>
      </Link>

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
                <TableCell align="right">Nom de l'article</TableCell>
                <TableCell align="right">Type</TableCell>
                <TableCell align="right">Prix</TableCell>
                <TableCell align="right">Note</TableCell>
                <TableCell align="right">Nombre d'année garantie</TableCell>
                <TableCell align="right">Disponibilité</TableCell>
                <TableCell align="right">Parametrer l'article</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {articles.map((article, index) => (
                <TableRow
                  key={article.name}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {index + 1}
                  </TableCell>
                  <TableCell align="right">{article.name}</TableCell>
                  <TableCell align="right">{article.type}</TableCell>
                  <TableCell align="right">{article.price}</TableCell>
                  <TableCell align="right">{article.rating}</TableCell>
                  <TableCell align="right">{article.warranty_years}</TableCell>
                  <TableCell align="right">{article.available ? 'Oui' : 'Non'}</TableCell>
                  <TableCell align="right">
                    <Link to={`/update/${article._id}`}>
                      <Button variant="contained" color="success" endIcon={<EditIcon />}>
                        Modifier
                      </Button>
                    </Link>
                    <Button
                      onClick={() => deleteArticle(article._id)}
                      variant="contained"
                      color="error"
                      endIcon={<DeleteIcon />}
                    >
                      Supprimer
                    </Button>
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
