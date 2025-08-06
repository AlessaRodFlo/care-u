const Post = require('../models/Post');

// Crear un nuevo post
exports.createPost = async (req, res) => {
  try {
    const { content, image } = req.body;
    const userId = req.user.id;

    if (!content) return res.status(400).json({ message: 'El contenido no puede estar vacío' });

    const newPost = new Post({ user: userId, content, image });
    await newPost.save();

    res.status(201).json({ message: 'Post publicado correctamente', post: newPost });
  } catch (error) {
    res.status(500).json({ message: 'Error al publicar el post', error });
  }
};

// Obtener todos los posts (para el feed)
exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name email') // solo traemos el nombre y correo del usuario
      .sort({ createdAt: -1 }); // orden más reciente primero

    res.status(200).json({ posts });
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener los posts', error });
  }
};

// Agregar un comentario a un post
exports.addComment = async (req, res) => {
  const { comment } = req.body;
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    post.comments.push({ user: userId, comment });
    await post.save();

    res.status(200).json({ message: 'Comentario agregado correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al comentar', error });
  }
};

// Agregar una reacción a un post
exports.addReaction = async (req, res) => {
  const { type } = req.body; // like, love, angry
  const userId = req.user.id;
  const postId = req.params.id;

  try {
    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({ message: 'Post no encontrado' });

    // Eliminar reacciones anteriores del usuario
    Object.keys(post.reactions).forEach((key) => {
      post.reactions[key] = post.reactions[key].filter(
        (uid) => uid.toString() !== userId
      );
    });

    // Agregar la nueva reacción
    post.reactions[type].push(userId);
    await post.save();

    res.status(200).json({ message: `Reacción "${type}" registrada correctamente` });
  } catch (error) {
    res.status(500).json({ message: 'Error al reaccionar', error });
  }
};
