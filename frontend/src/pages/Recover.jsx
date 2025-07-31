import { useState } from 'react';

export default function Recover() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSent(false);

    try {
      const res = await fetch('http://localhost:4000/api/auth/recover', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setSent(true);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container">
      <h1>Recuperar contraseña</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Correo institucional"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button type="submit">Enviar instrucciones</button>

        {error && <p className="error">{error}</p>}
        {sent && <p className="success">✔ Revisa tu correo para continuar</p>}

        <p className="link">¿Ya tienes cuenta? <a href="/login">Inicia sesión</a></p>
      </form>
    </div>
  );
}
