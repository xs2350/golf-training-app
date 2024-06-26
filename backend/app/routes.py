from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from .models import GolfRound, db
import json

main = Blueprint("main", __name__)

# In-memory storage for demonstration purposes
errors_db = [
    {"id": 1, "type": "Slice", "description": "Ball curves significantly to the right"},
    {"id": 2, "type": "Hook", "description": "Ball curves significantly to the left"},
    {"id": 3, "type": "Miss", "description": "Missed the ball completely"},
]


# Main page
@main.route("/")
def index():
    return jsonify({"message": "Welcome to the Golf Training App API"})


# Putting drill module
@main.route("/putting-drill")
def putting_drill():
    return jsonify(
        {
            "title": "Putting Drill",
            "description": "Practice putting from various distances.",
            "video_url": "https://example.com/putting_drill_video",
        }
    )


# Error tracking module
@main.route("/track-errors")
def track_errors():
    return jsonify(
        {
            "title": "Track Errors",
            "description": "Track errors made during your golf rounds.",
        }
    )


# Log a new error
@main.route("/log-error", methods=["POST"])
def log_error():
    error_data = request.get_json()
    print(
        error_data
    )  # For now, just print the error data to console (or store it in a file/database later)
    return jsonify({"message": "Error logged"}), 201


# Get error types
@main.route("/errors", methods=["GET"])
def get_errors():
    return jsonify(errors_db)


# Get all rounds for a specific user
@main.route("/rounds", methods=["GET"])
@login_required
def get_rounds():
    try:
        rounds = GolfRound.query.filter_by(user_id=current_user.id).all()
        rounds_list = []
        for round in rounds:
            rounds_list.append(
                {
                    "id": round.id,
                    "course": round.course,
                    "date": round.date,
                    "strokes": round.strokes,
                    "overPar": round.over_par,
                    "errors": json.loads(round.errors),
                }
            )
        return jsonify(rounds_list)
    except Exception as e:
        print(f"Error fetching rounds: {str(e)}")
        return jsonify({"message": "Error fetching rounds"}), 500


# Log a new golf round
@main.route("/log-round", methods=["POST"])
@login_required
def log_round():
    try:
        round_data = request.get_json()
        new_round = GolfRound(
            course=round_data["course"],
            date=round_data["date"],
            strokes=round_data["strokes"],
            over_par=round_data["overPar"],
            errors=json.dumps(round_data["errors"]),
            user_id=current_user.id,
        )
        db.session.add(new_round)
        db.session.commit()
        return jsonify({"message": "Round logged successfully"}), 201
    except Exception as e:
        print(f"Error logging round: {str(e)}")
        return jsonify({"message": "Error logging round"}), 500


# Delete a golf round
@main.route("/rounds/<int:id>", methods=["DELETE"])
@login_required
def delete_round(id):
    round_to_delete = GolfRound.query.get_or_404(id)
    if round_to_delete.user_id != current_user.id:
        return (
            jsonify({"message": "You don't have permission to delete this round"}),
            403,
        )
    db.session.delete(round_to_delete)
    db.session.commit()
    return jsonify({"message": "Round deleted successfully"}), 200
