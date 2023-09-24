import React from "react";

function Lestining({
  newLessonId,
  newLessonTitle,
  newLessonContent,
  newLessonMp3,
  setNewLessonId,
  setNewLessonTitle,
  setNewLessonContent,
  setNewLessonMp3,
}) {
  return (
    <div>
      <div>
        <label> Lesson ID:</label>
        <input
          type="text"
          placeholder="Lesson ID"
          value={newLessonId}
          onChange={(event) => setNewLessonId(event.target.value)}
        />
      </div>
      <div>
        <label>Lesson title:</label>
        <input
          type="text"
          placeholder="Lesson title"
          value={newLessonTitle}
          onChange={(event) => setNewLessonTitle(event.target.value)}
        />
      </div>
      <div>
        <label>Lesson MP3 file URL:</label>
        <input
          type="url"
          placeholder="Lesson MP3 file URL"
          value={newLessonMp3}
          onChange={(event) => setNewLessonMp3(event.target.value)}
        />
      </div>
      <div>
        <label>Lesson content:</label>
        <textarea
          placeholder="Lesson content"
          value={newLessonContent}
          onChange={(event) => setNewLessonContent(event.target.value)}
        />
      </div>
    </div>
  );
}

export default Lestining;
