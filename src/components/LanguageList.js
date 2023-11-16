// LanguageList.js
import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

function LanguageList({ onSelectLanguage }) {
  const [languages, setLanguages] = useState([]);

  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const languagesCollection = collection(db, "languages");
        const snapshot = await getDocs(languagesCollection);
        const languagesData = snapshot.docs.map((doc) => doc.data());
        setLanguages(languagesData);
      } catch (error) {
        console.error("Error fetching languages:", error);
      }
    };

    fetchLanguages();
  }, []);

  return (
    <div>
      <h4>Language List</h4>
      <ul>
        {languages.map((language) => (
          <li key={language.title} onClick={() => onSelectLanguage(language)}>
            {language.title}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LanguageList;
