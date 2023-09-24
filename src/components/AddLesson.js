import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

function AddLesson() {
  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("english");
  const [lessons, setLessons] = useState([]);

  const [newLessonId, setNewLessonId] = useState("");
  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");

  const handleLanguageChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedLanguage(selectedValue);
    console.log(selectedValue);
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
    if (selectedLanguage && newLessonId) {
      const lessonsCollectionRef = collection(db, "lessons");
      const languageDocRef = doc(lessonsCollectionRef, selectedLanguage);
      const lessonsRef = collection(languageDocRef, "lessons");

      const lessonDocRef = doc(lessonsRef, newLessonId);

      const lessonData = {
        title: newLessonTitle,
        content: newLessonContent,
      };

      await setDoc(lessonDocRef, lessonData);

      console.log("Added data: ", lessonData);

      setNewLessonId("");
      setNewLessonTitle("");
      setNewLessonContent("");
      fetchLessons();
    }
  };

  useEffect(() => {
    fetchLanguages();
    fetchLessons();
  }, []);

  return (
    <div>
      AddLesson
      <p>Select a language to add a lesson to:</p>
      <select name="languages" id="languages" onChange={handleLanguageChange}>
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.data.title}
          </option>
        ))}
      </select>
      <button onClick={fetchLessons}>Check</button>
      {lessons.length ? (
        lessons.map((lesson) => (
          <div key={lesson.id}>
            <h2>{lesson.id}</h2>
            <p>{lesson.data.title}</p>
          </div>
        ))
      ) : (
        <p>No lessons found.</p>
      )}
      <h3>Add a new lesson</h3>
      <input
        type="text"
        placeholder="Lesson ID"
        value={newLessonId}
        onChange={(event) => setNewLessonId(event.target.value)}
      />
      <input
        type="text"
        placeholder="Lesson title"
        value={newLessonTitle}
        onChange={(event) => setNewLessonTitle(event.target.value)}
      />
      <textarea
        placeholder="Lesson content"
        value={newLessonContent}
        onChange={(event) => setNewLessonContent(event.target.value)}
      />
      <button onClick={createLesson}>Add new lesson</button>
    </div>
  );
}

export default AddLesson;
