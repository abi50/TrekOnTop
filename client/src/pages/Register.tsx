import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import '../styles/Register.css';

const Register: React.FC = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [profilePic, setProfilePic] = useState<File | null>(null);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError('');

        try {
            const token = await registerUser(name, email, password, profilePic);
            if (token) {
                localStorage.setItem('token', token);
                navigate('/profile');
            } else {
                setError('Registration failed. Email may already be in use.');
            }
        } catch (err) {
            setError('Registration failed. Please try again.');
        }
    };

    return (
        <div className="register-container">
            <h2>Register</h2>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input 
                    type="text" 
                    placeholder="Name" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)} 
                    required 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                    required 
                />
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                    required 
                />
                <input 
                    type="file" 
                    accept="image/*"
                    onChange={(e) => {
                        if (e.target.files) {
                            setProfilePic(e.target.files[0]);
                        }
                    }}
                />
                <button type="submit">Register</button>
            </form>
            {error && <p className="error">{error}</p>}
        </div>
    );
};

export default Register;