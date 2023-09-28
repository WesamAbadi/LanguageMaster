import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Lestining from "./Lestining";

function AddLesson({ updateFeedback }) {
  const [activeTab, setActiveTab] = useState(0);

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
    try {
      if (selectedLanguage) {
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

  useEffect(() => {
    fetchLanguages();
    fetchLessons();
  }, []);
  const renderTabContent = () => {
    switch (activeTab) {
      case "lestining":
        return (
          <Lestining
            newLessonTitle={newLessonTitle}
            newLessonContent={newLessonContent}
            newLessonMp3={newLessonMp3}
            setNewLessonTitle={setNewLessonTitle}
            setNewLessonContent={setNewLessonContent}
            setNewLessonMp3={setNewLessonMp3}
          />
        );
      case "story":
        return null;
      case "writing":
        return null;
      default:
        return (
          <div>
            <p>Select the type of lesson you want to add</p>
            <p>Start by selecting a tab</p>
          </div>
        );
    }
  };
  return (
    <div>
      <p>Select a language to add a lesson to:</p>
      <select name="languages" id="languages" onChange={handleLanguageChange}>
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

      <h3>Add a new lesson</h3>
      <div className="tab-navigation">
        <button onClick={() => setActiveTab("lestining")}>
          Listening lesson
        </button>
        <button onClick={() => setActiveTab("story")}>Story lesson</button>
        <button onClick={() => setActiveTab("writing")}>Writing lesson</button>
      </div>
      <div className="tab-content">{renderTabContent()}</div>

      <button onClick={createLesson}>Add new lesson</button>
    </div>
  );
}

export default AddLesson;
