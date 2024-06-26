import React from 'react';
import { Link } from 'react-router-dom';

const MainPage = () => {
    return (
        <div className="container">
            <h1>Welcome to the Golf Training App</h1>
            <nav>
                <ul>
                    <li><Link to="/putting-drill">Putting Drill</Link></li>
                    <li><Link to="/track-errors">Track Errors</Link></li>
                </ul>
            </nav>
        </div>
    );
};

export default MainPage;
