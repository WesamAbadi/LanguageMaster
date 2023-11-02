import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/LessonCard.scss";

function LessonCard({ lesson, languageName, isCompleted }) {
  return (
    <div meta={lesson.id}>
      <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
        <div
          className={`lesson-card ${lesson.data.type}-lesson ${isCompleted ? "completed" : ""}`}
          key={lesson.id}
        >
          <div className="lesson-card-header">
            <p>{lesson.id}</p>
            <p className="done">✔ Done</p>
          </div>
          <p className="lesson-title">Title: {lesson.data.title}</p>
          <p className="lesson-type">Type: {lesson.data.type}</p>
        </div>
      </Link>
    </div>
  );
}

export default LessonCard;
