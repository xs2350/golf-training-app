import React from 'react';
import '../styles.css';

const Home = () => {
    return (
        <div className="home-background">
            <div className="home-container">
                <h1>Welcome to the Golf Training App</h1>
                <p>Please <a href="/login">login</a> or <a href="/signup">signup</a> to continue.</p>
            </div>
        </div>
    );
};

export default Home;
