import React, { useState, useEffect } from 'react';
import axios from 'axios';
import RoundEntry from './RoundEntry';
import RoundSummary from './RoundSummary';
import '../styles.css';

const ErrorTracking = () => {
    const [rounds, setRounds] = useState([]);
    const [selectedRound, setSelectedRound] = useState(null);
    const [isAddingRound, setIsAddingRound] = useState(false);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRounds = async () => {
            try {
                const response = await axios.get('http://localhost:5001/rounds', { withCredentials: true });
                setRounds(response.data || []);
            } catch (error) {
                console.error('Error fetching the rounds:', error);
                setError(error);
            } finally {
                setLoading(false);
            }
        };

        fetchRounds();
    }, []);  // Ensure the dependency array is empty to run the effect only once

    const addRound = (newRound) => {
        setRounds(prevRounds => Array.isArray(prevRounds) ? [...prevRounds, newRound] : [newRound]);
    };

    const deleteRound = async (id) => {
        try {
            const response = await axios.delete(`http://localhost:5001/rounds/${id}`, { withCredentials: true });
            if (response.status === 200) {
                setRounds(prevRounds => prevRounds.filter(round => round.id !== id));
            } else {
                console.error('Error deleting the round:', response.data.message);
            }
        } catch (error) {
            console.error('Error deleting the round:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading rounds: {error.message}</div>;
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
                    <p>Date: {selectedRound.date}</p>
                    <p>Over Par: {selectedRound.overPar}</p>
                    <h2>Errors</h2>
                    <ul>
                        {selectedRound.errors.map((error, index) => (
                            <li key={index}>{error.errorType || error.customError} with {error.club}</li>
                        ))}
                    </ul>
                    <button onClick={() => setSelectedRound(null)}>Back to Rounds</button>
                </div>
            ) : (
                <div>
                    <h1>All Rounds</h1>
                    <button onClick={() => setIsAddingRound(true)}>Enter New Round</button>
                    <div className="rounds-container">
                        {rounds.length > 0 ? (
                            rounds.map((round, index) => (
                                <RoundSummary
                                    key={index}
                                    round={round}
                                    onClick={() => setSelectedRound(round)}
                                    onDelete={deleteRound}
                                />
                            ))
                        ) : (
                            <p>No rounds available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ErrorTracking;
