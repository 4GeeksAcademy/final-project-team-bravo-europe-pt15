"""
This module takes care of starting the API Server, Loading the DB and Adding the endpoints
"""
import os
from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, TransformedImage
from api.utils import generate_sitemap, APIException, send_password_reset_email
from flask_cors import CORS
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from flask_mail import Message, Mail

mail = Mail()


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
    username = request.json.get("username", None)  # Get the username from the request

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
        is_active=True,
        username=username  # Set the username field
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

#Fetch username from database User
@api.route('/user', methods=['GET'])
@jwt_required()
def get_user():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify(user.serialize()), 200


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
            # Generate a token for password reset
            token = serializer.dumps(user.id, salt='password-reset')
                        
            # Send password reset email
            if send_password_reset_email(user.email, token):
                return jsonify({"msg": "Link for reseting the password is sent to email: " + user.email}), 200
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


@api.route("/check-token/<token>", methods=['GET'])
def validate_token(token):
    try:
        # Decrypt the token to get the user ID and set timout for token
        user_id = serializer.loads(token, salt='password-reset', max_age=600)  # max_age in seconds (15 minutes)

        # Query the user by ID
        user = User.query.get(user_id)
        if user:
            return jsonify({ "success": True }), 200
        else:
            return jsonify({"success": False}), 400
    except Exception as e:
        print(f"Error resetting password: {e}")
        return jsonify({"success": False}), 400



@api.route("/reset-password/<token>", methods=['POST'])
def reset_password(token):
    try:
        # Decrypt the token to get the user ID and set timout for token
        user_id = serializer.loads(token, salt='password-reset', max_age=600)  # max_age in seconds (15 minutes)

        # Get the new password from the request data
        new_password = request.json.get("new_password")

        # Query the user by ID
        user = User.query.get(user_id)
        if user:
            # Update user's password
            user.password = new_password
            db.session.commit()

            # Send Email to User saying Password Resetted Successfully
            
            return jsonify({"msg": "Password reset successfully"}), 200
        else:
            return jsonify({"msg": "Invalid token"}), 400
    except Exception as e:
        print(f"Error resetting password: {e}")
        return jsonify({"msg": "Invalid or expired token"}), 400


# Endpoint for Get in contact

@api.route("/send-contact-form", methods=['POST'])
def send_contact_form():
    data = request.get_json()
    email = data.get("email", "")
    name = data.get("name", "")
    message = data.get("message", "")
    
    try:
        msg = Message(
            subject='New Contact Form Submission', 
            sender=os.getenv("my_email"), 
            recipients=[os.getenv('CONTACT_MAIL')]
        )
        msg.body = f"Name: {name}\nEmail: {email}\nMessage: {message}"
        
        mail.send(msg)
        return jsonify({"msg": "Contact form data sent successfully"}), 200
    except Exception as e:
        error_message = f"Failed to send contact form data: {str(e)}"
        print(error_message)  # Log the error for debugging
        return jsonify({"msg": error_message}), 500


# Endpoints for credits



@api.route('/user/credits', methods=['GET'])
@jwt_required()
def get_user_credits():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    return jsonify({"credits": user.credits}), 200

@api.route('/user/credits', methods=['PUT'])
@jwt_required()
def update_user_credits():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    data = request.get_json()
    user.credits = data.get('credits', user.credits)
    db.session.commit()
    return jsonify({"credits": user.credits}), 200


#Endpoints for Transformed images

@api.route('/user/transformed-images', methods=['GET'])
@jwt_required()
def get_transformed_images():
    current_user_id = get_jwt_identity()
    user = User.query.get(current_user_id)
    if user:
        images = TransformedImage.query.filter_by(user_id=current_user_id).all()
        transformed_images = [image.url for image in images]
        return jsonify({"transformed_images": transformed_images}), 200
    else:
        return jsonify({"error": "User not found"}), 404
    
@api.route('/user/transformed-images', methods=['DELETE'])
@jwt_required()
def delete_transformed_image():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    url = data['url']
    
    # Query the image to be deleted
    image_to_delete = TransformedImage.query.filter_by(user_id=current_user_id, url=url).first()
    
    if image_to_delete:
        db.session.delete(image_to_delete)
        db.session.commit()
        return jsonify({"message": "Image deleted"}), 200
    else:
        return jsonify({"error": "Image not found"}), 404


@api.route('/user/transformed-images', methods=['POST'])
@jwt_required()
def add_transformed_image():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    url = data['url']
    user = User.query.get(current_user_id)
    if user:
        new_image = TransformedImage(url=url, user_id=current_user_id)
        db.session.add(new_image)
        db.session.commit()
        return jsonify({"message": "Image added"}), 201
    else:
        return jsonify({"error": "User not found"}), 404
    
        

# Test endpoint
@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():

    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }

    return jsonify(response_body), 200