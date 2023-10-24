import React, { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function Speaking({ lessonData, markLessonCompleted, languageCode }) {
  const [inputText, setInputText] = useState("");
  const [comparisonResult, setComparisonResult] = useState(null);
  const dmp = new diff_match_patch();

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
  } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const compareAndHighlight = () => {
    const content = lessonData.content;
    const differences = dmp.diff_main(transcript, content);
    dmp.diff_cleanupSemantic(differences);

    const matchPercentage = (
      (1 -
        dmp.diff_levenshtein(differences) /
          Math.max(transcript.length, content.length)) *
      100
    ).toFixed(2);

    if (matchPercentage >= 70) {
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
      Speaking
      <div>
        <p>Microphone: {listening ? "on" : "off"}</p>
        <button
          onClick={() =>
            SpeechRecognition.startListening({
              continuous: true,
              language: languageCode,
            })
          }
        >
          Start
        </button>
        <button onClick={SpeechRecognition.stopListening}>Stop</button>
        <button onClick={resetTranscript}>Reset</button>
        <p>{transcript}</p>
      </div>
      <br />
      <button onClick={compareAndHighlight}>Submit</button>
      {comparisonResult}
    </div>
  );
}

export default Speaking;
