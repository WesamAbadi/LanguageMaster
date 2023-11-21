import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import { GiSandsOfTime } from "react-icons/gi";

function TextToSpeech({ text, languageCode }) {
  const [loading, setLoading] = useState(false);
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
  }, [loading]);

  return (
    <div
      style={{
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "2rem",
        widows: "100%",
        gap: "5px",
        padding: "5px",
        border: "1px solid #ccc",
        borderRadius: "5px",
      }}
      onClick={call}
    >
      {loading ? <GiSandsOfTime /> : <FaPlayCircle />}
      {text}
    </div>
  );
}

export default TextToSpeech;
