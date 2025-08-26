import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.post('http://127.0.0.1:5000/api/register', {
        email,
        password
      });
      setMessage('✅ Compte créé avec succès !');
      setEmail('');
      setPassword('');

      // redirection automatique après 1s
      setTimeout(() => {
        navigate('/login');
      }, 1000);
    } catch (error) {
      console.error('Erreur lors de l’inscription :', error);
      setMessage("❌ Impossible de créer le compte.");
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <h2>Créer un compte</h2>
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
      <button type="submit">S&apos;inscrire</button>
      <br />
      <Link to="/login">← Retour à la connexion</Link>
      {message && <p>{message}</p>}
    </form>
  );
}

export default Register;
