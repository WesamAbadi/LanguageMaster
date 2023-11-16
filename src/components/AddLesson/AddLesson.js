import React, { useState, useEffect } from "react";
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../config/firebase-config";
import Listening from "./Listening";
import Speaking from "./Speaking";
import LessonCard from "../ViewLesson/LessonCard";
import TabSwitch from "../TabSwitch";
import Quiz from "./Quiz";

function AddLesson({ updateFeedback }) {
  const [activeTab, setActiveTab] = useState(-5);
  const [tabNames] = useState(["listening", "speaking", "Quiz"]);

  const [languages, setLanguages] = useState([]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [lessons, setLessons] = useState([]);
  const [editLessonId, setEditLessonId] = useState(null);

  const [newLessonTitle, setNewLessonTitle] = useState("");
  const [newLessonMp3, setNewLessonMp3] = useState("");
  const [newLessonContent, setNewLessonContent] = useState("");
  const [newLessonOptions, setNewLessonOptions] = useState("");

  const handleLanguageChange = (languageId) => {
    setSelectedLanguage(languageId);
    setEditLessonId(null);
  };

  const handleLessonEdit = (lessonId) => {
    setEditLessonId(lessonId);
    const selectedLesson = lessons.find((lesson) => lesson.id === lessonId);
    console.log(selectedLesson);
    if (selectedLesson) {
      setNewLessonTitle(selectedLesson.data.title || "");
      setNewLessonContent(selectedLesson.data.content || "");
      setNewLessonMp3(selectedLesson.data.mp3 || "");
      setNewLessonOptions(
        selectedLesson.data.options ? selectedLesson.data.options.join(",") : ""
      );
    }
    if (selectedLesson.data.type === "quiz") {
      setActiveTab(2);
    } else if (selectedLesson.data.type === "speaking") {
      setActiveTab(1);
    } else if (selectedLesson.data.type === "listening") {
      setActiveTab(0);
    }
  };

  const exitEditmode = () => {
    setEditLessonId(null);
    setNewLessonTitle("");
    setNewLessonContent("");
    setNewLessonMp3("");
    setNewLessonOptions("");
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

  const createOrUpdateLesson = async () => {
    try {
      if (selectedLanguage && newLessonTitle && newLessonContent) {
        const lessonsCollectionRef = collection(db, "lessons");
        const languageDocRef = doc(lessonsCollectionRef, selectedLanguage);
        const lessonsRef = collection(languageDocRef, "lessons");

        const lessonId = editLessonId || (await getNewLessonId(lessonsRef));

        const lessonDocRef = doc(lessonsRef, lessonId);

        let newLessonData;
        let lessonType = null;

        if (activeTab === 0) {
          lessonType = "listening";
          newLessonData = {
            title: newLessonTitle,
            content: newLessonContent,
            mp3: newLessonMp3,
            type: lessonType,
          };
        } else if (activeTab === 1) {
          lessonType = "speaking";
          newLessonData = {
            title: newLessonTitle,
            content: newLessonContent,
            type: lessonType,
          };
        } else if (activeTab === 2) {
          lessonType = "quiz";
          newLessonData = {
            title: newLessonTitle,
            content: newLessonContent,
            options: newLessonOptions ? newLessonOptions.split(",") : [],
            type: lessonType,
          };
        }

        await setDoc(lessonDocRef, newLessonData);

        setNewLessonTitle("");
        setNewLessonContent("");
        setNewLessonMp3("");
        setNewLessonOptions("");
        setEditLessonId(null);
        fetchLessons();
        setActiveTab(-5);
        updateFeedback("Lesson added/updated successfully!", "success");
      } else {
        updateFeedback("Please fill in all the required fields.", "error");
      }
    } catch (error) {
      console.error("Error adding/updating lesson:", error);
      updateFeedback(
        "Error adding/updating lesson. Please try again.",
        "error"
      );
    }
  };

  const getNewLessonId = async (lessonsRef) => {
    const querySnapshot = await getDocs(lessonsRef);
    let highestLessonId = 0;

    querySnapshot.forEach((doc) => {
      const lessonId = parseInt(doc.id, 10);
      if (!isNaN(lessonId) && lessonId > highestLessonId) {
        highestLessonId = lessonId;
      }
    });

    return (highestLessonId + 1).toString();
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    fetchLanguages();
    fetchLessons();
  }, [selectedLanguage, editLessonId]);

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
                  <label htmlFor={language.id}>
                    <input
                      type="radio"
                      name="languages"
                      id={language.id}
                      value={language.id}
                      onChange={() => handleLanguageChange(language.id)}
                      checked={selectedLanguage === language.id}
                    />
                    <div className="radio">{language.data.title}</div>
                  </label>
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
                admin={true}
                onEdit={() => handleLessonEdit(lesson.id)}
              />
            ))
          ) : (
            <p>No lessons found.</p>
          )}
        </div>
      </div>
      <div className="lesson-feilds">
        <div className="section-title">
          <h3>
            {editLessonId ? (
              <button onClick={exitEditmode}>Exit edit mode</button>
            ) : (
              "Add a lesson"
            )}
          </h3>
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
          <Speaking
            newLessonTitle={newLessonTitle}
            newLessonContent={newLessonContent}
            setNewLessonTitle={setNewLessonTitle}
            setNewLessonContent={setNewLessonContent}
          />
        ) : activeTab === 2 ? (
          <Quiz
            newLessonTitle={newLessonTitle}
            newLessonContent={newLessonContent}
            newLessonOptions={newLessonOptions}
            setNewLessonTitle={setNewLessonTitle}
            setNewLessonContent={setNewLessonContent}
            setNewLessonOptions={setNewLessonOptions}
          />
        ) : (
          <p>Please select a tab</p>
        )}
        {[0, 1, 2].includes(activeTab) && (
          <div className="add-lesson-button">
            <button onClick={createOrUpdateLesson}>
              {editLessonId ? "Update" : "Add"} lesson
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AddLesson;
