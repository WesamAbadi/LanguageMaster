import React, { useState, useEffect } from "react";
import axios from "axios";
import { IoLanguage } from "react-icons/io5";
import "../../styles/components/Translator.scss";
function Translator({ textToBeTranslated, languageCode }) {
  const [translatedText, setTranslatedText] = useState("");
  const apiKey = process.env.REACT_APP_RAPIDAPI_KEY;

  const translateContent = async () => {
    const options = {
      method: "GET",
      url: "https://translated-mymemory---translation-memory.p.rapidapi.com/get",
      params: {
        langpair: `${languageCode}|en`,
        q: `${textToBeTranslated}`,
        mt: "1",
        onlyprivate: "0",
        de: "a@b.c",
      },
      headers: {
        "X-RapidAPI-Key": apiKey,
        "X-RapidAPI-Host":
          "translated-mymemory---translation-memory.p.rapidapi.com",
      },
    };

    try {
      const response = await axios.request(options);
      setTranslatedText(response.data.responseData.translatedText);
      console.log("Translation successful:", response.data);
    } catch (error) {
      console.error("Translation error:", error);
    }
  };

  useEffect(() => {
    if (languageCode !== "en") {
      translateContent();
    }
    // eslint-disable-next-line
  }, [languageCode]);
  return (
    <div>
      {translatedText ? (
        <div className="translation">
          {translatedText}
          <div>
            <IoLanguage />
          </div>
        </div>
      ) : (
        <p></p>
      )}
    </div>
  );
}

export default Translator;
