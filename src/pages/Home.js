import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import "../styles/pages/Home.css";

function Home() {
  const [languages, setLanguages] = useState([]);

  const fetchLanguages = async () => {
    const languagesCollection = collection(db, "languages");
    const languagesSnapshot = await getDocs(languagesCollection);
    const languagesData = languagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setLanguages(languagesData);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div>
      <h2>Home</h2>
      <p>What language do you want to learn?</p>

      {/* Display languages as a grid */}
      <div className="languages-grid">
        {languages.map((language) => (
          <div key={language.id} className="language-card">
            <h3>{language.data.name}</h3>
            {/* You can display more information about the language here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Home;
