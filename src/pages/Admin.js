import React, { useState, useEffect } from "react";
import AddLanguage from "../components/AddLanguage";
import AddLesson from "../components/AddLesson/AddLesson";
import TabSwitch from "../components/TabSwitch";
import "../styles/pages/Admin.scss";

function Admin({ user }) {
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
  };

  const isAdminUser = user !== null && user.admin === true;

  return (
    <div>
      {isAdminUser ? (
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
      ) : (
        <div>
          <h1>Access Denied</h1>
          <p>You do not have permission to access this page.</p>
          <p>
            If you want to be an Admin at Language Master,
              <a href="#"><button>APPLY HERE</button></a>
          </p>
        </div>
      )}
    </div>
  );
}

export default Admin;
