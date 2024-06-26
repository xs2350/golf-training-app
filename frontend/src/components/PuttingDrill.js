import React, { useState, useEffect } from 'react';
import axios from 'axios';

const PuttingDrill = () => {
    const [drills, setDrills] = useState([]);
    const [score, setScore] = useState({});

    useEffect(() => {
        axios.get('http://localhost:5001/putting-drills')
            .then(response => setDrills(response.data))
            .catch(error => console.error('Error fetching the putting drills:', error));
    }, []);

    const handleScoreChange = (e, drillId) => {
        setScore({ ...score, [drillId]: e.target.value });
    };

    const registerScore = (drillId) => {
        alert(`Score registered for ${drills.find(drill => drill.id === drillId).title}: ${score[drillId]}`);
    };

    return (
        <div className="container">
            <h1>Putting Drills</h1>
            {drills.map(drill => (
                <div key={drill.id} style={{ marginBottom: '20px' }}>
                    <h2>{drill.title}</h2>
                    <p>{drill.description}</p>
                    {drill.video_url && <video src={drill.video_url} controls style={{ width: '100%' }} />}
                    <input
                        type="number"
                        placeholder="Enter your score"
                        value={score[drill.id] || ''}
                        onChange={(e) => handleScoreChange(e, drill.id)}
                    />
                    <button onClick={() => registerScore(drill.id)}>Register Score</button>
                </div>
            ))}
        </div>
    );
};

export default PuttingDrill;
