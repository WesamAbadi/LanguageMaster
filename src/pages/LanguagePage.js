import React, { useState, useEffect } from "react";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import TabSwitch from "../components/TabSwitch";
import LessonCard from "../components/ViewLesson/LessonCard";

function LanguagePage() {
  const { languageName } = useParams();
  const [languages, setLanguages] = useState([]);
  const [lessons, setLessons] = useState([]);
  let navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const tabNames = ["Campaign", "Lessons List"];

  const fetchLanguagesAndLessons = async () => {
    try {
      const languagesCollection = collection(db, "languages");
      const languagesSnapshot = await getDocs(languagesCollection);
      const languagesData = languagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setLanguages(languagesData);
      const languageExists = languagesData.some(
        (language) => language.id === languageName
      );
      if (!languageExists) {
        navigate("/");
      }
      console.log("language exists: ", languageExists);
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

      return {
        languages: languagesData,
        lessons: lessonsData,
      };
    } catch (error) {
      console.error("Error fetching languages and lessons:", error);
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    fetchLanguagesAndLessons();
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
