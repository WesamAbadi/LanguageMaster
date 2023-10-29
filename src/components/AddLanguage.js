import React, { useState } from "react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/components/AddLanguage.scss";

function AddLanguage({ updateFeedback }) {
  const [languageName, setLanguageName] = useState("");
  const [languageDescription, setLanguageDescription] = useState("DESCRIPTION");
  const [languageCode, setLanguageCode] = useState("en");
  const [languageImage, setLanguageImage] = useState(
    "https://superpalestinian.com/cdn/shop/products/image_09032836-9067-40fb-ae76-1c1de1cbc1ef.png?v=1669664967&width=1946"
  );

  const createLanguage = async () => {
    try {
      const languageRef = doc(db, "languages", languageName.toLowerCase());
      const languageData = {
        title: languageName,
        description: languageDescription,
        image: languageImage,
        code: languageCode,
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
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <input
          type="text"
          placeholder="Language code"
          value={languageCode}
          onChange={(e) => setLanguageCode(e.target.value)}
          className="language-input"
        />
        <a
          target="_blank"
          href="https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/API.md#language-string"
        >
          <button style={{ height: "30px", width: "30px" }}>?</button>
        </a>
      </div>
      <input
        type="text"
        placeholder="Language description"
        value={languageDescription}
        onChange={(e) => setLanguageDescription(e.target.value)}
        className="language-input"
      />
      <input
        type="text"
        placeholder="Language IMG URL"
        value={languageImage}
        onChange={(e) => setLanguageImage(e.target.value)}
        className="language-input"
      />
      <button onClick={createLanguage} className="add-button">
        Add
      </button>
    </div>
  );
}

export default AddLanguage;
