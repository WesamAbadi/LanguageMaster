import React from "react";

function Listening({
  newLessonTitle,
  newLessonContent,
  newLessonMp3,
  setNewLessonTitle,
  setNewLessonContent,
  setNewLessonMp3,
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
        <input
          required
          spellCheck="false"
          value={newLessonMp3}
          onChange={(event) => setNewLessonMp3(event.target.value)}
        />
        <label>Lesson MP3 file URL</label>
        <a target="_blank" rel="noreferrer" href="https://jukehost.co.uk/library/upload">
          <button>upload here</button>
        </a>
      </div>
      <div className="input-field">
        <textarea
          required
          spellCheck="true"
          value={newLessonContent}
          onChange={(event) => setNewLessonContent(event.target.value)}
        />
        <label>Lesson content:</label>
      </div>
    </div>
  );
}

export default Listening;
