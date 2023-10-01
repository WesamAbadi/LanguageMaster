import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Lestining from "./Lestining";
import TabSwitch from "../TabSwitch";

function AddLesson({ updateFeedback }) {
  const [activeTab, setActiveTab] = useState(-3);
  const tabNames = ["Lestining", "speaking", "Add a new lesson"];

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [lessons, setLessons] = useState([]);

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonMp3, setNewLessonMp3] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  const handleLanguageChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLanguage(selectedValue);
  };

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
  };

  const createLesson = async () => {
    console.log("fist");
    try {
      if (selectedLanguage) {
        console.log(`Adding lesson for ${selectedLanguage}`);
        const lessonsCollectionRef = collection(db, "lessons");
        const languageDocRef = doc(lessonsCollectionRef, selectedLanguage);
        const lessonsRef = collection(languageDocRef, "lessons");
        const lessonsSnapshot = await getDocs(lessonsRef);
        let highestLessonId = 0;

        lessonsSnapshot.forEach((doc) => {
          const lessonId = parseInt(doc.id, 10); // Convert ID to an integer
          if (!isNaN(lessonId) && lessonId > highestLessonId) {
            highestLessonId = lessonId;
          }
        });
        const newLessonId = (highestLessonId + 1).toString();
        const lessonDocRef = doc(lessonsRef, newLessonId);
        if (activeTab === "lestining") {
          const lessonData = {
            title: newLessonTitle,
            mp3: newLessonMp3,
            content: newLessonContent,
            type: "lestining",
          };
          await setDoc(lessonDocRef, lessonData);
        } else if (activeTab === "story") {
          const lessonData = {
            title: newLessonTitle,
            content: newLessonContent,
          };
          await setDoc(lessonDocRef, lessonData);
        } else if (activeTab === "writing") {
          const lessonData = {
            title: newLessonTitle,
            content: newLessonContent,
          };
          await setDoc(lessonDocRef, lessonData);
        }

        setNewLessonTitle("");
        setNewLessonContent("");
        fetchLessons();
        updateFeedback("Lesson added successfully!", "success");
      }
    } catch (error) {
      updateFeedback("Error adding lesson. Please try again.", "error");
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
    console.log(`Active tab is now: ${activeTab}`);
  };

  useEffect(() => {
    fetchLanguages();
    fetchLessons();
  }, []);

  return (
    <div>
      <div className="language-fetch">
        <div>
          <p>Select a language to add a lesson to:</p>
        </div>
        <div className="language-select">
          <select
            name="languages"
            id="languages"
            onChange={handleLanguageChange}
          >
            {languages.map((language) => (
              <option key={language.id} value={language.id}>
                {language.data.title}
              </option>
            ))}
          </select>
          <button onClick={fetchLessons}>Fetch lessons</button>
          <div className="lessons">
            {lessons.length ? (
              lessons.map((lesson) => (
                <div className="lesson-card" key={lesson.id}>
                  <h3>{lesson.id}</h3>
                  <p>{lesson.data.title}</p>
                </div>
              ))
            ) : (
              <p>No lessons found.</p>
            )}
          </div>
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
        <Lestining
          newLessonTitle={newLessonTitle}
          newLessonContent={newLessonContent}
          newLessonMp3={newLessonMp3}
          setNewLessonTitle={setNewLessonTitle}
          setNewLessonContent={setNewLessonContent}
          setNewLessonMp3={setNewLessonMp3}
        />
      ) : activeTab === 1 ? (
        <p>SOON</p>
      ) : activeTab === 2 ? (
        <p>SOON</p>
      ) : (
        <p>Please select a tab</p>
      )}

      {[0, 1, 2].includes(activeTab) && (
        <button className="add-lesson-button" onClick={createLesson}>
          Add new lesson
        </button>
      )}
    </div>
  );
}

export default AddLesson;
