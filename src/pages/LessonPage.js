// LessonPage.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useParams } from "react-router-dom";
import Lestining from "../components/ViewLesson/Lestining";
function LessonPage() {
  const { languageName, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);
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

  useEffect(() => {
    fetchLesson(); 
    checkIfCompleted();
  }, [languageName, lessonId]);

  if (!lessonData) {
    return <p>Invalid lesson URL</p>;
  }

  return (
    <div className="lesson-page">
      {!isCompleted && ( // Check if the lesson is not already completed
        <button onClick={() => markLessonCompleted()}>Mark as completed</button>
      )}
      {isCompleted && <p>Lesson is already completed</p>}
      <h1>{lessonId}</h1>
      {lessonData.type === "lestining" && (
        <Lestining
          lessonData={lessonData}
          markLessonCompleted={markLessonCompleted}
        />
      )}
    </div>
  );
}

export default LessonPage;
