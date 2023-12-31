import React, { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../config/firebase-config";

function ManagerFeedback() {
  const [data, setData] = useState([]);

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
    console.log("I'm rendering!");
  }, []);

  return (
    <div className="table-container">
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
              <td className="user-id">{item.data.userid}</td>
              <td>{item.data.userName}</td>
              <td className="main">{item.data.content}</td>
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
