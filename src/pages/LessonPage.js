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
  const [isFeedbackVisible, setIsFeedbackVisible] = useState(false);
  const [feedback, setFeedback] = useState(false);
  const [xpGain, setXpGain] = useState(30);
  const [xpAnimationActive, setXpAnimationActive] = useState(false);
  const [nextLesson, setNextLesson] = useState(false);

  const fetchLesson = async () => {
    try {
      if (!languageName || !lessonId) {
        return;
      }

      const lessonDocRefCurrent = doc(
        db,
        "lessons",
        languageName.toLowerCase(),
        "lessons",
        lessonId
      );

      const lessonDocSnapshotCurrent = await getDoc(lessonDocRefCurrent);
      if (lessonDocSnapshotCurrent.exists()) {
        handleLessonData(lessonDocSnapshotCurrent.data());
      }

      const lessonplus = (parseInt(lessonId, 10) + 1).toString();
      const lessonDocRefNext = doc(
        db,
        "lessons",
        languageName.toLowerCase(),
        "lessons",
        lessonplus
      );

      const lessonDocSnapshotNext = await getDoc(lessonDocRefNext);
      if (lessonDocSnapshotNext.exists()) {
        setNextLesson(true);
      }
    } catch (error) {
      console.error("Error fetching lesson:", error);
    }
  };

  const handleLessonData = (lessonData) => {
    setLessonData(lessonData);

    switch (lessonData.type) {
      case "listening":
        setXpGain(30);
        break;
      case "speaking":
        setXpGain(50);
        break;
      case "quiz":
        setXpGain(100);
        break;
      default:
        break;
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

        const userDocSnapshot = await getDoc(userDocRef);
        const currentXp = userDocSnapshot.data()?.xp || 0;
        const newXp = currentXp + xpGain;
        const level = Math.floor(newXp / 400);

        if (languageDocSnapshot.exists()) {
          lessonsArray = languageDocSnapshot.data().lessons || [];
        }

        if (!lessonsArray.includes(lessonId)) {
          lessonsArray.push(lessonId);
          setIsCompleted(true);
          await setDoc(languageDocRef, { lessons: lessonsArray });

          await setDoc(userDocRef, { xp: newXp }, { merge: true });
          await setDoc(userDocRef, { lvl: level }, { merge: true });
          console.log(`Xp increased by ${xpGain}. New XP:`, newXp);
          console.log(`Level is: ${level}`);
          simulateXPAnimation();
          const xpAnimationElement = document.getElementById("xpAnimation");
          xpAnimationElement.style.display = "block";

          setTimeout(() => {
            xpAnimationElement.style.display = "none";
          }, 2500);
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
          }
          break;
        }
      }
    }
  };

  const submitFeedback = async () => {
    if (auth.currentUser && auth.currentUser.uid) {
      try {
        const feedbackRef = doc(db, "feedbacks", feedback);
        const feedbackData = {
          lessonTitle: lessonData.title,
          lessonId: lessonId,
          language: languageName,
          content: feedback,
          userid: auth.currentUser.uid,
          userName: auth.currentUser.displayName,
          time: new Date(),
        };
        await setDoc(feedbackRef, feedbackData);
        console.log("Feedback submitted successfully");
        setIsFeedbackVisible(false);
      } catch (error) {
        console.error("Error submitting feedback:", error);
      }
    }
  };

  const showFeedback = () => {
    setIsFeedbackVisible(true);
  };

  const simulateXPAnimation = () => {
    setXpAnimationActive(true);
    setTimeout(() => {
      setXpAnimationActive(false);
    }, 2500);
  };

  useEffect(() => {
    fetchLesson();
    checkIfCompleted();
    getLanguageCode();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [languageName, lessonId]);

  if (!lessonData) {
    return <p>Invalid lesson URL</p>;
  }

  return (
    <div>
      <div id="xpAnimation" className="xp-animation">
        +{xpGain} XP
      </div>
      <div className={`lesson-page ${xpAnimationActive ? "blur" : ""}`}>
        <div className="lesson-header">
          <div className="back">
            <div>
              <a href={`/${languageName}/${parseInt(lessonId) - 1}`}>
                ↩ Previous lesson
              </a>
            </div>
            <div>
              {nextLesson ? (
                <a href={`/${languageName}/${parseInt(lessonId) + 1}`}>
                  Next lesson ↪
                </a>
              ) : (
                <div>
                  <a href={`/${languageName}`}>
                    No more lessons <br/> back to campaign ↩
                  </a>
                </div>
              )}
            </div>
          </div>
          <div className="info">
            <p>Lesson: {lessonId}</p>
            <h3>Title: {lessonData.title}</h3>
            {isCompleted && <p>Completed</p>}
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
            languageCode={languageCode}
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
        <div className={`lesson-footer ${isFeedbackVisible ? "visible" : ""}`}>
          <div className="lesson-type">{lessonData.type} lesson</div>
          <div onClick={showFeedback} className="feedback">
            <div className="feedback-text">
              Report/Feedback <FaRegFlag />
            </div>
            <div
              className={`feedback-form ${isFeedbackVisible ? "visible" : ""}`}
            >
              <input
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Write your feedback here"
                type="text"
              />
              <button onClick={submitFeedback}>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LessonPage;
