import React, { useState } from "react";
import AddLanguage from "../components/AddLanguage";
import AddLesson from "../components/AddLesson/AddLesson";
import TabSwitch from "../components/TabSwitch";
import "../styles/pages/Admin.scss";

function Admin() {
  const [activeTab, setActiveTab] = useState(-5);
  const tabNames = [
    "Add a new language",
    "Add a new lesson",
    "Manage feedbacks",
    "Manage users",
  ];

  const [feedback, setFeedback] = useState({ message: "", type: "" });

  const updateFeedback = (message, type) => {
    setFeedback({ message, type });
  };

  const handleTabChange = (direction) => {
    setActiveTab(direction);
    console.log(`Active tab is now: ${activeTab}`);
  };

  return (
    <div>
      <div>
        <TabSwitch
          activeTab={activeTab}
          onTabChange={handleTabChange}
          tabs={tabNames}
        />

        {activeTab === 0 ? (
          <AddLanguage updateFeedback={updateFeedback} />
        ) : activeTab === 1 ? (
          <AddLesson updateFeedback={updateFeedback} />
        ) : activeTab === 2 ? (
          <p>SOON</p>
        ) : activeTab === 3 ? (
          <p>SOON</p>
        ) : (
          <p>Please select a tab</p>
        )}
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
      </div>
    </div>
  );
}

export default Admin;
