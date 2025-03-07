import axios from 'axios';

const API_BASE_URL = 'http://localhost:5083/api';

export const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// פונקציה לשליחת בקשות לשרת
export const fetchImages = async () => {
    try {
        const response = await api.get('/image');
        return response.data;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [];
    }
};

export const loginUser = async (email, password) => {
    try {
        console.log('Sending login request:', { email, password });

        const response = await api.post(`/auth/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`);
        console.log('Server response:', response.data);
        return response.data; // מחזיר את ה- JWT Token
    } catch (error) {
        console.error('Login failed:', error.response?.data || error.message);
        return null;
    }
};

export const registerUser = async (name, email, password, profilePic) => {
    try {
        console.log('Sending register request:', { name, email, password, profilePic });

        const formData = new FormData();
        formData.append("Name", name);
        formData.append("Email", email);
        formData.append("Password", password);
        if (profilePic) {
            formData.append("ProfilePic", profilePic);
        }

        const response = await api.post(
            `/auth/register?name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`, 
            formData, 
            {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            }
        );

        console.log('Server response:', response.data);
        return response.data; // מחזיר את ה-JWT או הודעה
    } catch (error) {
        console.error('Registration failed:', error.response?.data || error.message);
        return null;
    }
};




export const getUserProfile = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) throw new Error('No token found');

        const response = await api.get('/user/me', {
            headers: { Authorization: `Bearer ${token}` }
        });

        return response.data;
    } catch (error) {
        console.error('Failed to fetch user profile:', error.response?.data || error.message);
        return null;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
};

export const deleteUser = async (userId) => {
    try {
        const token = localStorage.getItem("token");
        if (!token) {
            throw new Error("No authentication token found.");
        }

        const response = await api.delete(`/User/${userId}`, {
            headers: { Authorization: `Bearer ${token}` }
        });

        console.log('User deleted:', response.data);
        return response.data;
    } catch (error) {
        console.error('Delete failed:', error.response?.data || error.message);
        return null;
    }
};
