import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Envoie l'email et le mot de passe à l'API
      const res = await axios.post('http://127.0.0.1:5000/api/login', {
        email,
        password,
      });
      // Si la connexion réussit, stocke le token JWT
      const token = res.data.token;
      localStorage.setItem('token', token);
      onLoginSuccess();
    } catch (err) {
      setError('Identifiants invalides');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Connexion</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      /><br />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      /><br />
      <button type="submit">Se connecter</button>
      <br />
      <Link to="/register">Créer un compte</Link>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </form>
  );
}

export default Login;
