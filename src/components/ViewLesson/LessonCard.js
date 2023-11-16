import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/LessonCard.scss";

function LessonCard({ lesson, languageName, isCompleted, admin, onEdit }) {
  return (
    <div meta={lesson.id}>
      {admin ? (
        <div
          className={`lesson-card ${lesson.data.type}-lesson ${
            isCompleted ? "completed" : ""
          }`}
          key={lesson.id}
        >
          <div className="lesson-card-header">
            <p>{lesson.id}</p>
            {isCompleted && <p className="done">✔ Done</p>}
            <button className="edit-button" onClick={() => onEdit(lesson.id)}>
              Edit
            </button>
          </div>
          <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
            <p className="lesson-title">Title: {lesson.data.title}</p>
            <p className="lesson-type">Type: {lesson.data.type}</p>
          </Link>
        </div>
      ) : (
        <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
          <div
            className={`lesson-card ${lesson.data.type}-lesson ${
              isCompleted ? "completed" : ""
            }`}
            key={lesson.id}
          >
            <div className="lesson-card-header">
              <p>{lesson.id}</p>
              {isCompleted && <p className="done">✔ Done</p>}
            </div>
            <p className="lesson-title">Title: {lesson.data.title}</p>
            <p className="lesson-type">Type: {lesson.data.type}</p>
          </div>
        </Link>
      )}
    </div>
  );
}

export default LessonCard;
