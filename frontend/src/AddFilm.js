import React, { useState } from 'react';
import axios from 'axios';

// Ajouter un nouveau film
function AddFilm({ onFilmAdded }) {
  // Stocker les champs du formulaire
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [annee, setAnnee] = useState('');
  const [message, setMessage] = useState('');

  // On récupère le token JWT stocké lors de la connexion
  const token = localStorage.getItem('token');

  // Fonction exécutée à l'envoi du formulaire
  const handleSubmit = async (e) => {
    e.preventDefault(); // Empêche le rechargement de la page
    setMessage('');     // On réinitialise le message

    try {
      // Requête POST pour ajouter le film via l’API
      await axios.post(
        'http://127.0.0.1:5000/api/films',
        { title, author, summary, annee },
        {
          headers: {
            Authorization: `Bearer ${token}`, // On envoie le token pour s’authentifier
          },
        }
      );

      // Si la requête réussit, on vide le formulaire et affiche un message
      setMessage('✅ Film ajouté !');
      setTitle('');
      setAuthor('');
      setSummary('');
      setAnnee('');
      onFilmAdded(); // Recharge la liste des films
    } catch (error) {
      console.error('Erreur lors de l’ajout :', error);
      setMessage("❌ Erreur lors de l'ajout du film.");
    }
  };

  // Affichage du formulaire
  return (
    <form onSubmit={handleSubmit}>
      <h2>➕ Ajouter un film</h2>

      <input
        type="text"
        placeholder="Titre"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
      /><br />

      <input
        type="text"
        placeholder="Réalisateur"
        value={author}
        onChange={(e) => setAuthor(e.target.value)}
        required
      /><br />

      <textarea
        placeholder="Résumé"
        value={summary}
        onChange={(e) => setSummary(e.target.value)}
        rows={3}
      /><br />

      <input
        type="text"
        placeholder="Année de sortie"
        value={annee}
        onChange={(e) => setAnnee(e.target.value)}
      /><br />

      <button type="submit">Ajouter</button>

      {message && <p>{message}</p>}
    </form>
  );
}

export default AddFilm;
