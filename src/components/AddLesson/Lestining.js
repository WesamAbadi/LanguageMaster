import React from "react";

function Lestining({
  newLessonTitle,
  newLessonContent,
  newLessonMp3,
  setNewLessonTitle,
  setNewLessonContent,
  setNewLessonMp3,
}) {
  return (
    <div>
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
        <a target="_blank" href="https://jukehost.co.uk/library/upload">upload here</a>
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
