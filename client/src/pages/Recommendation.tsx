import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/Recommendation.css";

interface User {
    name: string;
    profilPic: string;
}

interface Image {
    imageId: number;
    url: string;
}

interface Recommendation {
    recoId: number;
    title: string;
    description: string;
    images: Image[];
    user?: User;
    likes: number;
    dislikes: number;
    userLiked: boolean;
    userDisliked: boolean;
}

const RecommendationsPage: React.FC = () => {
    const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
    const [user, setUser] = useState<User | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchRecommendations();
        checkUserLogin();
    }, []);

    const checkUserLogin = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) return;

            const response = await axios.get<User>("https://localhost:7083/api/User/GetCurrentUser", {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUser(response.data);
        } catch (error) {
            console.error("User not authenticated:", error);
        }
    };

    const fetchRecommendations = async () => {
        try {
            const response = await axios.get<Recommendation[]>("https://localhost:5083/api/Recommendation");
            const recommendationsWithData = response.data.map(reco => ({
                ...reco,
                userLiked: false,
                userDisliked: false
            }));
            setRecommendations(recommendationsWithData);
        } catch (error) {
            console.error("Failed to fetch recommendations:", error);
        }
    };

    const handleLikeDislike = async (recoId: number, action: "Like" | "Dislike") => {
        if (!user) {
            alert("עליך להתחבר כדי לסמן לייקים ודיסלייקים!");
            navigate("/login");
            return;
        }

        try {
            const response = await axios.post<{ likes: number; dislikes: number; likedByUser: boolean; dislikedByUser: boolean }>(
                `https://localhost:7083/api/Recommandation/${action}/${recoId}`,
                {},
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );

            setRecommendations(prev =>
                prev.map(reco =>
                    reco.recoId === recoId
                        ? {
                              ...reco,
                              likes: response.data.likes,
                              dislikes: response.data.dislikes,
                              userLiked: response.data.likedByUser,
                              userDisliked: response.data.dislikedByUser
                          }
                        : reco
                )
            );
        } catch (error) {
            console.error("Error updating like/dislike:", error);
        }
    };

    return (
        <div className="container">
            <h1>Recommendations</h1>
            <div className="grid-container">
                {recommendations.map(reco => (
                    <div key={reco.recoId} className="recommendation-card">
                        <div className="user-info">
                            {reco.user?.profilPic && (
                                <img 
                                    src={`data:image/jpeg;base64,${reco.user.profilPic}`} 
                                    alt={reco.user.name} 
                                    className="profile-pic" 
                                />
                            )}
                            <p>{reco.user?.name}</p>
                        </div>

                        <h2>{reco.title}</h2>
                        <p className="description">{reco.description}</p>

                        <div className="images-container">
                            {reco.images.length > 0 ? (
                                reco.images.map(image => (
                                    <img key={image.imageId} src={`http://localhost:5083${image.url}`} alt="Recommendation" className="recommendation-img" />
                                ))
                            ) : (
                                <p className="no-images">No images available</p>
                            )}
                        </div>

                        <div className="like-section">
                            <button 
                                onClick={() => handleLikeDislike(reco.recoId, "Like")}
                                className={`like-button ${reco.userLiked ? "active" : ""}`}
                            >
                                👍 {reco.likes}
                            </button>
                            <button 
                                onClick={() => handleLikeDislike(reco.recoId, "Dislike")}
                                className={`dislike-button ${reco.userDisliked ? "active" : ""}`}
                            >
                                👎 {reco.dislikes}
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RecommendationsPage;
