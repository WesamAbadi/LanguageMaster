import React, { useState } from "react";
import AddLanguage from "../components/AddLanguage";
import AddLesson from "../components/AddLesson";
import "../styles/pages/Admin.css";

function Admin() {
  const [activeTab, setActiveTab] = useState(0);
  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const updateFeedback = (message, type) => {
    setFeedback({ message, type });
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 1:
        return <AddLanguage updateFeedback={updateFeedback} />;
      case 2:
        return <AddLesson updateFeedback={updateFeedback} />;
      case 3:
        return null;
      case 4:
        return null;
      default:
        return (
          <div>
            <p>This is your dashboard, Admin!</p>
            <p>Start by selecting a tab</p>
          </div>
        );
    }
  };

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
        <div>
          {feedback.message && (
            <div
              className={
                feedback.type === "success"
                  ? "success-feedback"
                  : "error-feedback"
              }
            >
              {feedback.message}
              <button onClick={() => setFeedback({ message: "", type: "" })}>
                dismiss x
              </button>
            </div>
          )}
        </div>
        <div className="tab-content">{renderTabContent()}</div>
      </div>
    </div>
  );
}

export default Admin;
