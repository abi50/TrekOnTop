
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RecommendationPage from "./pages/RecommendationPage";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/recommendation/:id" element={<RecommendationPage />} />
      </Routes>
    </Router>
  );
};

export default App;
