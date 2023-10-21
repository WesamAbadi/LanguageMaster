import React, { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import AudioPlayer from "./AudioPlayer";

const dmp = new diff_match_patch();

function Listening({ lessonData, markLessonCompleted }) {
  const [inputText, setInputText] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const compareAndHighlight = () => {
    const content = lessonData.content;
    const differences = dmp.diff_main(inputText, content);
    dmp.diff_cleanupSemantic(differences);

    const matchPercentage = (
      (1 -
        dmp.diff_levenshtein(differences) /
          Math.max(inputText.length, content.length)) *
      100
    ).toFixed(2);

    console.log("Matching Percentage: " + matchPercentage + "%");
    if (matchPercentage >= 70) {
      console.log("Lesson is completed!");
      markLessonCompleted();
    }

    // Render the differences with highlights
    const diffElements = differences.map((diff, index) => {
      const key = `${diff[0]}_${index}`;
      let className = "neutral";

      if (diff[0] === -1) {
        // Incorrect part
        className = "difference-wrong";
      } else if (diff[0] === 0) {
        // Correct part
        className = "difference-correct";
      }

      return (
        <span key={key} className={className}>
          {diff[1]}
        </span>
      );
    });

    // Set the comparison result in state
    setComparisonResult(
      <div>
        <p>Matching Percentage: {Math.round(matchPercentage)}%</p>
        {Math.round(matchPercentage) === 100 ? (
          <p>Perfecto!</p>
        ) : Math.round(matchPercentage) >= 70 ? (
          <p>Good job! You can do better!</p>
        ) : (
          <p>Keep trying!</p>
        )}

        {diffElements}
      </div>
    );
  };

  return (
    <div>
      <h3>Title: {lessonData.title}</h3>
      <audio controls>
        <source src={lessonData.mp3} />
        Your browser does not support the audio element.
      </audio>
      <AudioPlayer />
      <p>{lessonData.type}</p>
      <textarea
        name=""
        id=""
        cols="30"
        rows="5"
        value={inputText}
        onChange={handleInputChange}
      ></textarea>
      <button onClick={compareAndHighlight}>Submit</button>
      {comparisonResult}
    </div>
  );
}

export default Listening;
