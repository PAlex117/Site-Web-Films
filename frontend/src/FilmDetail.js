import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

function FilmDetail() {
  // Récupère l'ID du film depuis l'URL
  const { id } = useParams();
 // Crée un état pour stocker les infos du film
  const [film, setFilm] = useState(null);
  // Crée un état pour afficher un message d'erreur si besoin
  const [error, setError] = useState('');
  // Récupère le token d'authentification depuis le stockage local
  const token = localStorage.getItem('token');

// Lance une requête dès que le composant s'affiche ou que l'ID change
  useEffect(() => {
    const fetchFilm = async () => {
      try {
        // Récupère les infos du film via une requête GET sécurisée
        const res = await axios.get(`http://127.0.0.1:5000/api/films/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setFilm(res.data);
      } catch (err) {
        console.error('Erreur :', err);
        setError("❌ Film introuvable ou erreur de chargement.");
      }
    };

    fetchFilm();
  }, [id, token]);

  if (error) {
    return <p>{error}</p>;
  }

  if (!film) {
    return <p>Chargement...</p>;
  }

  return (
    <div>
      <h2>Détail du film</h2>
      <p><strong>Titre :</strong> {film.title}</p>
      <p><strong>Réalisateur :</strong> {film.author}</p>
      <p><strong>Résumé :</strong> {film.summary || 'Aucun résumé'}</p>
      <p><strong>Année de sortie :</strong> {film.annee || 'Non renseigné'}</p>
    </div>
  );
}

export default FilmDetail;
