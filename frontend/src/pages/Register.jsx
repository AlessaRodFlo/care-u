import { useState } from 'react';
import { registerUser } from '../services/auth';
import logo from '../assets/logo.png';

export default function Register() {
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '', terms: false
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!form.terms) return setError('Debes aceptar los términos.');
    if (form.password !== form.confirmPassword)
      return setError('Las contraseñas no coinciden');

    try {
      const res = await registerUser({
        name: form.name,
        email: form.email,
        password: form.password
      });
      setSuccess(res.message);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', padding: '1em' }}>
      {/* Logo arriba a la derecha */}
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <img src={logo} alt="CARE-U Logo" style={{ height: '50px' }} />
      </div>

      {/* Contenido del formulario */}
      <div className="container">
        <h1>REGISTRO</h1>
        <form onSubmit={handleSubmit}>
          <input type="text" name="name" placeholder="Nombre completo" onChange={handleChange} />
          <input type="email" name="email" placeholder="Correo institucional" onChange={handleChange} />
          <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} />
          <input type="password" name="confirmPassword" placeholder="Confirmar contraseña" onChange={handleChange} />
          <label>
            <input type="checkbox" name="terms" onChange={handleChange} /> <strong>Acepto</strong> términos y condiciones
          </label>

          {error && <p className="error">{error}</p>}
          {success && <p className="success">{success}</p>}

          <button type="submit">Registrarte</button>
          <p className="link">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
        </form>
      </div>
    </div>
  );
}
