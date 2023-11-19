import React, { useState } from "react";
import axios from "axios";
import "../../styles/components/AiAssistant.scss";

function AiAssistant({ userAnswer }) {
  const [aiResponse, setAiResponse] = useState("");
  const [aiText, setAiText] = useState("EXPLAIN");
  const [showStyle, setShowStyle] = useState(false);
  const [loading, setLoading] = useState(false);
  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

  const aiAssistant = JSON.parse(localStorage.getItem("checkboxes")).find(
    (item) => item.id === "AI assistant"
  ).isChecked;
  const aiAssistantLanguage = JSON.parse(
    localStorage.getItem("settings")
  ).language;

  const fetchData = async (msg) => {
    let aiMessage = "";
    const EnglishExplain = `help me understand why is the following sentence grammatically incorrect, "${msg}"`;
    const HungarianExplain = `miért nem helyes a következő mondat nyelvtanilag, válaszolj röviden, "${msg}"`;
    const SpanishExplain = `¿Por qué la siguiente oración es gramaticalmente incorrecta? Responda brevemente, "${msg}"`;
    const ArabicExplain = `لماذا الجملة التالية غير صحيحة نحويا، "${msg}"`;
    if (aiAssistantLanguage === "English") {
      aiMessage = EnglishExplain;
    } else if (aiAssistantLanguage === "Hungarian") {
      aiMessage = HungarianExplain;
    } else if (aiAssistantLanguage === "Spanish") {
      aiMessage = SpanishExplain;
    } else if (aiAssistantLanguage === "Arabic") {
      aiMessage = ArabicExplain;
    }
    setShowStyle(true);
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
        message: `${aiMessage}`,
      },
    };

    try {
      const response = await axios.request(options);
      setAiResponse(response.data.data.conversation.output.split(". "));
    } catch (error) {
      setAiResponse("Error generating response, try again later.");
      console.error(error);
    } finally {
      setAiText("Regenerate");
      setShowStyle(false);
      setLoading(false);
    }
  };
  return (
    <div>
      {aiAssistant && (
        <div className="explain-button">
          <button
            onClick={() => fetchData(userAnswer)}
            className="button-animation"
            disabled={loading}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
            {loading ? (
              <>
                <div style={{ padding: ".4rem" }}>Loading...</div>
              </>
            ) : (
              <>
                {aiText}
                <br />
                <div className="note">powered by AI</div>
              </>
            )}
          </button>
          <p className="aiLanguage">(AI Language: {aiAssistantLanguage})</p>
          <div
            className={
              "aiResponse-container " + (showStyle ? "fadeout" : "fadein")
            }
          >
            {aiResponse &&
              aiResponse.map((sentence, index) => (
                <p key={index}>
                  <span className="first-word">{sentence.split(" ")[0]}</span>{" "}
                  {sentence.substring(sentence.indexOf(" ") + 1).trim()}.
                </p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default AiAssistant;
