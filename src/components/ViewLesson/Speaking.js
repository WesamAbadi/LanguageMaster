import React from "react";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";

function Speaking({ lessonData, markLessonCompleted, languageCode }) {
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
    </div>
  );
}

export default Speaking;
