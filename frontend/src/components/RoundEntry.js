import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles.css';

const RoundEntry = ({ addRound, goBack }) => {
    const [round, setRound] = useState({ course: '', date: '', overPar: '', errors: [] });
    const [errorLog, setErrorLog] = useState({ searchText: '', errorType: '', club: '' });
    const [errorOptions, setErrorOptions] = useState([]);
    const [errorTypes, setErrorTypes] = useState([]);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5001/errors')
            .then(response => setErrorTypes(response.data))
            .catch(error => console.error('Error fetching the error types:', error));
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setRound({ ...round, [name]: value });
    };

    const handleErrorInputChange = (e) => {
        const { name, value } = e.target;
        setErrorLog({ ...errorLog, [name]: value });

        if (name === 'searchText') {
            const filteredErrors = errorTypes.filter(error => error.type.toLowerCase().includes(value.toLowerCase()));
            setErrorOptions(filteredErrors);
        }
    };

    const logError = () => {
        setRound({ ...round, errors: [...round.errors, errorLog] });
        setErrorLog({ searchText: '', errorType: '', club: '' });
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
        axios.post('http://localhost:5001/log-round', round, {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        })
            .then(response => {
                console.log('Response:', response); // Debugging log
                alert('Round logged successfully!');
                addRound(response.data);  // Ensure the added round includes the database ID
                goBack();  // Navigate back to the round summary page
                setRound({ course: '', date: '', overPar: '', errors: [] });
                setErrorMessage('');  // Clear error message
            })
            .catch(error => {
                console.error('Error logging the round:', error); // Debugging log
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
                max={new Date().toISOString().split("T")[0]}  // Set today as the max date
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
            <input
                type="text"
                name="searchText"
                placeholder="Search errors"
                value={errorLog.searchText}
                onChange={handleErrorInputChange}
            />
            <ul>
                {errorOptions.map((error) => (
                    <li key={error.id} onClick={() => setErrorLog({ ...errorLog, errorType: error.type, searchText: error.type })}>
                        {error.type}
                    </li>
                ))}
            </ul>
            <select
                name="club"
                value={errorLog.club}
                onChange={handleErrorInputChange}
            >
                <option value="">Select club</option>
                <option value="Driver / Woods / Hybrids">Driver / Woods / Hybrids</option>
                <option value="Irons">Irons</option>
                <option value="Wedges">Wedges</option>
                <option value="Putting">Putting</option>
            </select>
            <button onClick={logError}>Log Error</button>
            <h2>Errors Logged</h2>
            <ul>
                {round.errors.map((error, index) => (
                    <li key={index}>{error.errorType} with {error.club}</li>
                ))}
            </ul>
            <button onClick={saveRound}>Save Round</button>
        </div>
    );
};

export default RoundEntry;
