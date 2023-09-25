// LanguagePage.js
import React, { useState, useEffect } from "react";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useParams } from "react-router-dom";
import { Link } from "react-router-dom";

function LanguagePage() {
  const { languageName } = useParams();
  const [lessons, setLessons] = useState([]);

  const fetchLessons = async () => {
    if (true) {
      const lessonsCollectionRef = collection(db, "lessons");
      const languageDocRef = doc(
        lessonsCollectionRef,
        languageName.toLowerCase()
      );
      const lessonsRef = collection(languageDocRef, "lessons");
      const lessonsSnapshot = await getDocs(lessonsRef);
      const lessonsData = lessonsSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setLessons(lessonsData);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);
  return (
    <div>
      <h2>{languageName} Page</h2>

      <div className="lessons">
        {lessons.length ? (
          lessons.map((lesson) => (
            <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
              <div
                className={`lesson-card ${lesson.data.type}-lesson`}
                key={lesson.id}
              >
                <p className="lesson-type">Type: {lesson.data.type}</p>
                <h3>Title: {lesson.data.title}</h3>
              </div>
            </Link>
          ))
        ) : (
          <p>No lessons found.</p>
        )}
      </div>
    </div>
  );
}

export default LanguagePage;
