"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User
from api.utils import generate_sitemap, APIException, send_password_reset_email
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity


# Generate a token for password reset (using itsdangerous)
from itsdangerous import URLSafeTimedSerializer

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


#Endpoints for forgot and reset password

# Secret key for token generation (make sure to keep it secure)
SECRET_KEY = os.getenv("my_key")
serializer = URLSafeTimedSerializer(SECRET_KEY)

@api.route("/forgot-password", methods=['POST'])
def forgot_password():
    email = request.json.get("email", None)

    # Query the user by email
    user = User.query.filter_by(email=email).first()
    if user:
        try:
            # Generate a token for password reset (token expires after 15 minutes)
            token = serializer.dumps(user.id, salt='password-reset')
            
            # Send password reset email
            if send_password_reset_email(user.email, token):
                return jsonify({"msg": "If an account with this email exists, a password reset email has been sent"}), 200
            else:
                # Failed to send email
                error_message = "Failed to send password reset email. Please try again later."
                return jsonify({"msg": error_message}), 500
        except Exception as e:
            # Log the error
            print(f"Error sending password reset email: {e}")
            
            # Return detailed error message with specific error details
            error_message = "An error occurred while sending the password reset email. Please try again later."
            return jsonify({
                "msg": error_message,
                "error": str(e)  # Include the specific error message in the response
            }), 500
    else:
        # No user found with the provided email
        return jsonify({"msg": "No user found with this email. Please check your email address and try again."}), 404

# Test endpoint
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200
