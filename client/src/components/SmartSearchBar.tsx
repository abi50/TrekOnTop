import React, { useState } from "react";
import "../styles/SmartSearchBar.css";

interface SmartSearchProps {
  onSearchParsed: (parsed: {
    category: string;
    distanceKm: number;
    cityName: string;
  }) => void;
}

const exampleSuggestions = [
  "אוכל עד 5 ק\"מ מירושלים",
  "מלונות עד 10 ק\"מ מנתניה",
  "שמורות טבע עד 15 ק\"מ מתל אביב"
];

const SmartSearchBar: React.FC<SmartSearchProps> = ({ onSearchParsed }) => {
  const [input, setInput] = useState("");
  const [error, setError] = useState("");

  const parseQuery = (query: string) => {
    const match = query.match(/^(.+?)\s+עד\s+(\d+)\s*ק.?מ\s+מ(?:־|\s)?(.+)$/);

    if (!match) {
      setError("אנא הזן חיפוש במבנה: קטגוריה עד X ק\"מ מ[עיר]");
      return;
    }

    const category = match[1].trim();
    const distanceKm = parseInt(match[2]);
    const cityName = match[3].trim();

    const parsed = { category, distanceKm, cityName };
    console.log("🔍 parsed:", parsed);

    setError("");
    onSearchParsed(parsed);
    setInput(""); // אם רוצים להשאיר, תוריד את השורה הזו
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    parseQuery(input);
  };

  return (
    <div className="smart-search-container">
      <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px" }}>
        <input
          className="smart-search-input"
          placeholder="לדוגמה: אוכל עד 10 ק״מ מתל אביב"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit" className="search-button-outline">🔍 חפש</button>
      </form>

      {error && <span className="search-error">{error}</span>}

      <div className="smart-search-suggestions">
        <p>דוגמאות:</p>
        <div className="suggestion-list">
          {exampleSuggestions.map((example, idx) => (
            <div
              key={idx}
              onClick={() => {
                setInput(example);
                parseQuery(example);
              }}
              className="card"
            >
              {example}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SmartSearchBar;
