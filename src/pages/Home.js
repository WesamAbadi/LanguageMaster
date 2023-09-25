import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Link } from "react-router-dom";
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
    <div className="home">
      <h2>Home</h2>
      <p>What language do you want to learn?</p>

      <div className="languages-grid">
        {languages.map((language) => (
          <Link to={`/${language.data.title}`} key={language.id}>
            <div className="language-card">{language.data.title}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
