import React, { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import AudioPlayer from "./AudioPlayer";
import "../../styles/components/Listening.scss";

const dmp = new diff_match_patch();

function Listening({ lessonData, markLessonCompleted }) {
  const [inputText, setInputText] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const [matchPercentage, setMatchPercentage] = useState(null);

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

    setMatchPercentage(matchPercentage);

    if (matchPercentage >= 70) {
      markLessonCompleted();
    }

    const diffElements = differences.map((diff, index) => {
      const key = `${diff[0]}_${index}`;
      let className = "neutral";

      if (diff[0] === -1) {
        className = "difference-wrong";
      } else if (diff[0] === 0) {
        className = "difference-correct";
      }

      return (
        <span key={key} className={className}>
          {diff[1]}
        </span>
      );
    });

    setComparisonResult(
      <div>
        <p>Matching Percentage: {Math.round(matchPercentage)}%</p>
        {Math.round(matchPercentage) === 100 ? (
          <p>Perfecto!</p>
        ) : Math.round(matchPercentage) >= 70 ? (
          <p>Good job! But you can do better!</p>
        ) : (
          <p>Keep trying!</p>
        )}
        {diffElements}
      </div>
    );
  };

  return (
    <div className="lesson">
      <div className="listening">
        <h3>Type what you hear.</h3>

        <audio controls>
          <source src={lessonData.mp3} />
          Your browser does not support the audio element.
        </audio>
        <textarea
          name=""
          id=""
          cols="30"
          rows="5"
          value={inputText}
          onChange={handleInputChange}
        ></textarea>
        <button onClick={compareAndHighlight}>Submit</button>
        <div className="comparison">
          {matchPercentage !== null && comparisonResult && (
            <div
              className={`answer-compared ${
                Math.round(matchPercentage) >= 70 ? "passed" : ""
              }`}
            >
              {comparisonResult}
              <div className="guide">
                <table>
                  <tr>
                    <td style={{ color: "#0ccd0c" }}>Correct</td>
                    <td style={{ color: "red" }}>Incorrect</td>
                    <td style={{ color: "white" }}>Missing</td>
                  </tr>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Listening;
