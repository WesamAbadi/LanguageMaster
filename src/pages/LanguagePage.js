import React, { useState, useEffect } from "react";
import { doc, getDocs, getDoc, collection } from "firebase/firestore";
import { db, auth } from "../config/firebase-config";
import { useNavigate, useParams } from "react-router-dom";
import TabSwitch from "../components/TabSwitch";
import LessonCard from "../components/ViewLesson/LessonCard";
import "../styles/pages/LanguagePage.scss";

function LanguagePage() {
  const { languageName } = useParams();
  const [lessons, setLessons] = useState([]);
  const [progress, setProgress] = useState([]);
  const [Campaigns, setCampaigns] = useState([]);
  let navigate = useNavigate();

  const [activeTab, setActiveTab] = useState(1);
  const tabNames = ["Alphabet", "Campaign", "Lessons List"];

  const fetchLanguagesAndLessons = async () => {
    try {
      const languagesCollection = collection(db, "languages");
      const languagesSnapshot = await getDocs(languagesCollection);
      const languagesData = languagesSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      console.log(languagesData);
      const languageExists = languagesData.find(
        (language) => language.data.title === languageName
      );
      if (!languageExists) {
        navigate("/");
      } else {
        const campaignData = languageExists.data.campaign;
        console.log(campaignData);
        setCampaigns(campaignData);
        const lessonsCollectionRef = collection(db, "lessons");
        const languageDocRef = doc(
          lessonsCollectionRef,
          languageName.toLowerCase()
        );

        const lessonsRef = collection(languageDocRef, "lessons");
        const lessonsSnapshot = await getDocs(lessonsRef);
        const lessonsData = lessonsSnapshot.docs.map((doc) => ({
          id: doc.id,
          data: doc.data(),
        }));
        setLessons(lessonsData);

        return {
          languages: languagesData,
          lessons: lessonsData,
        };
      }
    } catch (error) {
      console.error("Error fetching languages and lessons:", error);
    }
  };

  const fetchUserProgress = async () => {
    try {
      const userDocRef = doc(db, "users", auth.currentUser.uid);
      const progressCollectionRef = collection(userDocRef, "progress");
      const languageDocRef = doc(progressCollectionRef, languageName);
      const languageDocSnapshot = await getDoc(languageDocRef);

      const progressData = {
        id: languageDocSnapshot.id,
        data: languageDocSnapshot.data() || null,
      };
      setProgress(progressData);
    } catch (error) {
      console.error("Error fetching user progress:", error);
    }
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
  };

  useEffect(() => {
    fetchLanguagesAndLessons();
    fetchUserProgress();
  }, []);

  return (
    <div>
      <div className="page-title">
        <h2>{languageName}</h2>
      </div>
      <TabSwitch
        activeTab={activeTab}
        onTabChange={handleTabChange}
        tabs={tabNames}
      />
      {activeTab === 0 ? (
        <p>Alphabet soon..</p>
      ) : activeTab === 1 ? (
        <div className="campaign">
          {Campaigns && Object.keys(Campaigns).length > 0 ? (
            Object.keys(Campaigns).map((level, levelIndex) => (
              <div level={level} key={levelIndex}>
                <h3>Level {level}</h3>
                <div className="lessons">
                  {Campaigns[level].map((lessonNumber, lessonIndex) => {
                    const matchingLessons = lessons.filter(
                      (lessonItem) =>
                        parseInt(lessonItem.id, 10) === lessonNumber
                    );
                    return (
                      <div
                        className={`lesson${lessonNumber} lesson-in-level`}
                        key={lessonIndex}
                      >
                        {matchingLessons.map((lessonItem) => (
                          <LessonCard
                            lesson={lessonItem}
                            languageName={languageName}
                            key={lessonItem.id}
                            isCompleted={
                              progress.data && progress.data.lessons
                                ? progress.data.lessons.includes(lessonItem.id)
                                : null
                            }
                          />
                        ))}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          ) : (
            <p>No campaigns available for this language.</p>
          )}
        </div>
      ) : (
        <div className="lessons">
          {lessons.length ? (
            lessons.map((lesson) => (
              <LessonCard
                lesson={lesson}
                languageName={languageName}
                key={lesson.id}
                isCompleted={
                  progress.data && progress.data.lessons
                    ? progress.data.lessons.includes(lesson.id)
                    : null
                }
              />
            ))
          ) : (
            <p>No lessons found.</p>
          )}
        </div>
      )}
    </div>
  );
}

export default LanguagePage;
