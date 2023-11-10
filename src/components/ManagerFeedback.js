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
  });

  return (
    <div>
      <h1>Manage Feedbacks</h1>
      <table>
        <thead>
          <tr>
            <th>UserId</th>
            <th>User Name</th>
            <th>Feedback</th>
            <th>Lesson</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.data.userid}</td>
              <td>{item.data.userName}</td>
              <td>{item.data.content}</td>
              <td>
                <a href={`/${item.data.language}/${item.data.lessonId}`}>
                  {item.data.lessonTitle}
                </a>
              </td>
              <td>
                {new Date(item.data.time.seconds * 1000).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ManagerFeedback;
