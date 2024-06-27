from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from .models import GolfRound, db, Club, Error, ClubError
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
@main.route("/log-error", methods=["POST", "OPTIONS"])
def log_error():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request successful"}), 200
    error_data = request.get_json()
    print(error_data)
    return jsonify({"message": "Error logged"}), 201


# Get predefined error types
@main.route("/predefined-errors", methods=["GET", "OPTIONS"])
def get_predefined_errors():
    if request.method == "OPTIONS":
        return jsonify({"message": "Preflight request successful"}), 200
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
        print(f"Received round data: {round_data}")  # Debugging log
        new_round = GolfRound(
            course=round_data["course"],
            date=round_data["date"],
            over_par=round_data["overPar"],
            errors=json.dumps(round_data["errors"]),
            user_id=current_user.id,
        )
        db.session.add(new_round)
        db.session.commit()
        print("Round logged successfully")  # Debugging log
        return jsonify({"message": "Round logged successfully"}), 201
    except Exception as e:
        print(f"Error logging round: {str(e)}")  # Debugging log
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


# Get all clubs
@main.route("/clubs", methods=["GET"])
def get_clubs():
    try:
        clubs = Club.query.all()
        club_list = [{"id": club.id, "name": club.name} for club in clubs]
        return jsonify(club_list)
    except Exception as e:
        print(f"Error fetching clubs: {str(e)}")
        return jsonify({"message": "Error fetching clubs"}), 500


# Get error types for a specific club
@main.route("/errors/<int:club_id>", methods=["GET"])
def get_errors_by_club(club_id):
    try:
        club_errors = ClubError.query.filter_by(club_id=club_id).all()
        error_ids = [ce.error_id for ce in club_errors]
        errors = Error.query.filter(Error.id.in_(error_ids)).all()
        error_list = [
            {"id": error.id, "type": error.type, "description": error.description}
            for error in errors
        ]
        return jsonify(error_list)
    except Exception as e:
        print(f"Error fetching errors: {str(e)}")
        return jsonify({"message": "Error fetching errors"}), 500
