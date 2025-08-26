import React, { useEffect, useState } from 'react';
import axios from 'axios';
import EditFilm from './EditFilm';
import DeleteFilm from './DeleteFilm';
import { Link } from 'react-router-dom';

function FilmList() {
  // Crée un état pour stocker la liste des films récupérés depuis l'API
  const [films, setFilms] = useState([]);
   // Garde en mémoire le film actuellement en cours de modification
  const [editingFilm, setEditingFilm] = useState(null);
  // Garde en mémoire l'ID du film que je souhaite supprimer
  const [deletingFilmId, setDeletingFilmId] = useState(null);
  // Champ de recherche
  const [searchTerm, setSearchTerm] = useState('');
  // Récupère le token pour sécuriser les requêtes vers l’API
  const token = localStorage.getItem('token');

// Cette fonction permet de charger les films depuis l’API
  const fetchFilms = () => {
    const url = searchTerm
      ? `http://127.0.0.1:5000/api/films/search?q=${encodeURIComponent(searchTerm)}`
      : 'http://127.0.0.1:5000/api/films';

    axios
      .get(url, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setFilms(response.data.films);
      })
      .catch((error) => {
        console.error('Erreur lors du chargement des films :', error);
      });
  };

  const handleEditClick = async (filmId) => {
    try {
      const res = await axios.get(`http://127.0.0.1:5000/api/films/${filmId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setEditingFilm(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des détails du film :", err);
    }
  };

  useEffect(() => {
    fetchFilms();
  }, []);

  return (
    <div>
      <h2> Vos films</h2>

      <input
        type="text"
        placeholder="🔍 Rechercher un film..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        onKeyUp={fetchFilms}
        style={{ marginBottom: '1rem', padding: '5px', width: '100%' }}
      />

      {editingFilm && (
        <EditFilm
          film={editingFilm}
          onUpdate={() => {
            setEditingFilm(null);
            fetchFilms();
          }}
          onCancel={() => setEditingFilm(null)}
        />
      )}

      {deletingFilmId && (
        <DeleteFilm
          filmId={deletingFilmId}
          onDeleted={() => {
            setDeletingFilmId(null);
            fetchFilms();
          }}
          onCancel={() => setDeletingFilmId(null)}
        />
      )}

      {!editingFilm && !deletingFilmId && (
        <ul>
          {films.map((film) => (
            <li key={film.id}>
              <strong>{film.title}</strong> — {film.author}
              {' '}
              <Link to={`/films/${film.id}`}>📘 Détails</Link>
              <button onClick={() => handleEditClick(film.id)}>✏️ Modifier</button>
              <button onClick={() => setDeletingFilmId(film.id)}>🗑 Supprimer</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default FilmList;
