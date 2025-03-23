import { useState, ChangeEvent, FormEvent } from "react";
import "../styles/Auth.css";
import "../styles/Home.css";
import { useDispatch } from "react-redux";
import { login, setUser } from "../reduxs/userSlice"; 
import axios from "axios";
import { useNavigate } from 'react-router-dom';

interface FormData {
  name: string;
  email: string;
  password: string;
  file: File | null;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    password: "",
    file: null,
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({ ...prevData, file: files[0] }));
    } else {
      setFormData((prevData) => ({ ...prevData, file: null }));
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      let token = "";
      const formDataToSend = new FormData();

      // שדות בסיסיים - תמיד נשלחים
      formDataToSend.append("Email", formData.email);
      formDataToSend.append("Password", formData.password);
      console.log("Email:", formData.email);
      console.log("Password:", formData.password);

      if (isLogin) {
        // ✅ התחברות עם FormData
        const response = await axios.post(
          "https://localhost:7083/api/auth/login",
          formDataToSend
        );
        token = response.data;
      } else {
        // ✅ הרשמה עם FormData כולל שם וקובץ
        formDataToSend.append("Name", formData.name);
        console.log("Name:", formData.name);
        if (formData.file) {
          formDataToSend.append("File", formData.file);
          console.log("File:", formData.file);
        }
        console.log("formDataToSend:", formDataToSend);
        const response = await axios.post(
          "https://localhost:7083/api/auth/register",
          formDataToSend
         
        );
        token = response.data;
      }

      localStorage.setItem("token", token);
      console.log("token saved in local storage", token);

      const userResponse = await axios.get("https://localhost:7083/api/auth/check", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const userData = userResponse.data;
      console.log("userData:", userData); 
      dispatch(login({
        id: userData.userId,
        name: userData.name,
        email: userData.email,
        token: token,
      }));
      dispatch(setUser({
        id: userData.userId,
        name: userData.name,
        email: userData.email,
      }));
      alert("Success!");
      const redirect = localStorage.getItem("redirectAfterLogin");
      if (redirect) {
        localStorage.removeItem("redirectAfterLogin");
        navigate(redirect);
      } else {
        navigate("/");
      }

    } catch (error) {
      console.error("Error during login/register:", error);
      if (axios.isAxiosError(error)) {
        alert("Error: " + (error.response?.data?.message || error.message));
      } else {
        alert("An unexpected error occurred: " + String(error));
      }
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2 className="auth-title">{isLogin ? "Login" : "Register"}</h2>
        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleChange}
              className="auth-input"
            />
          )}
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="auth-input"
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="auth-input"
            required
          />
          {!isLogin && (
            <input
              type="file"
              name="file"
              onChange={handleFileChange}
              className="auth-input"
            />
          )}
          <button type="submit" className="auth-button">
            {isLogin ? "Login" : "Register"}
          </button>
        </form>
        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button className="auth-link" onClick={() => setIsLogin(!isLogin)}>
            {isLogin ? "Register" : "Login"}
          </button>
        </p>
      </div>
    </div>
  );
}
