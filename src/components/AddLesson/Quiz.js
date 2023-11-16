import React, { useState } from "react";

function Quiz({
  newLessonTitle,
  newLessonContent,
  newLessonOptions,
  setNewLessonTitle,
  setNewLessonContent,
  setNewLessonOptions,
}) {
  const optionsArray = newLessonOptions
    .split(",")
    .map((option) => option.trim());

  const [selectedOptions] = useState(Array(optionsArray.length).fill(0));

  const options = optionsArray.map((option, index) => (
    <div key={index}>
      <span>{`${index + 1}: `}</span>
      <p>{option}</p>
    </div>
  ));

  const renderedText = newLessonContent.replace(/\[\]/g, (match) => {
    const index = match === "[]" ? 0 : parseInt(match.slice(1, -1), 10);
    return `[${selectedOptions[index]}]`;
  });

  const getFinalSentence = () => {
    const finalSentence = newLessonContent.replace(/\[\d+\]/g, (match) => {
      const index = parseInt(match.slice(1, -1), 10);
      const replacement = `[${optionsArray[index - 1] || ""}]`;
      return replacement;
    });
    return finalSentence;
  };

  return (
    <div className="quiz-grid">
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
            type="text"
            required
            spellCheck="true"
            value={renderedText}
            onChange={(event) => setNewLessonContent(event.target.value)}
          />
          <label>Lesson text</label>
        </div>
        <div className="input-field">
          <input
            type="text"
            required
            spellCheck="true"
            value={newLessonOptions}
            onChange={(event) => setNewLessonOptions(event.target.value)}
          />
          <label>Lesson options</label>
        </div>
      </div>
      <div>
        <div className="quiz-options">{options}</div>
        <div>
          The Quiz answered: <br /> {getFinalSentence()}
        </div>
      </div>
    </div>
  );
}

export default Quiz;