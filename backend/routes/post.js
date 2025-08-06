const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  addComment,
  addReaction
} = require('../controllers/postController');
const authMiddleware = require('../middleware/auth.js'); // tu middleware de autenticación

// Crear un nuevo post (requiere autenticación)
router.post('/', authMiddleware, createPost);

// Obtener todos los posts (público)
router.get('/', getAllPosts);

// Agregar comentario a un post (requiere autenticación)
router.post('/:id/comment', authMiddleware, addComment);

// Agregar reacción a un post (requiere autenticación)
router.post('/:id/react', authMiddleware, addReaction);

module.exports = router;
