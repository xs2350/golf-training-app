import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoundEntry from './RoundEntry';
import RoundSummary from './RoundSummary';
import '../styles.css';

const ErrorTracking = () => {
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isAddingRound, setIsAddingRound] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5001/rounds', { withCredentials: true })
            .then(response => {
                if (Array.isArray(response.data)) {
                    // Sort the rounds by date in descending order
                    const sortedRounds = response.data.sort((a, b) => new Date(b.date) - new Date(a.date));
                    setRounds(sortedRounds);
                } else {
                    setError('Unexpected response format');
                }
            })
            .catch(error => {
                console.error('Error fetching the rounds:', error);
                setError(error.message);
            });
    }, []);

    const addRound = (newRound) => {
        setRounds([newRound, ...rounds]);
    };

    const deleteRound = (id) => {
        setRounds(rounds.filter(round => round.id !== id));
    };

    if (error) {
        return <div className="alert alert-danger">Error: {error}</div>;
    }

    return (
        <div className="container">
            {isAddingRound ? (
                <RoundEntry
                    addRound={addRound}
                    goBack={() => setIsAddingRound(false)}
                />
            ) : selectedRound ? (
                <div>
                    <h2>Round Details</h2>
                    <p>Course: {selectedRound.course}</p>
                    <p>Date: {new Date(selectedRound.date).toLocaleDateString('en-GB')}</p>
                    <p>Over Par: {selectedRound.overPar}</p>
                    <h2>Errors</h2>
                    <ul>
                        {selectedRound.errors.map((error, index) => (
                            <li key={index}>{error.errorType} with {error.club}</li>
                        ))}
                    </ul>
                    <button onClick={() => setSelectedRound(null)}>Back to Rounds</button>
                </div>
            ) : (
                <div>
                    <h1>All Rounds</h1>
                    <button onClick={() => setIsAddingRound(true)}>Enter New Round</button>
                    <div className="rounds-container">
                        {rounds.map((round, index) => (
                            <RoundSummary
                                key={index}
                                round={round}
                                onClick={() => setSelectedRound(round)}
                                onDelete={deleteRound}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorTracking;
