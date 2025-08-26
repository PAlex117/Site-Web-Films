from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models import db, Film

films_bp = Blueprint('films', __name__)

# Ajouter un film
@films_bp.route('/api/films', methods=['POST'])
@jwt_required()
def add_film():
    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    summary = data.get('summary')  
    annee = data.get('annee')       

    if not title or not author:
        return jsonify({"error": "Titre et auteur obligatoires"}), 400

    user_id = get_jwt_identity()
    new_film = Film(
        title=title,
        author=author,
        summary=summary,
        annee=annee,
        user_id=user_id
    )
    db.session.add(new_film)
    db.session.commit()

    return jsonify({"message": "Film ajouté avec succès"}), 201

# Récupérer les films de l'utilisateur connecté
@films_bp.route('/api/films', methods=['GET'])
@jwt_required()
def get_films():
    user_id = get_jwt_identity()
    films = Film.query.filter_by(user_id=int(user_id)).all()

    films_list = [{
        "id": film.id,
        "title": film.title,
        "author": film.author
    } for film in films]

    return jsonify({"films": films_list}), 200

# Récupérer un film par son ID
@films_bp.route('/api/films/<int:film_id>', methods=['GET'])
@jwt_required()
def get_film(film_id):
    user_id = get_jwt_identity()
    film = Film.query.filter_by(id=film_id, user_id=user_id).first()

    if not film:
        return jsonify({"error": "film introuvable"}), 404

    return jsonify({
        "id": film.id,
        "title": film.title,
        "author": film.author,
        "summary": film.summary,
        "annee": film.annee
    }), 200

# Modifier un film
@films_bp.route('/api/films/<int:film_id>', methods=['PUT'])
@jwt_required()
def update_film(film_id):
    user_id = get_jwt_identity()
    film = Film.query.filter_by(id=film_id, user_id=user_id).first()

    if not film:
        return jsonify({"error": "Film introuvable"}), 404

    data = request.get_json()
    title = data.get('title')
    author = data.get('author')
    summary = data.get('summary')
    annee = data.get('annee')

    if not title or not author:
        return jsonify({"error": "Titre et auteur obligatoires"}), 400

    film.title = title
    film.author = author
    film.summary = summary
    film.annee = annee
    db.session.commit()

    return jsonify({"message": "Film modifié avec succès"}), 200

# Supprimer un film
@films_bp.route('/api/films/<int:film_id>', methods=['DELETE'])
@jwt_required()
def delete_film(film_id):
    user_id = get_jwt_identity()
    film = Film.query.filter_by(id=film_id, user_id=user_id).first()

    if not film:
        return jsonify({"error": "Film introuvable"}), 404

    db.session.delete(film)
    db.session.commit()

    return jsonify({"message": "Film supprimé avec succès"}), 200

# Rechercher des films par titre ou auteur
@films_bp.route('/api/films/search', methods=['GET'])
@jwt_required()
def search_films():
    user_id = get_jwt_identity()
    query = request.args.get('q', '')

    films = Film.query.filter(
        Film.user_id == user_id,
        (Film.title.ilike(f"%{query}%") | Film.author.ilike(f"%{query}%"))
    ).all()

    result = [{
        "id": film.id,
        "title": film.title,
        "author": film.author
    } for film in films]

    return jsonify({"films": result}), 200
