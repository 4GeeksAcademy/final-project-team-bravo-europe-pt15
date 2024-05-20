from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class TransformedImage(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.String(255), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)

    def serialize(self):
        return {
            "id": self.id,
            "url": self.url, 
            "user_id": self.user_id,
        }


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    username = db.Column(db.String(80), unique=False, nullable=True)
    credits = db.Column(db.Integer, nullable=False, default=10)  # Add credits field
    transformed_images = db.relationship('TransformedImage', backref='user', lazy=True)

    def __repr__(self):
        return f'<User {self.email}>'

    def serialize(self):
        return {
            "id": self.id,
            "email": self.email,
            "username": self.username,
            "credits": self.credits,  # Include credits in serialization
            "transformed_images": [image.url for image in self.transformed_images]  # Include transformed images in serialization
        }
