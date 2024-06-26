import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ErrorTracking from './components/ErrorTracking';
import Login from './components/Login';
import Signup from './components/Signup';

const App = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/track-errors" element={user ? <ErrorTracking /> : <Login onLogin={handleLogin} />} />
          <Route path="/" element={
            <div>
              <h1>Welcome to the Golf Training App</h1>
              <p>Please <a href="/login">login</a> or <a href="/signup">signup</a> to continue.</p>
            </div>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;
