import { useState } from 'react';
import { commentPost, reactToPost } from '../services/post';

export default function Post({ post, token, onRefresh }) {
  const [comment, setComment] = useState('');

  const handleComment = async () => {
    if (!comment.trim()) return;
    await commentPost(post._id, comment, token);
    setComment('');
    if (onRefresh) onRefresh();
  };

  const handleReaction = async (type) => {
    await reactToPost(post._id, type, token);
    if (onRefresh) onRefresh();
  };

  return (
    <div
      style={{
        border: '1px solid #ccc',
        borderRadius: '10px',
        padding: '1.25rem',
        margin: '0 auto 2rem auto',
        backgroundColor: '#fff',
        boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
        maxWidth: '800px',
        width: '100%',
        boxSizing: 'border-box'
      }}
    >
      {/* Usuario */}
      <p style={{ fontWeight: 'bold', marginBottom: '0.5rem' }}>
        {post.user?.name || 'Usuario anónimo'}
      </p>

      {/* Contenido */}
      <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>

      {/* Imagen */}
      {post.image && (
        <img
          src={post.image}
          alt="Post"
          style={{
            width: '100%',
            marginTop: '1rem',
            borderRadius: '6px',
            objectFit: 'cover'
          }}
        />
      )}

      {/* Fecha */}
      <p style={{ fontSize: '0.8rem', color: '#555', marginTop: '0.5rem' }}>
        {new Date(post.createdAt).toLocaleString()}
      </p>

      {/* Reacciones */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        gap: '0.5rem',
        marginTop: '1rem',
        flexWrap: 'wrap'
      }}>
        <button
          style={{ flex: 1, minWidth: '30%', padding: '0.5rem' }}
          onClick={() => handleReaction('like')}
        >
          🔥 {post.reactions?.like?.length || 0}
        </button>
        <button
          style={{ flex: 1, minWidth: '30%', padding: '0.5rem' }}
          onClick={() => handleReaction('love')}
        >
          ❤️ {post.reactions?.love?.length || 0}
        </button>
        <button
          style={{ flex: 1, minWidth: '30%', padding: '0.5rem' }}
          onClick={() => handleReaction('angry')}
        >
          😡 {post.reactions?.angry?.length || 0}
        </button>
      </div>

      {/* Comentarios */}
      <div style={{ marginTop: '1.25rem' }}>
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="Escribe un comentario..."
          style={{
            width: '100%',
            padding: '0.5rem',
            marginBottom: '0.5rem',
            borderRadius: '5px',
            border: '1px solid #ccc'
          }}
        />
        <button
          onClick={handleComment}
          style={{
            width: '100%',
            padding: '0.5rem',
            backgroundColor: '#333',
            color: 'white',
            border: 'none',
            borderRadius: '5px'
          }}
        >
          Comentar
        </button>

        <ul style={{ marginTop: '1rem', paddingLeft: '1rem' }}>
          {post.comments?.map((c, idx) => (
            <li key={idx} style={{ marginBottom: '0.25rem' }}>
              🗨️ {c.comment}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
