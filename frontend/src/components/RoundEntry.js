import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const RoundEntry = ({ addRound, goBack }) => {
    const [round, setRound] = useState({ course: '', date: '', overPar: '', errors: [] });
    const [errorLog, setErrorLog] = useState({ errorType: '', club: '', customError: '' });
    const [errorTypes, setErrorTypes] = useState([]);
    const [clubOptions, setClubOptions] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        // Fetch clubs from the backend
        axios.get('http://localhost:5001/clubs')
            .then(response => setClubOptions(response.data))
            .catch(error => console.error('Error fetching the clubs:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRound({ ...round, [name]: value });
    };

    const handleErrorInputChange = (e) => {
        const { name, value } = e.target;
        setErrorLog({ ...errorLog, [name]: value });

        if (name === 'club') {
            // Fetch errors based on selected club
            axios.get(`http://localhost:5001/errors/${value}`)
                .then(response => setErrorTypes(response.data))
                .catch(error => console.error('Error fetching the error types:', error));
            setErrorLog({ ...errorLog, errorType: '', customError: '', club: value });
        }
    };

    const logError = () => {
        const selectedError = errorTypes.find(error => error.id == errorLog.errorType);
        const selectedClub = clubOptions.find(club => club.id == errorLog.club);
        setRound({ ...round, errors: [...round.errors, { errorType: selectedError ? selectedError.type : errorLog.customError, club: selectedClub ? selectedClub.name : 'Unknown' }] });
        setErrorLog({ errorType: '', club: '', customError: '' });
    };

    const isValidDate = (dateString) => {
        const date = new Date(dateString);
        const today = new Date();
        const minDate = new Date('1900-01-01');
        return date >= minDate && date <= today;
    };

    const saveRound = () => {
        if (!round.course) {
            setErrorMessage('Please enter the golf course.');
            return;
        }

        if (!round.date || !isValidDate(round.date)) {
            setErrorMessage('Please enter a valid date from 1900 until today.');
            return;
        }

        if (round.overPar === '' || isNaN(round.overPar)) {
            setErrorMessage('Please enter a valid "Over Par" value.');
            return;
        }

        console.log('Saving round:', round); // Debugging log
        setLoading(true); // Set loading state to true
        axios.post('http://localhost:5001/log-round', round, { withCredentials: true })
            .then(response => {
                console.log('Response:', response); // Debugging log
                alert('Round logged successfully!');
                addRound(round); // Ensure the added round includes the database ID
                goBack(); // Navigate back to the round summary page
                setRound({ course: '', date: '', overPar: '', errors: [] });
                setErrorMessage(''); // Clear error message
            })
            .catch(error => {
                console.error('Error logging the round:', error); // Debugging log
                setErrorMessage('Error logging the round. Please try again.');
            })
            .finally(() => {
                setLoading(false); // Set loading state to false
            });
    };

    return (
        <div className="container">
            <h1>Enter Golf Round</h1>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
            <input
                type="text"
                name="course"
                placeholder="Golf course"
                value={round.course}
                onChange={handleInputChange}
                required
            />
            <input
                type="date"
                name="date"
                placeholder="Date"
                value={round.date}
                onChange={handleInputChange}
                max={new Date().toISOString().split("T")[0]} // Set today as the max date
                required
            />
            <input
                type="number"
                name="overPar"
                placeholder="Over par"
                value={round.overPar}
                onChange={handleInputChange}
                required
            />
            <h2>Log Errors</h2>
            <select
                name="club"
                value={errorLog.club}
                onChange={handleErrorInputChange}
                required
            >
                <option value="">Select club</option>
                {clubOptions.map((club) => (
                    <option key={club.id} value={club.id}>{club.name}</option>
                ))}
            </select>
            <select
                name="errorType"
                value={errorLog.errorType}
                onChange={handleErrorInputChange}
                required
            >
                <option value="">Select error</option>
                {errorTypes.map((error) => (
                    <option key={error.id} value={error.id}>{error.type}</option>
                ))}
                <option value="Other">Other</option>
            </select>
            {errorLog.errorType === "Other" && (
                <input
                    type="text"
                    name="customError"
                    placeholder="Describe the error"
                    value={errorLog.customError}
                    onChange={handleErrorInputChange}
                    required
                />
            )}
            <button onClick={logError}>Log Error</button>
            <h2>Errors Logged</h2>
            <ul>
                {round.errors.map((error, index) => (
                    <li key={index}>{error.errorType} with {error.club}</li>
                ))}
            </ul>
            <button onClick={saveRound} disabled={loading}>
                {loading ? 'Logging...' : 'Save Round'}
            </button>
        </div>
    );
};

export default RoundEntry;
