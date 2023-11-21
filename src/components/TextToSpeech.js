import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";
import "../styles/components/TextToSpeech.scss";

function TextToSpeech({ index, text, languageCode }) {
  const [loading, setLoading] = useState(false);
  const [showDiv, setShowDiv] = useState(false);

  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
  const call = async () => {
    setLoading(true);
    const options = {
      method: "GET",
      url: "https://text-to-speech-api3.p.rapidapi.com/speak",
      params: {
        text: text,
        lang: languageCode || "en",
      },
      responseType: "arraybuffer",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": "text-to-speech-api3.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const audioURL = URL.createObjectURL(blob);
      console.log(audioURL);
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowDiv(true);
    }, index * 400);

    return () => clearTimeout(timeoutId);
  }, [loading]);

  return (
    <div>
      {showDiv && (
        <div className="text-to-speech" onClick={call}>
          {loading ? (
            <div className="loading">
              <GiSandsOfTime />{" "}
            </div>
          ) : (
            <div className="play">
              <FaPlayCircle />{" "}
            </div>
          )}
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default TextToSpeech;
