import React, { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../../styles/components/Quiz.scss";

const Quiz = () => {
  let text = "I like to [2] pizza and cola [5] breakfast";
  const initialOptions = ["eating", "eat", "ate", "to", "for", "in"];
  const [answers, setAnswers] = useState({});
  const emptyFields = text.match(/\[\d+\]/g);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);

  const handleDragEnd = (result) => {
    if (!result.destination) return;

    const sourceIndex = result.source.index;
    const destinationIndex = result.destination.index;

    const sourceId = result.draggableId;
    const destinationId = result.destination.droppableId;

    const sourceOption = availableOptions[sourceIndex];
    const destinationOption = availableOptions[destinationIndex];

    const updatedAnswers = { ...answers };

    if (destinationId.includes("emptyField") && sourceId.includes("option")) {
      const fieldIndex = parseInt(destinationId.match(/\d+/)[0]);
      updatedAnswers[emptyFields[fieldIndex]] = sourceOption;
      setAnswers(updatedAnswers);

      setAvailableOptions((prevOptions) => {
        return prevOptions.filter((option) => option !== sourceOption);
      });
    }
  };

  const checkAnswers = () => {
    setIsCorrect(true);

    const segments = text.split(/\[(\d+)\]/);

    for (let i = 1; i < segments.length; i += 2) {
      const position = parseInt(segments[i]);
      const correctAnswer = initialOptions[position - 1];
      const userAnswer = answers[`[${position}]`];

      console.log(
        `User answer for option ${position}: ${userAnswer} while correct is ${correctAnswer}`
      );

      const fieldIndex = Math.floor(i / 2);
      const emptyField = `emptyField${fieldIndex}`;
      const emptyFieldElement = document.querySelector(
        `[data-rbd-droppable-id='${emptyField}']`
      );

      if (userAnswer === correctAnswer) {
        emptyFieldElement.classList.add("correct-answer");
        emptyFieldElement.classList.remove("incorrect-answer");
      } else {
        emptyFieldElement.classList.add("incorrect-answer");
        emptyFieldElement.classList.remove("correct-answer");
        setIsCorrect(false);
      }
    }
    setShowResult(true);
  };

  const getCorrectText = () => {
    let modifiedText = text;

    for (let i = 0; i < emptyFields.length; i++) {
      const field = emptyFields[i];
      const position = parseInt(field.match(/\d+/)[0]);
      const correctOption = initialOptions[position - 1];
      modifiedText = modifiedText.replace(field, correctOption);
    }

    return modifiedText;
  };

  const resetQuiz = () => {
    setAnswers({});
    setAvailableOptions(initialOptions);
    setShowResult(false);
    setIsCorrect(false);
    const elementsWithClasses = document.querySelectorAll(
      ".correct-answer, .incorrect-answer"
    );
    elementsWithClasses.forEach((element) => {
      element.classList.remove("correct-answer", "incorrect-answer");
    });
  };

  const textWithBlanks = text.split(/(\[\d+\])/g).map((part, index) => {
    if (emptyFields.includes(part)) {
      return (
        <Droppable
          key={index}
          droppableId={`emptyField${emptyFields.indexOf(part)}`}
        >
          {(provided, snapshot) => (
            <span
              className="dragged-answer"
              ref={provided.innerRef}
              style={{
                background: snapshot.isDraggingOver
                  ? "lightblue"
                  : "transparent",
              }}
              {...provided.droppableProps}
            >
              {answers[part] ? answers[part] : `___ `}
            </span>
          )}
        </Droppable>
      );
    } else {
      return <span key={index}>{part}</span>;
    }
  });

  const handleCheckAnswers = () => {
    checkAnswers();
  };

  return (
    <div className="quiz">
      <DragDropContext onDragEnd={handleDragEnd}>
        <div>{textWithBlanks}</div>
        <Droppable droppableId="options" direction="horizontal">
          {(provided, snapshot) => (
            <div
              className="options"
              ref={provided.innerRef}
              {...provided.droppableProps}
            >
              {availableOptions.map((option, index) => (
                <Draggable
                  key={`option-${index}`}
                  draggableId={`option-${index}`}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      className="option"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      style={{
                        backgroundColor: snapshot.isDragging
                          ? "#263B4A"
                          : "#456C86",
                        ...provided.draggableProps.style,
                      }}
                    >
                      {option}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
        <div className="buttons">
          <button onClick={handleCheckAnswers}>Check Answers</button>
          <button onClick={resetQuiz}>Reset Quiz</button>{" "}
        </div>
        {showResult && (
          <div className="final-result">
            {isCorrect ? (
              <p>Correct! Well done.</p>
            ) : (
              <div>
                <p>
                  Sorry, some answers are incorrect. <br />
                  Here are the correct answers:
                </p>
                <div className="correct-text">"{getCorrectText()}"</div>
              </div>
            )}
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default Quiz;
