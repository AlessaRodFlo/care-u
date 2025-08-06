import { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // ← AÑADIDO
import { loginUser } from '../services/auth';
import logo from '../assets/logo.png';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // ← AÑADIDO

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const data = await loginUser(form.email, form.password);
      localStorage.setItem('token', data.token);
      setSuccess(`Bienvenido ${data.user.name}`);

      // ← Redireccionar después de éxito
      setTimeout(() => {
        navigate('/feed');
      }, 1000); // espera 1s para que vea el mensaje
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '1em' }}>
      {/* Logo arriba a la derecha */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <img src={logo} alt="CARE-U Logo" style={{ height: '50px' }} />
      </div>

      {/* Contenedor de login */}
      <div className="container">
        <h1>INICIAR SESIÓN</h1>
        <form onSubmit={handleSubmit}>
          <input type="email" name="email" placeholder="Correo institucional" onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />

          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9em', marginBottom: '1em' }}>
            <span>Recordar contraseña</span>
            <a href="/recover">¿Olvidaste la contraseña?</a>
          </div>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <p className="link">¿No tienes cuenta? <a href="/register">Registrarse</a></p>
        </form>
      </div>
    </div>
  );
}
