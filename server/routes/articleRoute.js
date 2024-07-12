import express from "express";
import { create, getAllArticles, getArticleById, update, deleteArticle } from "../controller/articleController.js";

const route = express.Router();

// Route pour créer un nouvel article
route.post("/article", create);

// Route pour récupérer tous les articles
route.get("/articles", getAllArticles);

// Route pour récupérer un article par son ID
route.get("/article/:id", getArticleById);

// Route pour mettre à jour un article par son ID
route.put("/update/article/:id", update);

// Route pour supprimer un article par son ID
route.delete("/delete/article/:id", deleteArticle);

export default route;
