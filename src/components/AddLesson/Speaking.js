import React from "react";

function Speaking({
  newLessonTitle,
  newLessonContent,
  setNewLessonTitle,
  setNewLessonContent,
}) {
  return (
    <div className="add-lesson-type">
      <div className="input-field">
        <input
          type="text"
          required
          spellCheck="true"
          value={newLessonTitle}
          onChange={(event) => setNewLessonTitle(event.target.value)}
        />
        <label>Lesson title</label>
      </div>
      <div className="input-field">
        <textarea
          required
          spellCheck="true"
          value={newLessonContent}
          onChange={(event) => setNewLessonContent(event.target.value)}
        />
        <label>Lesson content</label>
      </div>
    </div>
  );
}

export default Speaking;
