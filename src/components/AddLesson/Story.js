import React from "react";

function Story({
  newLessonId,
  newLessonTitle,
  newLessonContent,
  setNewLessonId,
  setNewLessonTitle,
  setNewLessonContent,
}) {
  return (
    <div>
      <div>
        <label> Lesson ID:</label>
        <input
          type="text"
          placeholder="Lesson Reference"
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

export default Story;
