import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { SearchProvider } from "./context/SearchContext"; // הוספת ה-Provider
import Home from "./pages/Home";
import Map from "./components/NearbyPlaces";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProfilePage from "./pages/UserProfilePage";
import Auth from "./pages/Login";
import AddReco from "./pages/AddRecommendation";
import Search from "./pages/Search";
import { Provider, useSelector } from "react-redux";
import store, { RootState } from "./reduxs/store";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setUser } from "./reduxs/userSlice"; // Adjust the path to your user slice or actions file
// import PlacePage from "./pages/RecommendationPage";

const App: React.FC = () => {

  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user.user);

  console.log("app");
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      axios
        .get("https://localhost:7083/api/auth/check", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          console.log("user found");
          console.log(res.data);
          console.log(`${user} befor redux`);
          dispatch(setUser({
            id: res.data.userId,
            name: res.data.name,
            email: res.data.email
          }));
                    console.log(`${user?.id} after redux`);

        })
        .catch(() => {
          console.log("user not found");

          // localStorage.removeItem("token"); // אם הטוקן לא תקין
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
              {/* <Route path="/search" element={<Search />} /> */}

              {/* <Route path="/place/:id" element={<PlacePage />} /> */}
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
