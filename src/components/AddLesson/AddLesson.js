import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Listening from "./Listening";
import Speaking from "./Speaking";
import LessonCard from "../ViewLesson/LessonCard";
import TabSwitch from "../TabSwitch";

function AddLesson({ updateFeedback }) {
  const [activeTab, setActiveTab] = useState(-5);
  const tabNames = ["listening", "speaking", "Quiz"];

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [lessons, setLessons] = useState([]);

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonMp3, setNewLessonMp3] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  const handleLanguageChange = (languageId) => {
    setSelectedLanguage(languageId);
  };

  const fetchLanguages = async () => {
    try {
      const languagesCollection = collection(db, "languages");
      const languagesSnapshot = await getDocs(languagesCollection);
      const languagesData = languagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setLanguages(languagesData);
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  const fetchLessons = async () => {
    try {
      if (selectedLanguage) {
        const lessonsCollectionRef = collection(db, "lessons");
        const languageDocRef = doc(lessonsCollectionRef, selectedLanguage);
        const lessonsRef = collection(languageDocRef, "lessons");
        const lessonsSnapshot = await getDocs(lessonsRef);
        const lessonsData = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setLessons(lessonsData);
      }
    } catch (error) {
      console.error("Error fetching lessons:", error);
    }
  };

  const createLesson = async () => {
    try {
      if (selectedLanguage && newLessonTitle && newLessonContent) {
        const lessonsCollectionRef = collection(db, "lessons");
        const languageDocRef = doc(lessonsCollectionRef, selectedLanguage);
        const lessonsRef = collection(languageDocRef, "lessons");

        const querySnapshot = await getDocs(lessonsRef);
        let highestLessonId = 0;

        querySnapshot.forEach((doc) => {
          const lessonId = parseInt(doc.id, 10);
          if (!isNaN(lessonId) && lessonId > highestLessonId) {
            highestLessonId = lessonId;
          }
        });

        const newLessonId = (highestLessonId + 1).toString();
        const lessonDocRef = doc(lessonsRef, newLessonId);

        let lessonType = null;
        if (activeTab === 0) {
          lessonType = "listening";
        } else if (activeTab === 1) {
          lessonType = "speaking";
        }
        if (lessonType === "speaking") {
          const newLessonData = {
            title: newLessonTitle,
            content: newLessonContent,
            type: lessonType,
          };
          await setDoc(lessonDocRef, newLessonData);
        } else {
          const newLessonData = {
            title: newLessonTitle,
            content: newLessonContent,
            mp3: newLessonMp3,
            type: lessonType,
          };
          await setDoc(lessonDocRef, newLessonData);
        }


        setNewLessonTitle("");
        setNewLessonContent("");
        setNewLessonMp3("");
        fetchLessons();
        updateFeedback("Lesson added successfully!", "success");
      } else {
        updateFeedback("Please fill in all the required fields.", "error");
      }
    } catch (error) {
      console.error("Error adding lesson:", error);
      updateFeedback("Error adding lesson. Please try again.", "error");
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    fetchLanguages();
    fetchLessons(); 
  }, [selectedLanguage]);

  return (
    <div>
      <div className="language-fetch">
        <div>
          <p>Select a language to add a lesson to:</p>
        </div>
        <div className="language-select">
          {languages.length === 0 ? (
            <p>No languages found.</p>
          ) : (
            <>
              {languages.map((language) => (
                <div key={language.id}>
                  <input
                    type="radio"
                    name="languages"
                    id={language.id}
                    value={language.id}
                    onChange={() => handleLanguageChange(language.id)}
                    checked={selectedLanguage === language.id}
                  />
                  <label htmlFor={language.id}>{language.data.title}</label>
                </div>
              ))}
              <button onClick={fetchLessons}>Fetch lessons</button>
            </>
          )}
        </div>

        <div className="lessons">
          {lessons.length ? (
            lessons.map((lesson) => (
              <LessonCard
                key={lesson.id}
                lesson={lesson}
                languageName={selectedLanguage}
              />
            ))
          ) : (
            <p>No lessons found.</p>
          )}
        </div>
      </div>

      <div className="section-title">
        <h3>Add a new lesson</h3>
      </div>
      <TabSwitch
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabNames}
      />

      {activeTab === 0 ? (
        <Listening
          newLessonTitle={newLessonTitle}
          newLessonContent={newLessonContent}
          newLessonMp3={newLessonMp3}
          setNewLessonTitle={setNewLessonTitle}
          setNewLessonContent={setNewLessonContent}
          setNewLessonMp3={setNewLessonMp3}
        />
      ) : activeTab === 1 ? (
        <p>
          <Speaking
            newLessonTitle={newLessonTitle}
            newLessonContent={newLessonContent}
            setNewLessonTitle={setNewLessonTitle}
            setNewLessonContent={setNewLessonContent}
          />
        </p>
      ) : activeTab === 2 ? (
        <p>SOON</p>
      ) : (
        <p>Please select a tab</p>
      )}

      {[0, 1].includes(activeTab) && (
        <button className="add-lesson-button" onClick={createLesson}>
          Add new lesson
        </button>
      )}
    </div>
  );
}

export default AddLesson;
