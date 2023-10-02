// LanguagePage.js
import React, { useState, useEffect } from "react";
import { doc, getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";
import { useParams } from "react-router-dom";
import TabSwitch from "../components/TabSwitch";
import LessonCard from "../components/ViewLesson/LessonCard";
function LanguagePage() {
  const { languageName } = useParams();
  const [lessons, setLessons] = useState([]);

  const [activeTab, setActiveTab] = useState(1);
  const tabNames = ["Campaign", "Lessons List"];

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

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    fetchLessons(); // eslint-disable-next-line react-hooks/exhaustive-deps
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
