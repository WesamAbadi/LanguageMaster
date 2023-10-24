import React, { useState, useEffect } from "react";
import { doc, getDocs, getDoc, collection } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import TabSwitch from "../components/TabSwitch";
import LessonCard from "../components/ViewLesson/LessonCard";
import "../styles/pages/LanguagePage.scss";

function LanguagePage() {
  const { languageName } = useParams();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
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
      const languageExists = languagesData.some(
        (language) => language.data.title === languageName
      );
      if (!languageExists) {
        navigate("/");
      }
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

  const fetchUserProgress = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const progressCollectionRef = collection(userDocRef, "progress");
      const languageDocRef = doc(progressCollectionRef, languageName);
      const languageDocSnapshot = await getDoc(languageDocRef);

      const progressData = {
        id: languageDocSnapshot.id,
        data: languageDocSnapshot.data(),
      };
      setProgress(progressData);
      console.log("progress: ", progressData);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    fetchLanguagesAndLessons();
    fetchUserProgress();
  }, []);

  return (
    <div>
      <div className="page-title">
        <h2>{languageName}</h2>
      </div>
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
                isCompleted={progress.data.lessons.includes(lesson.id)}
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
