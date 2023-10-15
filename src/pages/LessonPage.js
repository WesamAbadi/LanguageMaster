// LessonPage.js
import React, { useState, useEffect } from "react";
import { doc, getDoc, getDocs, setDoc, collection } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useParams } from "react-router-dom";
import Lestining from "../components/ViewLesson/Lestining";
function LessonPage() {
  const { languageName, lessonId } = useParams();
  const [lessonData, setLessonData] = useState(null);
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

  const markAsCompleted = async () => {
    try {
      // Check if the user is authenticated and has a UID
      if (auth.currentUser && auth.currentUser.uid) {
        console.log("User is authenticated and UID is:", auth.currentUser.uid);

        // Construct a reference to the user's document
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        console.log("User document ref:", userDocRef);

        // Construct a reference to the "progress" collection
        const progressCollectionRef = collection(userDocRef, "progress");
        console.log("Progress collection ref:", progressCollectionRef);

        // Construct a reference to the language-specific document inside "progress"
        console.log("Language name ref:", languageName);
        const languageDocRef = doc(progressCollectionRef, languageName);
        console.log("Language document ref:", languageDocRef);

        // Get the current lessons array for the language
        const languageDocSnapshot = await getDoc(languageDocRef);

        let lessonsArray = [];

        if (languageDocSnapshot.exists()) {
          // If the document exists, update the lessons array
          lessonsArray = languageDocSnapshot.data().lessons || [];
        }

        // Check if the lessonId is not already in the lessons array
        if (!lessonsArray.includes(lessonId)) {
          // Add the lessonId to the lessons array
          lessonsArray.push(lessonId);

          // Update the language document with the new lessons array
          await setDoc(languageDocRef, { lessons: lessonsArray });
        }
        else{
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
    fetchLesson(); // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageName, lessonId]);

  if (!lessonData) {
    return <p>Invalid lesson URL</p>;
  }

  return (
    <div className="lesson-page">
      <button onClick={() => markAsCompleted()}>
        mark as completed
      </button>
      <h1>{lessonId}</h1>
      {lessonData.type === "lestining" && <Lestining lessonData={lessonData} />}
    </div>
  );
}

export default LessonPage;
