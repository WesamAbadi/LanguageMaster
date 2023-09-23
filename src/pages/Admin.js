import React, { useState, useEffect } from "react";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase-config";

function Admin() {
  const [languageName, setLanguageName] = useState("");
  const [languages, setLanguages] = useState([]);

  const fetchLanguages = async () => {
    const languagesCollection = collection(db, "languages");
    const languagesSnapshot = await getDocs(languagesCollection);
    const languagesData = languagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setLanguages(languagesData);
    console.log(languagesData);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  const createLanguage = async () => {
    const languageRef = doc(db, "languages", languageName);
    const languageData = {
      name: languageName,
    };
    await setDoc(languageRef, languageData);
    fetchLanguages();
  };

  return (
    <div>
      <h2>Admin Page</h2>
      <h4>Add a new language to the system</h4>
      <input
        type="text"
        placeholder="Language name"
        onChange={(e) => setLanguageName(e.target.value)}
      />
      <button onClick={createLanguage}>Add</button>

      <select name="languages" id="languages">
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.data.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Admin;
