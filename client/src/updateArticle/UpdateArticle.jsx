import React, { useEffect, useState } from 'react';
import Typography from '@mui/material/Typography';
import './updatearticle.css';
import { FormControl, FormGroup, InputLabel, Input } from '@mui/material';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from "axios";
import toast from "react-hot-toast";

const UpdateArticle = () => {
  const initialArticleState = {
    name: '',
    type: '',
    price: '',
    rating: '',
    warranty_years: '',
    available: false,
  };

  const [article, setArticle] = useState(initialArticleState);
  const navigate = useNavigate();
  const {id} = useParams();


  const inputHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle({
      ...article,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  useEffect (()=> {
    axios.get(`http://localhost:8000/api/article/${id}`)
      .then((response) => {
        setArticle(response.data);
      })
      .catch((error) => {
        console.log('Erreur lors de la récupération de l\'article : ', error);
      });
  },[id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.put(`http://localhost:8000/api/update/article/${id}`, article)
      .then((response) => {
        toast.success(response.data.message);
        navigate('/');
      })
      .catch((error) => {
        console.log('Erreur lors de l\'ajout de l\'article : ', error);
      })
    // console.log(article);
  };

  return (
    <div>
      <Link to="/">
        <Button variant="contained" color="secondary" startIcon={<ArrowBackIosIcon />}>
          Retour
        </Button>
      </Link>
      <Typography variant="h1">
        Modifier un article
      </Typography>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl>
            <InputLabel htmlFor="name">Nom d'article</InputLabel>
            <Input name="name" id="name" value={article.name} onChange={inputHandler} placeholder="Name" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="type">Type d'article</InputLabel>
            <Input name="type" id="type" value={article.type} onChange={inputHandler} placeholder="Type" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="price">Prix d'article</InputLabel>
            <Input name="price" id="price" value={article.price} onChange={inputHandler} placeholder="Price" type="number" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="rating">Note d'article</InputLabel>
            <Input name="rating" id="rating" value={article.rating} onChange={inputHandler} placeholder="Rating" type="number" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="warranty_years">Garantie d'article (années)</InputLabel>
            <Input name="warranty_years" id="warranty_years" value={article.warranty_years} onChange={inputHandler} placeholder="Warranty years" type="number" />
          </FormControl>
          <FormControl>
            <InputLabel htmlFor="available">Disponibilité d'article</InputLabel>
            <Input name="available" id="available" type="checkbox" checked={article.available} onChange={inputHandler} />
          </FormControl>
          <FormControl>
            <Button variant="contained" color="success" endIcon={<AddBoxIcon />} type="submit">
              Modifier un article
            </Button>
          </FormControl>
        </FormGroup>
      </form>
    </div>
  );
};

export default UpdateArticle;
