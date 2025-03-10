
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import RecommendationPage from "./pages/RecommendationPage";
import Home from "./pages/Home";

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
};

export default App;
