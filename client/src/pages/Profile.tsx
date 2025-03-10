import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, logout } from '../services/api';
import '../styles/Profile.css';
import { User } from '../types';

const Profile: React.FC = () => {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const userData = await getUserProfile();
                setUser(userData);
            } catch (err) {
                setError('Failed to load user data.');
            }
        };
        fetchUserProfile();
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return <p>Loading...</p>;

    return (
        <div className="profile-container">
            <h2>Welcome, {user.name}!</h2>
            <img src={user.profilPic || '/default-avatar.png'} alt="Profile" className="profile-pic" />
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>My Images:</strong> {user.images?.length || 0}</p>
            {/* <p><strong>My Recommendations:</strong> {user.recommendations?.length || 0}</p> */}
            
            <button onClick={handleLogout} className="logout-btn">Logout</button>
        </div>
    );
};

export default Profile;