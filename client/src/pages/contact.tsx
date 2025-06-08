import React from 'react';
import '../styles/Page.css';

const ContactPage = () => {
  return (
    <div className="page-container">
      <h1>צור קשר</h1>
      <p>יש לכם שאלה? בקשה? הצעה לשיפור? אנחנו כאן בשבילכם!</p>
      <form className="contact-form">
        <label>
          שם:
          <input type="text" name="name" required />
        </label>
        <label>
          אימייל:
          <input type="email" name="email" required />
        </label>
        <label>
          הודעה:
          <textarea name="message" rows={5} required />
        </label>
        <button type="submit">שלח</button>
      </form>
    </div>
  );
};

export default ContactPage;
