import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase-config";

function Home() {
  const [languages, setLanguages] = useState([]);

  const fetchLanguages = async () => {
    const languagesCollection = collection(db, "languages");
    const languagesSnapshot = await getDocs(languagesCollection);
    const languagesData = languagesSnapshot.docs.map((doc) => ({
      id: doc.id,
      data: doc.data(),
    }));
    setLanguages(languagesData);
    console.log(languagesData);
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div>
      <h2>Home</h2>
      <p>what language do you wanna learn?</p>
      <select name="languages" id="languages">
        {languages.map((language) => (
          <option key={language.id} value={language.id}>
            {language.data.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Home;
