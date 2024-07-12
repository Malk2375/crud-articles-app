import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import './addarticle.css';
import { FormControl, FormGroup, InputLabel, Input, FormControlLabel, Checkbox } from '@mui/material';
import Button from '@mui/material/Button';
import AddBoxIcon from '@mui/icons-material/AddBox';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Box } from '@mui/material';

const AddArticle = () => {
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

  const inputHandler = (e) => {
    const { name, value, type, checked } = e.target;
    setArticle({
      ...article,
      [name]: type === 'checkbox' ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await axios.post('http://localhost:8000/api/article', article)
      .then((response) => {
        toast.success(response.data.message);
        navigate('/');
      })
      .catch((error) => {
        console.log("Erreur lors de l'ajout de l'article : ", error);
      });
  };

  return (
    <div>
      <Link to="/">
        <Button variant="contained" sx={{ backgroundColor: 'grey' }} startIcon={<ArrowBackIosIcon />}>
          Retour
        </Button>
      </Link>
      <Box sx={{ textAlign: 'center', marginBottom: '20px', marginTop: '20px' }}>
        <Typography variant="h4" gutterBottom >
          Ajouter un article
        </Typography>
      </Box>
      <form onSubmit={handleSubmit}>
        <FormGroup>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel htmlFor="name">Nom d'article</InputLabel>
            <Input name="name" id="name" value={article.name} onChange={inputHandler} placeholder="Name" />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel htmlFor="type">Type d'article</InputLabel>
            <Input name="type" id="type" value={article.type} onChange={inputHandler} placeholder="Type" />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel htmlFor="price">Prix d'article</InputLabel>
            <Input name="price" id="price" value={article.price} onChange={inputHandler} placeholder="Price" type="number" />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel htmlFor="rating">Note d'article</InputLabel>
            <Input name="rating" id="rating" value={article.rating} onChange={inputHandler} placeholder="Rating" type="number" />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <InputLabel htmlFor="warranty_years">Garantie d'article (années)</InputLabel>
            <Input name="warranty_years" id="warranty_years" value={article.warranty_years} onChange={inputHandler} placeholder="Warranty years" type="number" />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }} component="fieldset">
            <FormControlLabel
              control={
                <Checkbox
                  name="available"
                  checked={article.available}
                  onChange={inputHandler}
                  color="primary"
                />
              }
              label="Disponibilité"
              labelPlacement="end"
            />
          </FormControl>
          <FormControl sx={{ marginTop: 2, marginBottom: 2 }}>
            <Button variant="contained" color="success" endIcon={<AddBoxIcon />} type="submit" size="small" sx={{ width: '220px' }}>
              Ajouter un article
            </Button>
          </FormControl>
        </FormGroup>
      </form>
    </div>
  );
};

export default AddArticle;
