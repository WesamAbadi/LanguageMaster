import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/components/AddLanguage.scss";
import LanguageList from "./LanguageList";

function AddLanguage({ updateFeedback }) {
  const [languageName, setLanguageName] = useState("");
  const [languageDescription, setLanguageDescription] = useState("DESCRIPTION");
  const [languageCode, setLanguageCode] = useState("en");
  const [languageImage, setLanguageImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editLanguageData, setEditLanguageData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  useEffect(() => {
    // If editLanguageData is provided, set the component in edit mode
    if (editLanguageData) {
      setLanguageName(editLanguageData.title || "");
      setLanguageDescription(editLanguageData.description || "");
      setLanguageCode(editLanguageData.code || "en");
      setLanguageImage(editLanguageData.image || "");
      setIsEditMode(true);
    }
  }, [editLanguageData]);

  const selectLanguageForEdit = (selectedLanguage) => {
    if (selectedLanguage) {
      setSelectedLanguage(selectedLanguage.title);
      setEditLanguageData(selectedLanguage);
      setLanguageName(selectedLanguage.title || "");
      setLanguageDescription(selectedLanguage.description || "");
      setLanguageCode(selectedLanguage.code || "en");
      setLanguageImage(selectedLanguage.image || "");
      setIsEditMode(true);
    } else {
      setSelectedLanguage("");
      setIsEditMode(false);
      setLanguageName("");
      setLanguageCode("en");
    }
  };
  const createOrUpdateLanguage = async () => {
    try {
      const languageRef = doc(db, "languages", languageName.toLowerCase());
      const languageData = {
        title: languageName,
        description: languageDescription,
        image: languageImage,
        code: languageCode,
      };

      if (isEditMode) {
        // If in edit mode, get the existing document first
        const docSnap = await getDoc(languageRef);
        if (docSnap.exists()) {
          await setDoc(languageRef, languageData);
          updateFeedback("Language updated successfully!", "success");
        } else {
          updateFeedback("Language not found for editing.", "error");
        }
      } else {
        // If not in edit mode, create a new document
        await setDoc(languageRef, languageData);
        updateFeedback("Language added successfully!", "success");
      }

      // Reset form fields after creating or updating language
      setLanguageName("");
      setLanguageDescription("DESCRIPTION");
      setLanguageCode("en");
      setLanguageImage(
        "https://superpalestinian.com/cdn/shop/products/image_09032836-9067-40fb-ae76-1c1de1cbc1ef.png?v=1669664967&width=1946"
      );
      setIsEditMode(false);
    } catch (error) {
      updateFeedback(
        "Error adding/updating language. Please try again.",
        "error"
      );
    }
  };

  return (
    <div className="add-language-container">
      <LanguageList
        selectedLanguage={selectedLanguage}
        onSelectLanguage={selectLanguageForEdit}
      />

      <h4>{isEditMode ? "Edit" : "Add"} a language to the system</h4>
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
          rel="noreferrer"
          href="https://github.com/JamesBrill/react-speech-recognition/blob/HEAD/docs/API.md#language-string"
        >
          <button style={{ height: "30px", width: "30px" }}>?</button>
        </a>
      </div>
      {/* <input
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
      /> */}
      <button onClick={createOrUpdateLanguage} className="add-button">
        {isEditMode ? "Update" : "Add"}
      </button>
    </div>
  );
}

export default AddLanguage;
