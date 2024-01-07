import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaPlayCircle } from "react-icons/fa";
import "../styles/components/TextToSpeech.scss";

function TextToSpeech({ index, text, languageCode }) {
  const [loading, setLoading] = useState(false);
  const [showDiv, setShowDiv] = useState(false);
  const primaryApiUrl = "https://text-to-speech-api3.p.rapidapi.com";
  const fallbackApiUrl =
    "https://realistic-text-to-speech.p.rapidapi.com/v3/generate_voice_over_v2";

  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;
  const call = async () => {
    setLoading(true);

    const options = {
      method: "GET",
      url: primaryApiUrl + "/speak",
      params: {
        text: text,
        lang: languageCode || "en",
      },
      responseType: "arraybuffer",
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host": primaryApiUrl,
      },
    };

    try {
      const response = await axios.request(options);
      const blob = new Blob([response.data], { type: "audio/mpeg" });
      const audioURL = URL.createObjectURL(blob);
      const audio = new Audio(audioURL);
      audio.play();
    } catch (error) {
      console.error(error);
      const encodedParams = new URLSearchParams();
      encodedParams.set("src", "Hello, world!");
      encodedParams.set("hl", "en-us");
      encodedParams.set("r", "0");
      encodedParams.set("c", "mp3");
      encodedParams.set("f", "8khz_8bit_mono");

      const optionsFallback = {
        method: "POST",
        url: fallbackApiUrl,
        headers: {
          "content-type": "application/json",
          "X-RapidAPI-Key": apiKey,
          "X-RapidAPI-Host": "realistic-text-to-speech.p.rapidapi.com",
        },
        data: {
          voice_obj: {
            id: 2014,
            voice_id: "en-US-Neural2-A",
            gender: "Male",
            language_code: "en-US",
            language_name: "US English",
            voice_name: "John",
            sample_text:
              "Hello, hope you are having a great time making your video.",
            sample_audio_url:
              "https://s3.ap-south-1.amazonaws.com/invideo-uploads-ap-south-1/speechen-US-Neural2-A16831901130600.mp3",
            status: 2,
            rank: 0,
            type: "google_tts",
            isPlaying: false,
          },
          json_data: [
            {
              block_index: 0,
              text: text,
            },
          ],
        },
      };

      try {
        console.log("converting failed, attempting another fallback API (english only)...");
        const fallbackResponse = await axios.request(optionsFallback);
        console.log(fallbackResponse.data);
        const audioURL = fallbackResponse.data[0].link;
        const audio = new Audio(audioURL);
        audio.play();
      } catch (fallbackError) {
        console.error(fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowDiv(true);
    }, index * 400);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading]);

  return (
    <div>
      {showDiv && (
        <div
          className={`text-to-speech ${loading ? "loading" : ""}`}
          onClick={call}
        >
          {loading ? (
            <div className="loading">
              {/* <GiSandsOfTime /> */}
              <img src={require("../assets/img/loading.gif")} alt="English" />
            </div>
          ) : (
            <div className="play">
              <FaPlayCircle />
            </div>
          )}
          <p>{text}</p>
        </div>
      )}
    </div>
  );
}

export default TextToSpeech;
