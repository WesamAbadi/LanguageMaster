import React, { useState, useEffect } from "react";
import { collection, getDocs, doc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { Link, useNavigate } from "react-router-dom";
import "../styles/pages/Home.scss";

import LanguageCard from "../components/LanguageCard";
function Home({ isAuth }) {
  const [languages, setLanguages] = useState([]);
  const [progress, setProgress] = useState([]);
  const [displayAll, setDisplayAll] = useState(false);
  const itemsToShow = displayAll ? languages : languages.slice(0, 3);

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
  const fetchUserProgress = async () => {
    try {
      const userDocRef = doc(db, "users", isAuth.uid); // Reference to the user's document
      const progressCollectionRef = collection(userDocRef, "progress"); // Reference to the progress subcollection
      const progressSnapshot = await getDocs(progressCollectionRef);
      const progressData = progressSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const toggleDisplay = () => {
    setDisplayAll(!displayAll);
  };

  useEffect(() => {
    if (!isAuth) {
      navigate("/");
    }
    fetchLanguages();
    fetchUserProgress();
  }, []);

  return (
    <div className="home">
      <h2>LOGO</h2>
      <h2>
        Welcome again, {isAuth.name ? isAuth.name.split(" ")[0] + "!" : "Guest"}
      </h2>
      <p> Start your learinng journey with us, let's get started! </p>
      <div className="card-row">
        <div className="suggestion-card">
          <h3>Pick up where you left off</h3>
          <div className="buttons-row">
            {progress.length > 0 ? (
              progress.map((language, index) => (
                <Link
                  to={`/${language.id}`}
                  meta={language.id}
                  key={language.id}
                >
                  <button>{language.id}</button>
                </Link>
              ))
            ) : (
              <p>You have no progress :/</p>
            )}
            {progress.length > 3 && (
              <button className="show-more" onClick={toggleDisplay}>
                {displayAll ? "Show Less -" : "Show More +"}
              </button>
            )}
          </div>
        </div>

        <div className="suggestion-card">
          <h3>Explore new languages</h3>
          <div className="buttons-row">
            {itemsToShow.length > 0 ? (
              itemsToShow.map((language, index) => (
                <Link
                  to={`/${language.data.title}`}
                  meta={language.id}
                  key={language.id}
                >
                  <button>{language.data.title}</button>
                </Link>
              ))
            ) : (
              <p>No languages found :/</p>
            )}
            {languages.length > 3 && (
              <button className="show-more" onClick={toggleDisplay}>
                {displayAll ? "Show Less -" : "Show More +"}
              </button>
            )}
          </div>
        </div>
        <div className="suggestion-card">
          <h3>Create content & give feedback</h3>
          <div className="buttons-row">
            <button>Get Started</button>
            <button>Get Started</button>
            <button>Get Started</button>
          </div>
        </div>
      </div>
      {/* <div className="languages-grid">
        {languages.map((language, index) => (
          <Link
            to={`/${language.data.title}`}
            meta={language.id}
            key={language.id}
          >
            <LanguageCard
              style={{ animationDuration: `${1 + index * 0.25}s` }}
              language={language}
            />
          </Link>
        ))}
      </div> */}
    </div>
  );
}

export default Home;
