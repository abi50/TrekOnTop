import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav>
            <ul>
                <li><Link to="/">Home</Link></li>
                <li><Link to="/search">Search</Link></li>
                <li><Link to="/profile">Profile</Link></li>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/register">Register</Link></li>
                <li><Link to="placePage">places</Link></li>
                <li><Link to="/recommendation">recommendations</Link></li>
            </ul>
        </nav>
    );
};

export default Navbar;

