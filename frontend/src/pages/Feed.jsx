import { useEffect, useState } from 'react';
import PostForm from './PostForm';
import Post from '../components/Post';

export default function Feed({ token }) {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const res = await fetch('http://localhost:4000/api/posts');
      const data = await res.json();
      setPosts(data.posts || []);
    } catch (error) {
      console.error('Error al obtener los posts:', error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div
      style={{
        maxWidth: '100%',
        padding: '1rem',
        margin: '0 auto',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
          width: '100%',
        }}
      >
        <h2 style={{ textAlign: 'center' }}>Feed de la comunidad</h2>

        <PostForm token={token} onPostCreated={fetchPosts} />

        <hr style={{ margin: '2rem 0' }} />

        {posts.length === 0 ? (
          <p style={{ textAlign: 'center' }}>No hay publicaciones todavía.</p>
        ) : (
          posts.map((post) => (
            <Post
              key={post._id}
              post={post}
              token={token}
              onRefresh={fetchPosts}
            />
          ))
        )}
      </div>
    </div>
  );
}
