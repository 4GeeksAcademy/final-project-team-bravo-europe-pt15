from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    username = db.Column(db.String(80), unique=False, nullable=True)  # Add the username field

    def __repr__(self):
        return f'<User {self.email}>'  # You can add {self.username} if you want to display it

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username  # Include username in serialization
            # do not serialize the password, it's a security breach
        }
