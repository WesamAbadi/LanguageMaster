import React from "react";

function Lestining(lessonData) {
  return (
    <div>
      <h3>Title: {lessonData.title}</h3>
      <audio controls>
        <source src={lessonData.mp3} />
        Your browser does not support the audio element.
      </audio>
    </div>
  );
}

export default Lestining;
