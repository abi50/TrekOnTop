import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext";
import Home from "./pages/Home";
import Map from "./components/NearbyPlaces";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/UserProfilePage";
import Auth from "./pages/Login";
import AddReco from "./pages/AddRecommendation";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./reduxs/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./reduxs/userSlice";
import EditRecommendation from "./pages/EditRecommendation";
import AboutPage from "./pages/about";
import ContactPage from "./pages/contact";
import PrivacyPolicy from "./pages/privacy";
import AdminCategoriesPage from "./pages/AdminCategoriesPage";
import AdminEmailEditor from "./pages/AdminEmailEditor";
import PlacePage from "./pages/PlacePage";

const App: React.FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://localhost:7083/api/auth/check", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          dispatch(setUser({
            id: res.data.userId,
            name: res.data.name,
            email: res.data.email
          }));
        })
        .catch(() => {
          console.log("user not found");
        });
    }
  }, []);

  return (
    <Provider store={store}>
      <SearchProvider>
        <Router>
          <div className="app-container">
            <Navbar />
            <div className="content">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/map" element={<Map />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/addReco" element={<AddReco />} />
                <Route path="/profilePage" element={<ProfilePage />} />
                <Route path="/editReco" element={<EditRecommendation />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/privacy" element={<PrivacyPolicy />} />
                <Route path="/admin/categories" element={<AdminCategoriesPage />} />
                <Route path="/admin/change-admin-email" element={<AdminEmailEditor />} />
                <Route path="/place/:id" element={<PlacePage />} />

              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </SearchProvider>
    </Provider>
  );
};

export default App;
