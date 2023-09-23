import React, { useEffect, useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/components/AddLanguage.css"; // Import your CSS file

function AddLanguage() {
  const [languageName, setLanguageName] = useState("");

  const createLanguage = async () => {
    const languageRef = doc(db, "languages", languageName);
    const languageData = {
      name: languageName,
    };
    await setDoc(languageRef, languageData);
    setLanguageName(""); // Clear the input field after adding a language
  };
  useEffect(() => {
    console.log("component loaded");
  });

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