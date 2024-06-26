import React from 'react';
import axios from 'axios';

const RoundSummary = ({ round, onClick, onDelete }) => {
    const handleDelete = async (e) => {
        e.stopPropagation();  // Prevent triggering the onClick event
        const confirmDelete = window.confirm("Are you sure you want to delete this round?");
        if (confirmDelete) {
            try {
                const response = await axios.delete(`http://localhost:5001/rounds/${round.id}`, {
                    withCredentials: true
                });
                if (response.status === 200) {
                    onDelete(round.id);
                } else {
                    console.error('Error deleting the round:', response.data.message);
                }
            } catch (error) {
                console.error('Error deleting the round:', error);
            }
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
        const date = new Date(dateString);
        return date.toLocaleDateString('en-GB', options).replace(/\//g, '-');
    };

    return (
        <div className="card" onClick={onClick}>
            <div className="card-body">
                <h5 className="card-title">{round.course}</h5>
                <p className="card-text">Date: {formatDate(round.date)}</p>
                <div className={`over-par-circle ${round.overPar >= 0 ? 'positive' : 'negative'}`}>
                    {round.overPar >= 0 ? `+${round.overPar}` : round.overPar}
                </div>
                <button className="btn btn-danger" onClick={handleDelete}>Delete Round</button>
            </div>
        </div>
    );
};

export default RoundSummary;
