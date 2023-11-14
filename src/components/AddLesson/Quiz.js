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
      <label>{`Option ${index + 1}:`}</label>
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
        <label>Lesson text:</label>
        <input
          type="text"
          placeholder="Lesson text"
          value={renderedText}
          onChange={(event) => setNewLessonContent(event.target.value)}
        />
      </div>
      <div>
        <label>Lesson options:</label>
        <input
          type="text"
          placeholder="Lesson options"
          value={newLessonOptions}
          onChange={(event) => setNewLessonOptions(event.target.value)}
        />
      </div>

      <div>
        <label>Options:</label>
        {options}
      </div>

      <button onClick={addOption}>Add Option</button>
    </div>
  );
}

export default Quiz;
