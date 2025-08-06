import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';

import Feed from './pages/Feed.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Recover from './pages/Recover.jsx';
import Reset from './pages/Reset.jsx';

function App() {
  const token = localStorage.getItem('token');

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/recover" element={<Recover />} />
          <Route path="/reset/:token" element={<Reset />} />
          <Route
            path="/feed"
            element={token ? <Feed token={token} /> : <p>Inicia sesión primero</p>}
          />
          <Route path="*" element={<p style={{ textAlign: 'center' }}>404 - Página no encontrada</p>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
