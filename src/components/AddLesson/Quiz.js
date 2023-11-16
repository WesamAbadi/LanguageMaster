import React, { useState } from "react";

function Quiz({
  newLessonTitle,
  newLessonContent,
  newLessonOptions,
  setNewLessonTitle,
  setNewLessonContent,
  setNewLessonOptions,
}) {
  // Convert options to an array
  const optionsArray = newLessonOptions
    .split(",")
    .map((option) => option.trim());

  const [selectedOptions, setSelectedOptions] = useState(
    Array(optionsArray.length).fill(0)
  );

  const options = optionsArray.map((option, index) => (
    <div key={index}>
      <span>{`${index + 1}: `}</span>
      <select
        value={selectedOptions[index]}
        onChange={(event) => {
          const updatedOptions = [...selectedOptions];
          updatedOptions[index] = parseInt(event.target.value, 10);
          setSelectedOptions(updatedOptions);
        }}
      >
        {optionsArray.map((opt, i) => (
          <option key={i} value={i}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  ));

  const renderedText = newLessonContent.replace(/\[\]/g, (match) => {
    const index = match === "[]" ? 0 : parseInt(match.slice(1, -1), 10);
    return `[${selectedOptions[index]}]`;
  });

  const addOption = () => {
    const newOption = prompt("Enter a new option:");
    if (newOption) {
      const updatedOptionsArray = [...optionsArray, newOption.trim()];
      setNewLessonOptions(updatedOptionsArray.join(","));
    }
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
      <div className="quiz-options">
        {options}
        {/* <button onClick={addOption}>Add Option</button> */}
      </div>
    </div>
  );
}

export default Quiz;
