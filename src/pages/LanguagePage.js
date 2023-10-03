// LanguagePage.js
import React, { useState, useEffect } from "react";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import TabSwitch from "../components/TabSwitch";
import LessonCard from "../components/ViewLesson/LessonCard";
function LanguagePage() {
  const { languageName } = useParams();
  const [lessons, setLessons] = useState([]);
  const [languages, setLanguages] = useState([]);
  let navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const tabNames = ["Campaign", "Lessons List"];

  const fetchLanguages = async () => {
    const languagesCollection = collection(db, "languages");
    const languagesSnapshot = await getDocs(languagesCollection);
    const languagesData = languagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setLanguages(languagesData);
  };
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

  const verifyLanguage = async () => {
    try {
      await fetchLanguages();

      const titles = languages.map((item) => item.data.title.toLowerCase());
      const newLanguageName = languageName.toLowerCase();
      console.log("title: " + titles);

      if (titles.includes(newLanguageName)) {
        console.log(`${newLanguageName} is one of the titles.`);
        await fetchLessons();
      } else {
        console.log(`${newLanguageName} is not one of the titles.`);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    verifyLanguage();
  }, []);

  return (
    <div>
      <h2>{languageName} Page</h2>
      <TabSwitch
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabNames}
      />
      {activeTab === 0 ? (
        <p>Campaign soon..</p>
      ) : (
        <div className="lessons">
          {lessons.length ? (
            lessons.map((lesson) => (
              <LessonCard
                lesson={lesson}
                languageName={languageName}
                key={lesson.id}
              />
            ))
          ) : (
            <p>No lessons found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LanguagePage;
