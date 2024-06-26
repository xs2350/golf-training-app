from . import db
from flask_login import UserMixin


class User(db.Model, UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(150), unique=True, nullable=False)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    rounds = db.relationship("GolfRound", backref="user", lazy=True)


class GolfRound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(80), nullable=False)
    date = db.Column(db.String(80), nullable=False)
    strokes = db.Column(db.Integer, nullable=False)
    over_par = db.Column(db.Integer, nullable=False)
    errors = db.Column(db.Text, nullable=True)  # Storing errors as JSON strings
    user_id = db.Column(
        db.Integer, db.ForeignKey("user.id", name="fk_user_id"), nullable=False
    )

    def __repr__(self):
        return f"<GolfRound {self.course} {self.date}>"
