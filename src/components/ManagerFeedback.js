import React, { useEffect } from "react";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
} from "firebase/firestore";
import { db } from "../config/firebase-config";

function ManagerFeedback() {
  const [data, setData] = React.useState([]);

  const fetchFeedbacks = async () => {
    try {
      const feedbacksCollection = collection(db, "feedbacks");
      const feedbacksSnapshot = await getDocs(feedbacksCollection);
      const feedbacksData = feedbacksSnapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
      setData(feedbacksData);
    } catch (error) {
      console.error("Error fetching feedbacks:", error);
    }
  };
  useEffect(() => {
    fetchFeedbacks();
  })

  return (
    <div>
      <h1>Manage Feedbacks</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>ID</th>
            <th>Admin</th>
            <th>Request to be admin?</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data.name}</td>
              <td>{item.id}</td>
              <td>{item.data.admin.toString()}</td>
              <td>
                {item.data.requestedAdminRights
                  ? item.data.requestedAdminRights.toString()
                  : "false"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerFeedback;
