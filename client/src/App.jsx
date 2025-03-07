import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register.jsx';
import Search from './pages/Search';
import Recommendation from './pages/Recommendation';
import Profile from './pages/Profile';
import AddRecommendation from './pages/AddRecommendation';
import Navbar from './components/Navbar';
import PlacePage from './pages/PlacePage.jsx';

const App = () => {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/search" element={<Search />} />
                <Route path="/recommendation" element={<Recommendation />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/add-recommendation" element={<AddRecommendation />} />
                <Route path="/placePage" element={<PlacePage />} />
            </Routes>
        </Router>
    );
};

export default App;
