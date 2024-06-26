from flask import Blueprint, redirect, url_for, request, flash, jsonify
from flask_login import login_user, logout_user, login_required, current_user
from .models import User
from . import db
from werkzeug.security import generate_password_hash, check_password_hash

auth = Blueprint("auth", __name__)


@auth.route("/login", methods=["GET", "POST"])
def login():
    if request.method == "POST":
        email = request.json.get("email")
        password = request.json.get("password")
        user = User.query.filter_by(email=email).first()
        if user and check_password_hash(user.password, password):
            login_user(user)
            return jsonify({"message": "Login successful"})
        else:
            return jsonify({"message": "Login failed. Check your credentials."}), 401
    return jsonify({"message": "Login page"})


@auth.route("/signup", methods=["GET", "POST"])
def signup():
    if request.method == "POST":
        email = request.json.get("email")
        username = request.json.get("username")
        password = request.json.get("password")
        if not email or not username or not password:
            return jsonify({"message": "All fields are required"}), 400
        user = User.query.filter_by(email=email).first()
        if user:
            return jsonify({"message": "Email address already exists"}), 400
        new_user = User(
            email=email,
            username=username,
            password=generate_password_hash(password, method="pbkdf2:sha256"),
        )
        db.session.add(new_user)
        db.session.commit()
        return jsonify({"message": "Signup successful"}), 201
    return jsonify({"message": "Signup page"})


@auth.route("/logout")
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"})
