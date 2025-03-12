
import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Home from "./pages/Home";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PlacePage from "./pages/RecommendationPage";  // דוגמה לעמוד נוסף

const App: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  return (
    <Router>
      <div className="app-container">
        <Navbar onSearch={handleSearch} />
        <div className="content">
          <Routes>
            <Route path="/" element={<Home  />} />
            {/* <Route path="/place/:id" element={<PlacePage searchQuery={searchQuery} />} /> */}
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
};

export default App;
