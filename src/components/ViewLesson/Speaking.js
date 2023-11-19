import React, { useRef } from "react";
import TextCompare from "./TextCompare";
import { diff_match_patch } from "diff-match-patch";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import "../../styles/components/Speaking.scss";

function Speaking({ lessonData, markLessonCompleted, languageCode }) {
  const childRef = useRef();

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

  return (
    <div className="speaking-container">
      <div className="speech-container">
        <p>Read the following script:</p>
        <div className="script">
          <p>{lessonData.content}</p>
        </div>
        <p>
          Microphone:
          {listening ? (
            <span className="mic-on">Recording</span>
          ) : (
            <span className="mic-off">Off</span>
          )}
        </p>
        {transcript && <p>{transcript}</p>}
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
          childRef.current.compareAndHighlight();
          SpeechRecognition.stopListening();
        }}
      >
        Submit
      </button>

      <TextCompare
        dmp={dmp}
        lessonData={lessonData}
        transcript={transcript}
        markLessonCompleted={markLessonCompleted}
        ref={childRef}
      />
    </div>
  );
}

export default Speaking;
