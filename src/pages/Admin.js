import React, { useState, useEffect } from "react";
import { doc, collection, setDoc, getDocs } from "firebase/firestore";
import { auth, googleProvider, db } from "../config/firebase-config";
import AddLanguage from "../components/AddLanguage";
import "../styles/pages/Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState(0);
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
  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <AddLanguage />;
      case 2:
        return <w />;
      case 3:
        return <w />;
      case 4:
        return <w />;
      default:
        return (
          <div>
            <p>This is your dahsboard, Admin!</p>
            <p>Start by selecting a tab</p>
          </div>
        );
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  return (
    <div>
      <h2>Admin Page</h2>
      <div>
        <div className="tab-navigation">
          <button onClick={() => setActiveTab(1)}>Add a new language</button>
          <button onClick={() => setActiveTab(2)}>Add a new lesson</button>
          <button onClick={() => setActiveTab(3)}>Manage feedbacks</button>
          <button onClick={() => setActiveTab(4)}>Manage users</button>
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
      <p>The list of languages:</p>
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

export default Admin;
