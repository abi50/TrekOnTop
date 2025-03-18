import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext"; // הוספת ה-Provider
import Home from "./pages/Home";
import Map from "./components/NearbyPlaces";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Auth from "./pages/Login";
// import PlacePage from "./pages/RecommendationPage";

const App: React.FC = () => {
  return (
    <SearchProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <div className="content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/auth" element={<Auth />} />
              {/* <Route path="/place/:id" element={<PlacePage />} /> */}
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </SearchProvider>
  );
};

export default App;
