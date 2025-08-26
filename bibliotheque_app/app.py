from routes.films import films_bp
from flask import Flask, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from models import db
from flask_jwt_extended import JWTManager, jwt_required, get_jwt_identity
from routes.auth import auth_bp
from datetime import timedelta

app = Flask(__name__)
CORS(app)

# Clé secrète pour JWT
app.config['JWT_SECRET_KEY'] = 'super-secret-key'

app.config['JWT_ACCESS_TOKEN_EXPIRES'] = False

# Configuration de la base SQLite
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///bibliotheque.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


jwt = JWTManager(app)
db.init_app(app)

@app.route("/")
def home():
    return jsonify({"message": "Bienvenue sur l'API de la bibliotheque"})

# Création automatique des tables si elles n'existent pas
with app.app_context():
    db.create_all()

app.register_blueprint(auth_bp)
app.register_blueprint(films_bp)

@app.route("/test-token")
@jwt_required()
def test_token():
    user_id = get_jwt_identity()
    return jsonify({"user_id": user_id})

if __name__ == "__main__":
    app.run(debug=True)
