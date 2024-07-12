import Article from "../model/articleModel.js";
import { io } from "../index.js"; // Importer io depuis index.js

export const create = async (req, res) => {
  try {
    const newArticle = new Article(req.body);
    const { name } = newArticle;

    const articleExists = await Article.findOne({ name });
    if (articleExists) {
      return res.status(400).json({ errorMessage: "Article existe déjà." });
    }
    const savedData = await newArticle.save();
    io.emit('article_created', savedData); // Émettre l'événement article_created
    res.status(200).json({ message: "Article créé avec succées." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getAllArticles = async (req, res) => {
  try {
    const articleData = await Article.find();
    if (!articleData) {
      return res.status(404).json({ errorMessage: "Aucun article trouvé." });
    }
    res.status(200).json(articleData);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const getArticleById = async (req, res) => {
  try {
    const id = req.params.id;
    const articleExists = await Article.findById(id);
    if (!articleExists) {
      return res.status(404).json({ errorMessage: "Article introuvable." });
    }
    res.status(200).json(articleExists);
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const update = async (req, res) => {
  try {
    const id = req.params.id;
    const articleExists = await Article.findById(id);
    if (!articleExists) {
      return res.status(404).json({ errorMessage: "Article introuvable." });
    }
    const updatedData = await Article.findByIdAndUpdate(id, req.body, { new: true });
    io.emit('article_updated', updatedData); // Émettre l'événement article_updated
    res.status(200).json({ message: "Article modifié avec succées." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};

export const deleteArticle = async (req, res) => {
  try {
    const id = req.params.id;
    const articleExists = await Article.findById(id);
    if (!articleExists) {
      return res.status(404).json({ errorMessage: "Article introuvable." });
    }
    await Article.findByIdAndDelete(id);
    io.emit('article_deleted', id); // Émettre l'événement article_deleted
    res.status(200).json({ message: "Article supprimé avec succés." });
  } catch (error) {
    res.status(500).json({ errorMessage: error.message });
  }
};
