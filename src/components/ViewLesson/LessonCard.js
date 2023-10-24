import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/LessonCard.scss";

function LessonCard({ lesson, languageName, isCompleted }) {
  return (
    <div>
      <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
        <div
          className={`lesson-card ${lesson.data.type}-lesson ${isCompleted ? "completed" : ""}`}
          key={lesson.id}
        >
          <p className="lesson-type">Type: {lesson.data.type}</p>
          <p>Title: {lesson.data.title}</p>
        </div>
      </Link>
    </div>
  );
}

export default LessonCard;
