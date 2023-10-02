import React from "react";

function Lestining({ lessonData }) {
  console.log("lessons iss ", lessonData);

  return (
    <div>
      <h3>Title: {lessonData.title}</h3>
      <audio controls>
        <source src={lessonData.mp3} />
        Your browser does not support the audio element.
      </audio>
      <p>{lessonData.type}</p>
      <p>{lessonData.content}</p>
    </div>
  );
}

export default Lestining;
