import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/components/AddLanguage.css";

function AddLanguage({ updateFeedback }) {
  const [languageName, setLanguageName] = useState("");

  const createLanguage = async () => {
    try {
      const languageRef = doc(db, "languages", languageName.toLowerCase());
      const languageData = {
        title: languageName,
      };
      await setDoc(languageRef, languageData);
      setLanguageName("");
      updateFeedback("Language added successfully!", "success");
    } catch (error) {
      updateFeedback("Error adding language. Please try again.", "error");
    }
  };

  return (
    <div className="add-language-container">
      <h4>Add a new language to the system</h4>
      <input
        type="text"
        placeholder="Language name"
        value={languageName}
        onChange={(e) => setLanguageName(e.target.value)}
        className="language-input"
      />
      <button onClick={createLanguage} className="add-button">
        Add
      </button>
    </div>
  );
}

export default AddLanguage;
