import React, { useEffect, useState } from 'react';
import axios from 'axios';

function EditFilm({ film, onUpdate, onCancel }) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [summary, setSummary] = useState('');
  const [annee, setAnnee] = useState('');
  const [message, setMessage] = useState('');
  const token = localStorage.getItem('token');

  // Remplit le formulaire avec les données du film une fois reçues
  useEffect(() => {
    if (film) {
      setTitle(film.title || '');
      setAuthor(film.author || '');
      setSummary(film.summary || '');
      setAnnee(film.annee || '');
    }
  }, [film]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setMessage('');

    try {
      await axios.put(
        `http://127.0.0.1:5000/api/films/${film.id}`,
        { title, author, summary, annee },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage('✅ Film modifié !');
      onUpdate();
    } catch (error) {
      console.error('Erreur :', error);
      setMessage("❌ Erreur lors de la modification.");
    }
  };

  return (
    <form onSubmit={handleUpdate}>
      <h3>Modifier le film</h3>
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
        rows={4}
      /><br />
      <input
        type="text"
        placeholder="Année de sortie"
        value={annee}
        onChange={(e) => setAnnee(e.target.value)}
      /><br />
      <button type="submit">💾 Enregistrer</button>
      <button type="button" onClick={onCancel}>❌ Annuler</button>
      {message && <p>{message}</p>}
    </form>
  );
}

export default EditFilm;
