import React, { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import AudioPlayer from "./AudioPlayer";
const dmp = new diff_match_patch();

function Lestining({ lessonData }) {
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

    // Render the differences with highlights
    const diffElements = differences.map((diff, index) => {
      const key = `${diff[0]}_${index}`;
      const className = diff[0] === -1 ? "difference" : "";
      return (
        <span key={key} className={className}>
          {diff[1]}
        </span>
      );
    });

    // Set the comparison result in state
    setComparisonResult(
      <div>
        <p>Matching Percentage: {matchPercentage}%</p>
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

export default Lestining;
