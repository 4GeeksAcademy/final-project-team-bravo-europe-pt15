"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException
from flask_cors import CORS
from flask_jwt_extended import JWTManager, create_access_token, jwt_required, get_jwt_identity


api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

@api.route("/login", methods=['POST'])
def create_login_token():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    # Query your database for username and password
    user = User.query.filter_by(email=email, password=password).first()

    if user is None:
        # The user was not found on the database
        return jsonify({"msg": "Bad email or password"}), 401
    
    # Create a new token with the user id inside
    access_token = create_access_token(identity=user.id)
    return jsonify({ "token": access_token, "user_id": user.id }), 200


@api.route('/signup', methods=['POST'])
def register_user():
    email = request.json.get("email", None)
    password = request.json.get("password", None)

    if email is None:
        return jsonify({"msg": "Email can't be empty"}), 400

    if password is None:
        return jsonify({"msg": "Password can't be empty"}), 400

    # Check if user with the same email already exists
    existing_user = User.query.filter_by(email=email).first()
    if existing_user:
        return jsonify({"msg": "User with this email already exists"}), 400

    # If user doesn't exist, create a new user
    user = User(
        email=email,
        password=password,
        is_active=True
    )

    db.session.add(user)
    db.session.commit()

    return jsonify({"msg": "New User created"}), 201


@api.route('/user/<int:user_id>', methods=['DELETE'])
@jwt_required()  # Ensure that only authenticated users can delete a user
def delete_user(user_id):
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()

    # Check if the current user is trying to delete their own account
    if current_user_id != user_id:
        return jsonify({"msg": "You are not authorized to delete this user"}), 403

    # Query the user to be deleted
    user_to_delete = User.query.get(user_id)

    # Check if the user exists
    if user_to_delete is None:
        return jsonify({"msg": "User not found"}), 404

    # Delete the user
    db.session.delete(user_to_delete)
    db.session.commit()

    return jsonify({"msg": "User deleted successfully"}), 200





# Protect a route with jwt_required, which will kick out requests without a valid JWT
@api.route("/validate", methods=["GET"])
@jwt_required()
def validate():
    # Access the identity of the current user with get_jwt_identity
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    
    return jsonify({"id": user.id, "email": user.email }), 200



# Test endpoint
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
