import React, { useState } from "react";
import AddLanguage from "../components/AddLanguage";
import AddLesson from "../components/AddLesson/AddLesson";
import TabSwitch from "../components/TabSwitch";
import "../styles/pages/Admin.scss";
import ManageUsers from "../components/ManageUsers";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase-config";
import ManagerFeedback from "../components/ManagerFeedback";

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

  const requestAdmin = async () => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        await updateDoc(userDocRef, {
          requestedAdminRights: true,
        });

        updateFeedback("Admin rights request submitted.", "success");
      } else {
        updateFeedback("User document not found.", "error");
      }
    } catch (error) {
      console.error("Error requesting admin rights:", error);
      updateFeedback("Error requesting admin rights.", "error");
    }
  };

  const isAdminUser = user !== null && user.admin === true;

  return (
    <div className="admin-container">
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
            <ManagerFeedback />
          ) : activeTab === 3 ? (
            <ManageUsers />
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
            {/* <a href="#">
              <button onClick={requestAdmin}>APPLY HERE</button>
            </a> */}
            <button onClick={requestAdmin}>APPLY HERE</button>
          </p>
        </div>
      )}
    </div>
  );
}

export default Admin;
