import { useState, ChangeEvent, FormEvent } from "react";
import "../styles/Auth.css";

import "../styles/Home.css";

interface FormData {
  name: string;
  email: string;
  password: string;
  file: File | null;
}

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
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
    const formDataToSend = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      if (value !== null) {
        formDataToSend.append(key, value as string | Blob);
      }
    });

      const endpoint = isLogin
      ? `https://localhost:7083/api/auth/login?email=${encodeURIComponent(formData.email)}&password=${encodeURIComponent(formData.password)}`
      : "https://localhost:7083/api/auth/register";
    
    const response = await fetch(endpoint, {
      method: "POST",
      body: isLogin ? null : formDataToSend,
    });
  

    if (!response.ok) {
      alert("Error: " + (await response.text()));
    } else {
      const token = await response.text();
      localStorage.setItem('token', token);
      alert("Success!");
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
