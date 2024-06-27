from . import db
from flask_login import UserMixin


class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(150), unique=True, nullable=False)
    password = db.Column(db.String(150), nullable=False)
    rounds = db.relationship("GolfRound", backref="user", lazy=True)


class GolfRound(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    course = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(10), nullable=False)
    over_par = db.Column(db.Integer, nullable=False)
    errors = db.Column(db.Text, nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)


class Club(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)


class Error(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    type = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)


class ClubError(db.Model):
    club_id = db.Column(db.Integer, db.ForeignKey("club.id"), primary_key=True)
    error_id = db.Column(db.Integer, db.ForeignKey("error.id"), primary_key=True)
    club = db.relationship(
        Club, backref=db.backref("club_errors", cascade="all, delete-orphan")
    )
    error = db.relationship(
        Error, backref=db.backref("club_errors", cascade="all, delete-orphan")
    )
