import React from "react";
import { Link } from "react-router-dom";
import "../../styles/components/LessonCard.scss";

function LessonCard({ lesson, languageName }) {
  return (
    <div>
      <Link to={`/${languageName}/${lesson.id}`} key={lesson.id}>
        <div
          className={`lesson-card ${lesson.data.type}-lesson`}
          key={lesson.id}
        >
          <p className="lesson-type">Type: {lesson.data.type}</p>
          <h3>Title: {lesson.data.title}</h3>
        </div>
      </Link>
    </div>
  );
}

export default LessonCard;
