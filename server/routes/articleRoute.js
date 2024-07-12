import express from "express";
import { create, getAllArticles, getArticleById, update, deleteArticle } from "../controller/articleController.js";

const route = express.Router();

route.post("/article", create);
route.get("/articles", getAllArticles);
route.get("/article/:id", getArticleById);
route.put("/update/article/:id", update);
route.delete("/delete/article/:id", deleteArticle);

export default route;