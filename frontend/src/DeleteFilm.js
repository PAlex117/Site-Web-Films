import React from 'react';
import axios from 'axios';

function DeleteFilm({ filmId, onDeleted, onCancel }) {
  // Récupère le token pour sécuriser la requête avec JWT
  const token = localStorage.getItem('token');

// Cette fonction est appelée quand on confirme la suppression
  const handleDelete = async () => {
    try {
      // Fais une requête DELETE à l’API pour supprimer le film correspondant à l’ID
      await axios.delete(`http://127.0.0.1:5000/api/films/${filmId}`, {
        headers: {
          Authorization: `Bearer ${token}` // Ajoute le token pour l’authentification
        }
      });
      // Une fois supprimé, appelle la fonction onDeleted pour mettre à jour la liste
      onDeleted();
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
    }
  };

  return (
    <div>
      <p>Confirmer la suppression du film ?</p>
      <button onClick={handleDelete}>✅ Oui, supprimer</button>
      <button onClick={onCancel}>❌ Annuler</button>
    </div>
  );
}

export default DeleteFilm;
