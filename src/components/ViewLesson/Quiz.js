import React, { useState } from "react";
import axios from "axios";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "../../styles/components/Quiz.scss";

const Quiz = ({ lessonData, markLessonCompleted }) => {
  let text = lessonData.text;
  const initialOptions = lessonData.options;
  const [answers, setAnswers] = useState({});
  const emptyFields = text.match(/\[\d+\]/g);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [availableOptions, setAvailableOptions] = useState(initialOptions);
  const [combinedUserAnswers, setCombinedUserAnswers] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

  const fetchData = async (msg) => {
    console.log("fetching data... user message:", msg);

    setLoading(true);
    const options = {
      method: "POST",
      url: "https://harley-the-chatbot.p.rapidapi.com/talk/bot",
      headers: {
        "content-type": "application/json",
        "x-rapidapi-ua": "RapidAPI-Playground",

        Accept: "application/json",
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "harley-the-chatbot.p.rapidapi.com",
      },
      data: {
        client: "",
        bot: "harley",
        message: `why is this sentence gramarly incorrect, answer shortly, ${msg}`,
      },
    };

    try {
      const response = await axios.request(options);
      console.log(response.data);
      setAiResponse(response.data.data.conversation.output);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
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
    let combinedUserAnswers = "";

    for (let i = 1; i < segments.length; i += 2) {
      const position = parseInt(segments[i]);
      const correctAnswer = initialOptions[position - 1];
      const userAnswer = answers[`[${position}]`];

      // console.log(
      //   `User answer for option ${position}: ${userAnswer} while correct is ${correctAnswer}`
      // );
      const combinedSegment = userAnswer
        ? segments[i - 1] + userAnswer
        : segments[i - 1];
      combinedUserAnswers += combinedSegment;

      const fieldIndex = Math.floor(i / 2);
      const emptyField = `emptyField${fieldIndex}`;
      const emptyFieldElement = document.querySelector(
        `[data-rbd-droppable-id='${emptyField}']`
      );

      if (userAnswer === correctAnswer) {
        emptyFieldElement.classList.add("correct-answer");
        emptyFieldElement.classList.remove("incorrect-answer");
        markLessonCompleted();
      } else {
        emptyFieldElement.classList.add("incorrect-answer");
        emptyFieldElement.classList.remove("correct-answer");
        setIsCorrect(false);
      }
    }

    combinedUserAnswers = combinedUserAnswers += segments[segments.length - 1];
    console.log(`Combined User Answers: ${combinedUserAnswers}`);
    setCombinedUserAnswers(combinedUserAnswers);
    setShowResult(true);
  };

  const getCorrectText = () => {
    let modifiedText = text;

    for (let i = 0; i < emptyFields.length; i++) {
      const field = emptyFields[i];
      const position = parseInt(field.match(/\d+/)[0]);
      const correctOption = initialOptions[position - 1];

      const correctOptionWithClass = `<span class="correct-option">${correctOption}</span>`;

      modifiedText = modifiedText.replace(field, correctOptionWithClass);
    }

    return <div dangerouslySetInnerHTML={{ __html: modifiedText }} />;
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
                <div className="correct-text">{getCorrectText()}</div>
                <div className="explain-button">
                  <button
                    onClick={() => fetchData(combinedUserAnswers)}
                    className="button-animation"
                    disabled={loading}
                  >
                    {loading ? (
                      <>Loading...</>
                    ) : (
                      <>
                        EXPLAIN
                        <br />
                        powered by AI
                      </>
                    )}
                    <span></span>
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                  {aiResponse && !loading && <p>{aiResponse}</p>}
                </div>
              </div>
            )}
          </div>
        )}
      </DragDropContext>
    </div>
  );
};

export default Quiz;
