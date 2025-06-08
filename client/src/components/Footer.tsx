import React from "react";
import "../styles/Home.css";

const Footer: React.FC = () => {
  return (
    <footer className="footer">
      <p>© 2024 המלצות למטייל. כל הזכויות שמורות.</p>
      <div className="footer-links">
        <a href="/about">אודות</a>
        <a href="/contact">צור קשר</a>
        <a href="/privacy">מדיניות פרטיות</a>
      </div>
    </footer>
  );
};

export default Footer;
