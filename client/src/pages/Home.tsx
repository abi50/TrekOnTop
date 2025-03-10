import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/Home.css";

interface Recommendation {
  recoId: number;
  title: string;
  description: string;
  likes: number;
  dislikes: number;
}

interface HomeProps {
  searchQuery: string;
}

const Home: React.FC<HomeProps> = ({ searchQuery }) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [filteredRecommendations, setFilteredRecommendations] = useState<Recommendation[]>([]);

  useEffect(() => {
    axios.get("https://localhost:7083/api/Recommendation")
      .then(response => {
        setRecommendations(response.data);
        setFilteredRecommendations(response.data);
      })
      .catch(error => console.error("Error fetching recommendations:", error));
  }, []);

  useEffect(() => {
    const query = searchQuery.toLowerCase();
    setFilteredRecommendations(recommendations.filter(rec =>
      rec.title.toLowerCase().includes(query) ||
      rec.description.toLowerCase().includes(query)
    ));
  }, [searchQuery, recommendations]);

  return (
    <div className="home-container">
      <div className="content">
        <h1>המלצות פופולריות</h1>
        <div className="recommendations">
          {filteredRecommendations.length > 0 ? (
            filteredRecommendations.map((rec) => (
              <div key={rec.recoId} className="recommendation-card">
                <h3>{rec.title}</h3>
                <p>{rec.description}</p>
                <div className="likes">
                  👍 {rec.likes} | 👎 {rec.dislikes}
                </div>
              </div>
            ))
          ) : (
            <p>לא נמצאו המלצות</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
