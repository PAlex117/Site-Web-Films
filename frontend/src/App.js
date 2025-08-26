import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Login';
import Register from './Register';
import FilmList from './FilmList';
import AddFilm from './AddFilm';
import FilmDetail from './FilmDetail';
import './App.css';

function App() {
  // Vérifie si l'utilisateur est connecté en regardant si un token est stocké
  const isLoggedIn = !!localStorage.getItem('token');

 // Définis la fonction pour se déconnecter (supprimer le token et rediriger)
  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              isLoggedIn ? <Navigate to="/films" /> : <Navigate to="/login" />
            }
          />
          <Route
            path="/login"
            element={<Login onLoginSuccess={() => (window.location.href = '/films')} />}
          />
          <Route
            path="/register"
            element={<Register goToLogin={() => (window.location.href = '/login')} />}
          />
          <Route
            path="/films"
            element={
              isLoggedIn ? (
                <>
                  <h2>Bienvenue ! Vous êtes connecté.</h2>
                  <button onClick={handleLogout}>Se déconnecter</button>
                  <AddFilm onFilmAdded={() => window.location.reload()} />
                  <FilmList />
                </>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/films/:id"
            element={
              isLoggedIn ? <FilmDetail /> : <Navigate to="/login" />
            }
          />
          <Route path="*" element={<p>Page introuvable</p>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
