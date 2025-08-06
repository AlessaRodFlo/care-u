import { useState } from 'react';
import { createPost } from '../services/post';

export default function PostForm({ token, onPostCreated }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    await createPost({ content, image }, token);
    setContent('');
    setImage('');
    if (onPostCreated) onPostCreated(); // refresca feed
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '1.25rem',
        marginBottom: '2rem',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%',
        margin: '0 auto',
        boxSizing: 'border-box'
      }}
    >
      <h3 style={{ textAlign: 'center', marginBottom: '1rem' }}>Publicar Post</h3>

      <textarea
        placeholder="¿Qué estás pensando?"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        required
        style={{
          width: '100%',
          padding: '0.5rem',
          minHeight: '80px',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '1rem',
          resize: 'vertical'
        }}
      />

      <input
        type="text"
        placeholder="URL de imagen (opcional)"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        style={{
          width: '100%',
          padding: '0.5rem',
          borderRadius: '5px',
          border: '1px solid #ccc',
          marginBottom: '1rem'
        }}
      />

      <button
        type="submit"
        style={{
          width: '100%',
          padding: '0.75rem',
          backgroundColor: '#333',
          color: '#fff',
          border: 'none',
          borderRadius: '5px',
          fontWeight: 'bold'
        }}
      >
        Publicar
      </button>
    </form>
  );
}
