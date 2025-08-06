// Crear una nueva publicación
export const createPost = async (content, image, token) => {
  const res = await fetch('http://localhost:4000/api/posts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ content, image })
  });

  const data = await res.json();
  return data;
};

// Agregar un comentario a un post
export const commentPost = async (id, comment, token) => {
  const res = await fetch(`http://localhost:4000/api/posts/${id}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ comment })
  });

  const data = await res.json();
  return data;
};

// Agregar una reacción a un post
export const reactToPost = async (id, type, token) => {
  const res = await fetch(`http://localhost:4000/api/posts/${id}/react`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify({ type })
  });

  const data = await res.json();
  return data;
};
