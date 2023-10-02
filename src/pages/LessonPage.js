// LessonPage.js
import React, { useState, useEffect } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
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

  useEffect(() => {
    fetchLesson();
  }, [languageName, lessonId]);

  if (!lessonData) {
    return <p>Invalid lesson URL</p>;
  }

  return (
    <div>
      {lessonData.type === "lestining" && <Lestining lessonData={lessonData} />}
    </div>
  );
}

export default LessonPage;
