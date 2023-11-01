import React, { useState, useEffect } from "react";
import { doc, getDoc, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useParams } from "react-router-dom";
import Listening from "../components/ViewLesson/Listening";
import Speaking from "../components/ViewLesson/Speaking";
import "../styles/pages/LessonPage.scss";
import { FaRegFlag } from "react-icons/fa6";
import Quiz from "../components/ViewLesson/Quiz";
function LessonPage() {
  const { languageName, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
  const [languageCode, setlanguageCode] = useState(null);

  const fetchLesson = async () => {
    try {
      if (languageName && lessonId) {
        const lessonDocRef = doc(
          db,
          "lessons",
          languageName.toLowerCase(),
          "lessons",
          lessonId
        );
        const lessonDocSnapshot = await getDoc(lessonDocRef);

        if (lessonDocSnapshot.exists()) {
          setLessonData(lessonDocSnapshot.data());
        } else {
        }
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  const markLessonCompleted = async () => {
    setIsCompleted(true);
    await markAsCompleted();
  };

  const checkIfCompleted = async () => {
    try {
      if (auth.currentUser && auth.currentUser.uid) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const progressCollectionRef = collection(userDocRef, "progress");
        const languageDocRef = doc(progressCollectionRef, languageName);
        const languageDocSnapshot = await getDoc(languageDocRef);

        if (languageDocSnapshot.exists()) {
          const lessonsArray = languageDocSnapshot.data().lessons || [];

          if (lessonsArray.includes(lessonId)) {
            setIsCompleted(true);
          }
        }
      } else {
        console.error("User is not authenticated or UID is missing.");
      }
    } catch (error) {
      console.error("Error checking if lesson is completed:", error);
    }
  };

  const markAsCompleted = async () => {
    try {
      if (auth.currentUser && auth.currentUser.uid) {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const progressCollectionRef = collection(userDocRef, "progress");
        const languageDocRef = doc(progressCollectionRef, languageName);

        const languageDocSnapshot = await getDoc(languageDocRef);
        let lessonsArray = [];

        if (languageDocSnapshot.exists()) {
          lessonsArray = languageDocSnapshot.data().lessons || [];
        }

        if (!lessonsArray.includes(lessonId)) {
          lessonsArray.push(lessonId);
          await setDoc(languageDocRef, { lessons: lessonsArray });
          setIsCompleted(true);
        } else {
          console.log("Lesson already completed");
        }
      } else {
        console.error("User is not authenticated or UID is missing.");
      }
    } catch (error) {
      console.error("Error marking lesson as completed:", error);
    }
  };

  const getLanguageCode = async () => {
    const storedLanguagesData = localStorage.getItem("languagesData");
    if (storedLanguagesData) {
      const parsedLanguagesData = JSON.parse(storedLanguagesData);
      for (const language of parsedLanguagesData) {
        if (language.data.title === languageName) {
          if (language.data.code) {
            setlanguageCode(language.data.code);
            console.log(language.data.code);
          }
          break;
        }
      }
    }
  };

  useEffect(() => {
    fetchLesson();
    checkIfCompleted();
    getLanguageCode();
  }, [languageName, lessonId]);

  if (!lessonData) {
    return <p>Invalid lesson URL</p>;
  }

  return (
    <div className="lesson-page">
      <div className="lesson-header">
        <div className="back">
          <div>
            <a href={`/${languageName}`}>↩ Back to lessons</a>
          </div>
          <div>
            <a href={`/${languageName}/${parseInt(lessonId) + 1}`}>
              Next lesson ↪
            </a>
          </div>
        </div>
        <div className="info">
          <h3>Lesson: {lessonId}</h3>
          <h3>Title: {lessonData.title}</h3>
          {isCompleted && <p>Lesson is already completed</p>}
          {!isCompleted && (
            <button onClick={() => markLessonCompleted()}>
              Mark as completed
            </button>
          )}
        </div>
        <div className="seperator"></div>
      </div>
      {lessonData.type === "listening" && (
        <Listening
          lessonData={lessonData}
          markLessonCompleted={markLessonCompleted}
        />
      )}
      {lessonData.type === "speaking" && (
        <Speaking
          lessonData={lessonData}
          markLessonCompleted={markLessonCompleted}
          languageCode={languageCode}
        />
      )}
      {lessonData.type === "quiz" && (
        <Quiz
          lessonData={lessonData}
          markLessonCompleted={markLessonCompleted}
        />
      )}

      <div className="lesson-footer">
        <div className="lesson-type">{lessonData.type} lesson</div>
        <div className="feedback">
          <a href="/feedback">
            Report/Feedback <FaRegFlag />
          </a>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
