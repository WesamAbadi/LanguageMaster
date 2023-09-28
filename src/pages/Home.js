import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/Home.scss";

import LanguageCard from "../components/LanguageCard";
function Home({ isAuth }) {
  const [languages, setLanguages] = useState([]);
  let navigate = useNavigate();

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
    // if (!isAuth) {
    //   navigate("/");
    // }
    fetchLanguages();
  }, []);

  return (
    <div className="home">
      <h2>Home</h2>
      <p>What language do you want to learn?</p>

      <div className="languages-grid">
        {languages.map((language, index) => (
          <Link to={`/${language.data.title}`} key={language.id}>
            <LanguageCard
              style={{ animationDuration: `${1 + index * 0.25}s` }}
              language={language}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Home;
