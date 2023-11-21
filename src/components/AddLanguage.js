import React, { useState, useEffect } from "react";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/components/AddLanguage.scss";
import LanguageList from "./LanguageList";

function AddLanguage({ updateFeedback }) {
  const [languageName, setLanguageName] = useState("");
  const [languageDescription, setLanguageDescription] = useState("DESCRIPTION");
  const [languageCode, setLanguageCode] = useState("en");
  const [languageCampaign, setLanguageCampaign] = useState({});
  const [languageAlphabet, setLanguageAlphabet] = useState([]);
  const [languageImage, setLanguageImage] = useState(
    "https://via.placeholder.com/150"
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [editLanguageData, setEditLanguageData] = useState(null);
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [newLevel, setNewLevel] = useState("");
  const [newLessons, setNewLessons] = useState("");
  const [editLevel, setEditLevel] = useState(null);

  useEffect(() => {
    // If editLanguageData is provided, set the component in edit mode
    if (editLanguageData) {
      setLanguageName(editLanguageData.title || "");
      setLanguageDescription(editLanguageData.description || "");
      setLanguageCode(editLanguageData.code || "en");
      setLanguageImage(editLanguageData.image || "");
      setLanguageCampaign(editLanguageData.campaign || {});
      setLanguageAlphabet(editLanguageData.alphabet || []);
      console.log(editLanguageData.alphabet);
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
      setLanguageCampaign(selectedLanguage.campaign || {});
      setLanguageAlphabet(selectedLanguage.alphabet || []);
      setIsEditMode(true);
    } else {
      setSelectedLanguage("");
      setIsEditMode(false);
      setLanguageName("");
      setLanguageCode("en");
      setLanguageCampaign({});
      setLanguageAlphabet([]);
      setEditLevel(null);
    }
  };

  const createOrUpdateLanguage = async () => {
    try {
      const languageRef = doc(db, "languages", languageName.toLowerCase());
      const languageData = {
        title: languageName,
        description: languageDescription,
        code: languageCode,
        image: languageImage,
        campaign: languageCampaign,
        alphabet: languageAlphabet,
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
      setLanguageImage("https://via.placeholder.com/150");
      setLanguageCampaign({});
      setLanguageAlphabet([]);
      setIsEditMode(false);
      setEditLevel(null);
    } catch (error) {
      updateFeedback(
        "Error adding/updating language. Please try again.",
        "error"
      );
    }
  };

  const addOrUpdateLevel = () => {
    if (editLevel !== null) {
      // Editing an existing level
      setLanguageCampaign((prevCampaign) => ({
        ...prevCampaign,
        [editLevel]: newLessons.split(",").map(Number),
      }));
      setEditLevel(null);
    } else {
      // Adding a new level
      setLanguageCampaign((prevCampaign) => ({
        ...prevCampaign,
        [newLevel]: newLessons.split(",").map(Number),
      }));
    }
    setNewLevel("");
    setNewLessons("");
  };

  const editExistingLevel = (level) => {
    setEditLevel(level);
    setNewLevel(level);
    setNewLessons(languageCampaign[level].join(", "));
  };

  const deleteLevel = (level) => {
    const { [level]: deletedLevel, ...restCampaign } = languageCampaign;
    setLanguageCampaign(restCampaign);
  };

  return (
    <div className="add-language-container">
      <LanguageList
        selectedLanguage={selectedLanguage}
        onSelectLanguage={selectLanguageForEdit}
      />

      <h4>{isEditMode ? "Edit" : "Add"} a language</h4>
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

      <div>
        <h4>Campaign Levels</h4>
        {Object.entries(languageCampaign).map(([level, lessons]) => (
          <div key={level}>
            <strong>{`Level ${level}:`}</strong> {lessons.join(", ")}
            <button onClick={() => editExistingLevel(level)}>Edit</button>
            <button onClick={() => deleteLevel(level)}>Delete</button>
          </div>
        ))}
        <div>
          <input
            type="text"
            placeholder="New Level"
            value={newLevel}
            onChange={(e) => setNewLevel(e.target.value)}
            className="language-input"
          />
          <input
            type="text"
            placeholder="Lessons (comma-separated)"
            value={newLessons}
            onChange={(e) => setNewLessons(e.target.value)}
            className="language-input"
          />
          <button onClick={addOrUpdateLevel}>
            {editLevel !== null ? "Update Level" : "Add Level"}
          </button>
        </div>
        <div>
          <input
            type="text"
            placeholder="alphabet (comma-separated)"
            value={languageAlphabet.join(", ")}
            onChange={(e) =>
              setLanguageAlphabet(
                e.target.value.split(",").map((item) => item.trim())
              )
            }
            className="language-input"
          />
        </div>
      </div>

      <button onClick={createOrUpdateLanguage} className="add-button">
        {isEditMode ? "Update Language" : "Add Language"}
      </button>
    </div>
  );
}

export default AddLanguage;
