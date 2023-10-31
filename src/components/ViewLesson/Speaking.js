import React, { useState } from "react";
import { diff_match_patch } from "diff-match-patch";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "../../styles/components/Speaking.scss";

function Speaking({ lessonData, markLessonCompleted, languageCode }) {
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
    const content = lessonData.content
      .replace(/[^a-zA-Z\s]/g, "")
      .toLowerCase();
    const transcript2 = transcript.replace(/[^a-zA-Z\s]/g, "").toLowerCase();

    const differences = dmp.diff_main(transcript2, content);
    dmp.diff_cleanupSemantic(differences);

    const matchPercentage = (
      (1 -
        dmp.diff_levenshtein(differences) /
          Math.max(transcript2.length, content.length)) *
      100
    ).toFixed(2);

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
    <div className="speaking-container">
      <div className="speech-container">
        <p>Read the following script:</p>
        <div className="script">
          <p>{lessonData.content}</p>
        </div>
        <p>
          Microphone:{" "}
          {listening ? (
            <span className="mic-on">Recording</span>
          ) : (
            <span className="mic-off">Off</span>
          )}
        </p>
        {transcript && <p>{transcript}</p>}{" "}
        <div className="action-buttons">
          {listening ? (
            <button onClick={SpeechRecognition.stopListening}>Stop 🛑</button>
          ) : (
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
          )}
          <button onClick={resetTranscript}>Reset</button>
        </div>
      </div>
      <br />
      <button
        onClick={() => {
          compareAndHighlight();
          SpeechRecognition.stopListening();
        }}
      >
        Submit
      </button>

      <div className="comparison">{comparisonResult}</div>
    </div>
  );
}

export default Speaking;
